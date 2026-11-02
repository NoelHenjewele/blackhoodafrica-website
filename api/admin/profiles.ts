// Team review API for /admin. Only emails in the `admins` table can use it.
import { adminClient } from '../_lib/supabaseAdmin.js'
import { photosByProfile, requireAdmin, slugify } from '../_lib/profiles.js'

const ORDER: Record<string, number> = { pending: 0, draft: 1, approved: 2, hidden: 3 }

export async function GET(request: Request) {
  const db = adminClient()
  if (!db) return Response.json({ ok: false }, { status: 503 })
  if (!(await requireAdmin(db, request))) return Response.json({ ok: false, error: 'not admin' }, { status: 403 })

  const { data } = await db.from('profiles').select('*').order('updated_at', { ascending: false })
  const rows = data ?? []
  const photos = await photosByProfile(db, rows.map((r) => r.id))
  const profiles = rows
    .map((r) => ({ ...r, photos: photos.get(r.id) ?? [] }))
    .sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9))
  return Response.json({ ok: true, profiles })
}

type Action = { id?: string; status?: 'approved' | 'hidden' | 'pending'; is_minor?: boolean }

export async function POST(request: Request) {
  const db = adminClient()
  if (!db) return Response.json({ ok: false }, { status: 503 })
  if (!(await requireAdmin(db, request))) return Response.json({ ok: false, error: 'not admin' }, { status: 403 })

  let body: Action
  try {
    body = (await request.json()) as Action
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (!body.id) return Response.json({ ok: false }, { status: 400 })

  const { data: current } = await db.from('profiles').select('full_name, talent_code, slug').eq('id', body.id).maybeSingle()
  if (!current) return Response.json({ ok: false, error: 'not found' }, { status: 404 })

  const patch: Record<string, unknown> = {}
  if (body.status && ['approved', 'hidden', 'pending'].includes(body.status)) patch.status = body.status
  if (typeof body.is_minor === 'boolean') patch.is_minor = body.is_minor
  if (patch.status === 'approved' && !current.slug) {
    // Page address from the name; the talent code's number keeps it unique.
    patch.slug = `${slugify(current.full_name)}-${current.talent_code.slice(-4)}`
  }

  const { error } = await db.from('profiles').update(patch).eq('id', body.id)
  if (error) return Response.json({ ok: false }, { status: 500 })
  return Response.json({ ok: true })
}
