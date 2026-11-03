// Castings board. Public: anyone reads open castings; approved models tap "I'm interested".
// Team (?admin=1): post, close, reopen, delete, and see who's interested. One file because Vercel's free plan allows 12 functions.
import { adminClient, callSheet } from './_lib/supabaseAdmin.js'
import { photosByProfile, requireAdmin, userFromRequest } from './_lib/profiles.js'

const isAdmin = (request: Request) => new URL(request.url).searchParams.has('admin')

export async function GET(request: Request) {
  if (isAdmin(request)) return adminGET(request)
  const db = adminClient()
  if (!db) return Response.json({ ok: true, castings: [], interested: [], canApply: false })

  const { data } = await db
    .from('castings')
    .select('id, title, type, date_text, place, details')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
  const castings = data ?? []

  const user = await userFromRequest(db, request)
  if (!user) {
    return Response.json({ ok: true, castings, interested: [], canApply: false }, { headers: { 'Cache-Control': 's-maxage=60' } })
  }

  const { data: profile } = await db.from('profiles').select('status').eq('id', user.id).maybeSingle()
  const { data: mine } = await db.from('casting_interest').select('casting_id').eq('profile_id', user.id)
  return Response.json(
    {
      ok: true,
      castings,
      interested: (mine ?? []).map((r) => r.casting_id),
      canApply: profile?.status === 'approved',
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}

export async function POST(request: Request) {
  if (isAdmin(request)) return adminPOST(request)
  const db = adminClient()
  if (!db) return Response.json({ ok: false }, { status: 503 })
  const user = await userFromRequest(db, request)
  if (!user) return Response.json({ ok: false, error: 'login' }, { status: 401 })

  let body: { id?: string; interested?: boolean }
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (!body.id) return Response.json({ ok: false }, { status: 400 })

  const { data: profile } = await db.from('profiles').select('status').eq('id', user.id).maybeSingle()
  if (profile?.status !== 'approved') return Response.json({ ok: false, error: 'not approved' }, { status: 403 })

  if (body.interested) {
    const { data: casting } = await db.from('castings').select('status').eq('id', body.id).maybeSingle()
    if (casting?.status !== 'open') return Response.json({ ok: false, error: 'closed' }, { status: 409 })
    await db.from('casting_interest').upsert({ casting_id: body.id, profile_id: user.id })
  } else {
    await db.from('casting_interest').delete().eq('casting_id', body.id).eq('profile_id', user.id)
  }
  return Response.json({ ok: true })
}

// ---- Team side ----

async function adminGET(request: Request) {
  const db = adminClient()
  if (!db) return Response.json({ ok: false }, { status: 503 })
  if (!(await requireAdmin(db, request))) return Response.json({ ok: false, error: 'not admin' }, { status: 403 })

  const { data: castings } = await db.from('castings').select('*').order('created_at', { ascending: false })
  const { data: interest } = await db.from('casting_interest').select('casting_id, profile_id, created_at').order('created_at')
  const ids = [...new Set((interest ?? []).map((r) => r.profile_id))]
  const { data: profiles } = ids.length
    ? await db.from('profiles').select('id, full_name, talent_code, email, slug, board, city, height_cm').in('id', ids)
    : { data: [] }
  const photos = await photosByProfile(db, ids)
  const byId = new Map((profiles ?? []).map((p) => [p.id, { ...p, photo: photos.get(p.id)?.[0] ?? null }]))

  const list = (castings ?? []).map((c) => ({
    ...c,
    interested: (interest ?? []).filter((r) => r.casting_id === c.id).map((r) => byId.get(r.profile_id)).filter(Boolean),
  }))
  return Response.json({ ok: true, castings: list })
}

type Body = {
  action?: 'create' | 'close' | 'open' | 'delete'
  id?: string
  title?: string
  type?: string
  date_text?: string
  place?: string
  details?: string
  notify?: boolean
}

const text = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

async function adminPOST(request: Request) {
  const db = adminClient()
  if (!db) return Response.json({ ok: false }, { status: 503 })
  if (!(await requireAdmin(db, request))) return Response.json({ ok: false, error: 'not admin' }, { status: 403 })

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  if (body.action === 'create') {
    const title = text(body.title, 120)
    if (!title) return Response.json({ ok: false, error: 'title' }, { status: 400 })
    const casting = {
      title,
      type: text(body.type, 60),
      date_text: text(body.date_text, 80),
      place: text(body.place, 120),
      details: text(body.details, 2000),
    }
    const { error } = await db.from('castings').insert(casting)
    if (error) return Response.json({ ok: false }, { status: 500 })

    // Optional: email every approved model about the new casting.
    let sent = 0
    if (body.notify) {
      const { data: models } = await db.from('profiles').select('email').eq('status', 'approved')
      const emails = (models ?? []).map((m) => m.email).filter(Boolean)
      const r = await callSheet<{ ok: boolean; sent?: number }>({ type: 'casting-alert', emails, casting })
      sent = r?.sent ?? 0
    }
    return Response.json({ ok: true, sent })
  }

  if (!body.id) return Response.json({ ok: false }, { status: 400 })
  const { error } =
    body.action === 'delete'
      ? await db.from('castings').delete().eq('id', body.id)
      : body.action === 'close' || body.action === 'open'
        ? await db.from('castings').update({ status: body.action === 'close' ? 'closed' : 'open' }).eq('id', body.id)
        : { error: 'bad action' }
  return Response.json({ ok: !error }, { status: error ? 400 : 200 })
}
