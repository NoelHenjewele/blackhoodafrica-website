// Public castings board. Anyone can read open castings; approved models can tap "I'm interested".
import { adminClient } from './_lib/supabaseAdmin.js'
import { userFromRequest } from './_lib/profiles.js'

export async function GET(request: Request) {
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
