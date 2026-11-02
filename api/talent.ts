// Public talent boards: approved profiles only, with privacy rules for under-18s.
import { adminClient } from './_lib/supabaseAdmin.js'
import { photosByProfile } from './_lib/profiles.js'

export async function GET() {
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
