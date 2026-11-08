// Turns a website application into a "pending" model profile with her photos, so the team can approve her
// with one tap on /admin (no Sheet step, no login needed). Existing models are never overwritten.
import { randomUUID } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'

export type Application = {
  ref: string
  name: string
  email: string
  age: number
  gender?: string
  height?: number | string
  city?: string
  social?: string
  interest?: string
  experience?: string
  photos: { headshot?: string; full?: string; side?: string }
  talentCode?: string // already approved in the Sheet (imports of older applications)
}

function boardFor(a: Application) {
  if (/creator|ugc/i.test(a.interest ?? '')) return 'Creators'
  return 'New Faces' // every new applicant starts on the New Faces board; the model or team can change it later
}

export async function createPendingProfile(db: SupabaseClient, a: Application) {
  const email = a.email.trim().toLowerCase()
  const { data: existing } = await db.from('profiles').select('id').eq('email', email).maybeSingle()
  if (existing) {
    // Older sign-ups (e.g. logged in but never added photos): give them their application photos.
    const { count } = await db.from('photos').select('id', { count: 'exact', head: true }).eq('profile_id', existing.id)
    if (count) return { created: false, reason: 'exists' }
    await addPhotos(db, existing.id, a.photos)
    return { created: false, reason: 'photos added' }
  }

  const user = await db.auth.admin.createUser({ email, email_confirm: true })
  const id = user.data.user?.id
  if (!id) return { created: false, reason: 'user' } // e.g. a team login already uses this email

  const height = Number(a.height)
  const { error } = await db.from('profiles').insert({
    id,
    email,
    full_name: a.name.trim().slice(0, 100),
    talent_code: a.talentCode && /^BHA-T-\d{4}$/.test(a.talentCode) ? a.talentCode : a.ref, // ref is swapped for a BHA-T code on approval
    status: 'pending',
    board: boardFor(a),
    city: a.city?.trim().slice(0, 80) || null,
    height_cm: Number.isFinite(height) && height > 100 ? Math.round(height) : null,
    instagram: a.social?.trim().slice(0, 60) || null,
    bio: a.experience?.trim().slice(0, 400) || null,
    is_minor: a.age < 18,
  })
  if (error) {
    await db.auth.admin.deleteUser(id)
    return { created: false, reason: 'profile' }
  }

  await addPhotos(db, id, a.photos)
  return { created: true }
}

// Application photos become her profile photos (headshot first = main picture).
async function addPhotos(db: SupabaseClient, id: string, photos: Application['photos']) {
  let position = 0
  for (const key of ['headshot', 'full', 'side'] as const) {
    const b64 = photos[key]
    if (!b64) continue
    const path = `${id}/${randomUUID()}.jpg`
    const up = await db.storage.from('talent-photos').upload(path, Buffer.from(b64, 'base64'), { contentType: 'image/jpeg' })
    if (!up.error) await db.from('photos').insert({ profile_id: id, path, position: position++ })
  }
}
