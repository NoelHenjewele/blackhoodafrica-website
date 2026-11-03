// Team review API for /admin. Only emails in the `admins` table can use it.
import { randomBytes } from 'node:crypto'
import { adminClient, callSheet } from '../_lib/supabaseAdmin.js'
import { photosByProfile, requireAdmin, slugify } from '../_lib/profiles.js'

const ORDER: Record<string, number> = { pending: 0, draft: 1, approved: 2, hidden: 3 }

export async function GET(request: Request) {
  const db = adminClient()
  // ?check=1 just tells the header whether to show the Admin button (kept here: Vercel's free plan allows 12 functions).
  if (new URL(request.url).searchParams.has('check')) return Response.json({ admin: !!db && !!(await requireAdmin(db, request)) })
  if (!db) return Response.json({ ok: false }, { status: 503 })
  if (!(await requireAdmin(db, request))) return Response.json({ ok: false, error: 'not admin' }, { status: 403 })
  if (new URL(request.url).searchParams.has('certificates')) {
    const { data: certificates, error } = await db.from('certificates').select('*').order('created_at', { ascending: false })
    return Response.json({ ok: !error, certificates: certificates ?? [] })
  }
  if (new URL(request.url).searchParams.has('reviews')) {
    const { data: reviews, error } = await db.from('reviews').select('*').order('created_at', { ascending: false })
    return Response.json({ ok: !error, reviews: reviews ?? [] })
  }
  if (new URL(request.url).searchParams.has('packages')) {
    const { data: packages, error } = await db.from('packages').select('*').order('created_at', { ascending: false })
    return Response.json({ ok: !error, packages: packages ?? [] })
  }

  const { data } = await db.from('profiles').select('*').order('updated_at', { ascending: false })
  const rows = data ?? []
  const photos = await photosByProfile(db, rows.map((r) => r.id))
  const today = new Date().toISOString().slice(0, 10)
  const { data: busyRows } = await db.from('busy_days').select('profile_id, day').gte('day', today).order('day')
  const { data: consentRows } = await db.from('parent_consents').select('profile_id, parent_name, relationship, phone, signed_at')
  const consent = new Map((consentRows ?? []).map((c) => [c.profile_id, c]))
  const busy = new Map<string, string[]>()
  for (const b of busyRows ?? []) busy.set(b.profile_id, [...(busy.get(b.profile_id) ?? []), b.day])
  const profiles = rows
    .map((r) => ({ ...r, photos: photos.get(r.id) ?? [], busy: busy.get(r.id) ?? [], consent: consent.get(r.id) ?? null }))
    .sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9))
  return Response.json({ ok: true, profiles })
}

type Action = { id?: string; status?: 'approved' | 'hidden' | 'pending'; is_minor?: boolean }

