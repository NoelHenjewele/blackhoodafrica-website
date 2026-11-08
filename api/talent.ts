// Public talent boards: approved profiles only, with privacy rules for under-18s.
import { adminClient } from './_lib/supabaseAdmin.js'
import { photosByProfile, photoUrl } from './_lib/profiles.js'

export async function GET(request: Request) {
  const page = new URL(request.url).searchParams.get('page')
  if (page) return modelPage(request, page)
  if (new URL(request.url).searchParams.has('sitemap')) return sitemap(request)
  if (new URL(request.url).searchParams.has('news')) return newsList()
  if (new URL(request.url).searchParams.has('reviews')) return reviewList()
  const pkg = new URL(request.url).searchParams.get('package')
  if (pkg) return packageLookup(pkg)
  const db = adminClient()
  if (!db) return Response.json({ ok: true, talent: [] })

  const { data } = await db
    .from('profiles')
    .select('id, slug, full_name, board, city, height_cm, bust, waist, hips, shoes, hair, eyes, instagram, tiktok, bio, is_minor')
    .eq('status', 'approved')
    .order('updated_at', { ascending: false })
  const rows = data ?? []
  const photos = await photosByProfile(db, rows.map((r) => r.id))

  const talent = rows
    .filter((r) => r.slug && (photos.get(r.id)?.length ?? 0) > 0)
    .map((r) => {
      const pics = photos.get(r.id) ?? []
      // Under-18s: first name, board and photos only. No city, socials or measurements.
      if (r.is_minor) {
        return { slug: r.slug, name: r.full_name.split(' ')[0], board: r.board, photos: pics, minor: true }
      }
      return {
        slug: r.slug,
        name: r.full_name,
        board: r.board,
        city: r.city,
        heightCm: r.height_cm,
        stats: { bust: r.bust, waist: r.waist, hips: r.hips, shoes: r.shoes, hair: r.hair, eyes: r.eyes },
        instagram: r.instagram,
        tiktok: r.tiktok,
        bio: r.bio,
        photos: pics,
      }
    })

  return Response.json({ ok: true, talent }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=600' } })
}

// /talent/:slug is rewritten here (vercel.json) so WhatsApp, Instagram and Google see the model's
// name and photo in link previews. Returns the normal app page with those tags swapped in.
const STATIC: Record<string, { name: string; photo: string; note: string }> = {
  'eladia-edwin': { name: 'Eladia Edwin', photo: '/talent/eladia-edwin/runway-stage.jpg', note: 'Miss Kinondoni 2027–2028 · Dar es Salaam' },
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

async function modelPage(request: Request, slug: string) {
  const origin = new URL(request.url).origin
  const html = await fetch(`${origin}/index.html`).then((r) => r.text())

  let person = STATIC[slug] ?? null
  const db = adminClient()
  if (!person && db) {
    const { data: r } = await db
      .from('profiles')
      .select('id, full_name, board, city, height_cm, is_minor')
      .eq('slug', slug)
      .eq('status', 'approved')
      .maybeSingle()
    if (r) {
      const photo = (await photosByProfile(db, [r.id])).get(r.id)?.[0]
      const name = r.is_minor ? r.full_name.split(' ')[0] : r.full_name
      const note = r.is_minor ? r.board ?? '' : [r.board, r.city, r.height_cm ? `${r.height_cm} cm` : ''].filter(Boolean).join(' · ')
      if (photo) person = { name, photo, note }
    }
  }
  if (!person) return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })

  const image = person.photo.startsWith('http') ? person.photo : origin + person.photo
  const title = `${person.name} · Blackhood Africa`
  const description = `${person.note ? person.note + '. ' : ''}Book ${person.name.split(' ')[0]} through Blackhood Africa, Dar es Salaam.`
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:url" content="${esc(`${origin}/talent/${slug}`)}" />`,
  ].join('\n    ')
  const out = html.replace(/<!--og-->[\s\S]*?<!--\/og-->/, tags)
  return new Response(out, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 's-maxage=300, stale-while-revalidate=3600' },
  })
}
// Client package page (/p/:token): the title, note and chosen model slugs. Client name stays private.
async function packageLookup(token: string) {
  const db = adminClient()
  if (!db || !/^[A-Za-z0-9]{8,32}$/.test(token)) return Response.json({ ok: false }, { status: 404 })
  const { data } = await db.from('packages').select('id, title, note, slugs, views').eq('token', token).maybeSingle()
  if (!data) return Response.json({ ok: false }, { status: 404 })
  await db.from('packages').update({ views: data.views + 1 }).eq('id', data.id)
  return Response.json(
    { ok: true, title: data.title, note: data.note, slugs: data.slugs },
    { headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' } },
  )
}
// /sitemap.xml (rewritten here): every public page plus each live model page, for Google.
const PAGES = ['', '/talent', '/clients', '/apply', '/academy', '/castings', '/gallery', '/news', '/stories', '/trust', '/about', '/faq', '/parents', '/verify']

async function sitemap(request: Request) {
  const origin = new URL(request.url).origin
  const db = adminClient()
  const slugs = new Set(Object.keys(STATIC))
  if (db) {
    const { data } = await db.from('profiles').select('slug').eq('status', 'approved').not('slug', 'is', null)
    for (const r of data ?? []) slugs.add(r.slug)
  }
  const urls = [...PAGES, ...[...slugs].map((s) => `/talent/${s}`)]
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${esc(origin + u)}</loc></url>`).join('\n') +
    '\n</urlset>\n'
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 's-maxage=3600' } })
}
// News & events page: latest posts first.
async function newsList() {
  const db = adminClient()
  if (!db) return Response.json({ ok: true, posts: [] })
  const { data } = await db.from('news').select('id, title, body, photo_path, video_url, created_at').order('created_at', { ascending: false }).limit(50)
  const posts = (data ?? []).map(({ photo_path, ...p }) => ({ ...p, photo: photo_path ? photoUrl(photo_path) : null }))
  return Response.json({ ok: true, posts }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=600' } })
}
// Approved reviews for the home page.
async function reviewList() {
  const db = adminClient()
  if (!db) return Response.json({ ok: true, reviews: [] })
  const { data } = await db.from('reviews').select('id, quote, name, role').eq('status', 'approved').order('created_at', { ascending: false }).limit(12)
  return Response.json({ ok: true, reviews: data ?? [] }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=600' } })
}

// /review form: anyone can send a review. It stays hidden until the team approves it on /admin.
export async function POST(request: Request) {
  const db = adminClient()
  if (db && new URL(request.url).searchParams.has('reminders')) return dueReminders(db, request)
  if (!db || !new URL(request.url).searchParams.has('review')) return Response.json({ ok: false }, { status: 400 })
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (body.website) return Response.json({ ok: true }) // honeypot
  const s = (k: string, max: number) => String(body[k] ?? '').trim().slice(0, max)
  const quote = s('quote', 600)
  const name = s('name', 80)
  if (quote.length < 10 || !name || body.consent !== true) return Response.json({ ok: false, error: 'missing' }, { status: 400 })
  const kind = ['client', 'model', 'parent', 'other'].includes(s('kind', 10)) ? s('kind', 10) : 'other'
  const { error } = await db.from('reviews').insert({ quote, name, role: s('role', 100), kind, contact: s('contact', 100) })
  return Response.json({ ok: !error }, { status: error ? 500 : 200 })
}
// Daily "finish your profile" reminders, called by the Sheet script (same shared secret as applications).
// Picks profiles not yet live that are still missing something, at most every 3 days and 3 times in total,
// marks them as reminded, and returns who to email and what to list.
const NEEDED: [string, string][] = [
  ['board', 'board'], ['city', 'city'], ['height_cm', 'height'], ['bust', 'bust'], ['waist', 'waist'],
  ['hips', 'hips'], ['shoes', 'shoe size'], ['hair', 'hair colour'], ['eyes', 'eye colour'],
]

async function dueReminders(db: NonNullable<ReturnType<typeof adminClient>>, request: Request) {
  const { secret } = (await request.json().catch(() => ({}))) as { secret?: string }
  if (!process.env.APPLY_SECRET || secret !== process.env.APPLY_SECRET) return Response.json({ ok: false }, { status: 403 })

  const dayAgo = new Date(Date.now() - 24 * 3600_000).toISOString()
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600_000).toISOString()
  const { data } = await db
    .from('profiles')
    .select('*')
    .in('status', ['draft', 'pending'])
    .lt('reminder_count', 3)
    .lt('created_at', dayAgo)
    .or(`last_reminded_at.is.null,last_reminded_at.lt.${threeDaysAgo}`)
  const rows = data ?? []
  const photos = await photosByProfile(db, rows.map((r) => r.id))

  const due = []
  for (const r of rows) {
    const missing = [
      ...(photos.get(r.id)?.length ? [] : ['a photo']),
      ...NEEDED.filter(([k]) => !r[k]).map(([, label]) => label),
    ]
    if (!missing.length) continue
    await db.from('profiles').update({ reminder_count: (r.reminder_count ?? 0) + 1, last_reminded_at: new Date().toISOString() }).eq('id', r.id)
    due.push({ email: r.email, name: r.full_name, missing: missing.join(', '), code: /^BHA-T-/.test(r.talent_code) ? r.talent_code : '' })
  }
  return Response.json({ ok: true, due })
}