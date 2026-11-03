// Team castings API for /admin: post, close, reopen, delete, and see who's interested.
import { adminClient } from '../_lib/supabaseAdmin.js'
import { photosByProfile, requireAdmin } from '../_lib/profiles.js'

export async function GET(request: Request) {
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
}

const text = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

export async function POST(request: Request) {
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
    const { error } = await db.from('castings').insert({
      title,
      type: text(body.type, 60),
      date_text: text(body.date_text, 80),
      place: text(body.place, 120),
      details: text(body.details, 2000),
    })
    return Response.json({ ok: !error }, { status: error ? 500 : 200 })
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