export async function POST(request: Request) {
  const db = adminClient()
  if (!db) return Response.json({ ok: false }, { status: 503 })
  if (!(await requireAdmin(db, request))) return Response.json({ ok: false, error: 'not admin' }, { status: 403 })
  if (new URL(request.url).searchParams.has('packages')) return packagesPOST(db, request)
  if (new URL(request.url).searchParams.has('news')) return newsPOST(db, request)
  if (new URL(request.url).searchParams.has('reviews')) return reviewsPOST(db, request)
  if (new URL(request.url).searchParams.has('certificates')) return certificatesPOST(db, request)

  let body: Action
  try {
    body = (await request.json()) as Action
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (!body.id) return Response.json({ ok: false }, { status: 400 })

  const { data: current } = await db.from('profiles').select('full_name, talent_code, slug, email').eq('id', body.id).maybeSingle()
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

  // First approval only: tell the model their page is live. Later re-approvals (after edits) stay quiet.
  if (patch.slug) {
    await callSheet({ type: 'profile-live', email: current.email, name: current.full_name, slug: patch.slug })
  }
  return Response.json({ ok: true })
}

// Client packages (?packages=1): create or delete a private link with a hand-picked set of models.
type PackageBody = { action?: 'create' | 'delete'; id?: string; title?: string; client?: string; note?: string; slugs?: unknown }

async function packagesPOST(db: NonNullable<ReturnType<typeof adminClient>>, request: Request) {
  let body: PackageBody
  try {
    body = (await request.json()) as PackageBody
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (body.action === 'delete' && body.id) {
    const { error } = await db.from('packages').delete().eq('id', body.id)
    return Response.json({ ok: !error })
  }
  const slugs = Array.isArray(body.slugs) ? body.slugs.map(String).filter((s) => /^[a-z0-9-]{1,80}$/.test(s)).slice(0, 30) : []
  const title = String(body.title ?? '').trim().slice(0, 120)
  if (!title || !slugs.length) return Response.json({ ok: false, error: 'title and models needed' }, { status: 400 })
  // 12 letters/numbers: unguessable, still short enough for WhatsApp.
  const token = randomBytes(9).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 12).padEnd(12, 'x')
  const { error } = await db.from('packages').insert({
    token,
    title,
    client: String(body.client ?? '').trim().slice(0, 120),
    note: String(body.note ?? '').trim().slice(0, 1000),
    slugs,
  })
  return Response.json({ ok: !error, token }, { status: error ? 500 : 200 })
}
// News posts (?news=1): create (with an optional JPEG, base64) or delete. The public list is in api/talent.ts.
type NewsBody = { action?: 'create' | 'delete'; id?: string; title?: string; body?: string; photo?: string; video?: string }

async function newsPOST(db: NonNullable<ReturnType<typeof adminClient>>, request: Request) {
  let body: NewsBody
  try {
    body = (await request.json()) as NewsBody
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (body.action === 'delete' && body.id) {
    const { data } = await db.from('news').select('photo_path').eq('id', body.id).maybeSingle()
    if (data?.photo_path) await db.storage.from('talent-photos').remove([data.photo_path])
    const { error } = await db.from('news').delete().eq('id', body.id)
    return Response.json({ ok: !error })
  }
  const title = String(body.title ?? '').trim().slice(0, 160)
  if (!title) return Response.json({ ok: false, error: 'title' }, { status: 400 })
  let photo_path: string | null = null
  if (body.photo) {
    const bytes = Buffer.from(body.photo, 'base64')
    if (bytes.length > 2_000_000) return Response.json({ ok: false, error: 'photo too big' }, { status: 400 })
    photo_path = `news/${crypto.randomUUID()}.jpg`
    const { error } = await db.storage.from('talent-photos').upload(photo_path, bytes, { contentType: 'image/jpeg' })
    if (error) return Response.json({ ok: false, error: 'upload' }, { status: 500 })
  }
  const video = String(body.video ?? '').trim()
  const video_url = /^https:\/\/([a-z]+\.)?(tiktok\.com|youtube\.com|youtu\.be)\//i.test(video) ? video.slice(0, 300) : null
  if (video && !video_url) return Response.json({ ok: false, error: 'video link' }, { status: 400 })
  const { error } = await db.from('news').insert({ title, body: String(body.body ?? '').trim().slice(0, 4000), photo_path, video_url })
  return Response.json({ ok: !error }, { status: error ? 500 : 200 })
}
// Reviews (?reviews=1): approve, hide, edit the wording, or delete.
type ReviewBody = { id?: string; status?: 'approved' | 'hidden' | 'pending'; quote?: string; role?: string; delete?: boolean }

async function reviewsPOST(db: NonNullable<ReturnType<typeof adminClient>>, request: Request) {
  let body: ReviewBody
  try {
    body = (await request.json()) as ReviewBody
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (!body.id) return Response.json({ ok: false }, { status: 400 })
  if (body.delete) {
    const { error } = await db.from('reviews').delete().eq('id', body.id)
    return Response.json({ ok: !error })
  }
  const patch: Record<string, string> = {}
  if (body.status && ['approved', 'hidden', 'pending'].includes(body.status)) patch.status = body.status
  if (typeof body.quote === 'string' && body.quote.trim()) patch.quote = body.quote.trim().slice(0, 600)
  if (typeof body.role === 'string') patch.role = body.role.trim().slice(0, 100)
  const { error } = await db.from('reviews').update(patch).eq('id', body.id)
  return Response.json({ ok: !error })
}
// Academy certificates (?certificates=1): issue (next BHA-C-#### number) or delete.
type CertBody = { action?: 'create' | 'delete'; id?: string; name?: string; course?: string; issued_on?: string }

async function certificatesPOST(db: NonNullable<ReturnType<typeof adminClient>>, request: Request) {
  let body: CertBody
  try {
    body = (await request.json()) as CertBody
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (body.action === 'delete' && body.id) {
    const { error } = await db.from('certificates').delete().eq('id', body.id)
    return Response.json({ ok: !error })
  }
  const name = String(body.name ?? '').trim().slice(0, 100)
  const course = String(body.course ?? '').trim().slice(0, 140)
  const issued_on = /^\d{4}-\d{2}-\d{2}$/.test(String(body.issued_on)) ? String(body.issued_on) : new Date().toISOString().slice(0, 10)
  if (!name || !course) return Response.json({ ok: false, error: 'name and course' }, { status: 400 })
  const { data: last } = await db.from('certificates').select('code').order('code', { ascending: false }).limit(1).maybeSingle()
  const next = (last ? Number(last.code.slice(-4)) : 0) + 1
  const code = `BHA-C-${String(next).padStart(4, '0')}`
  const { data, error } = await db.from('certificates').insert({ code, name, course, issued_on }).select().single()
  return Response.json({ ok: !error, certificate: data }, { status: error ? 500 : 200 })
}