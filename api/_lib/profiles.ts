// Shared helpers for reading profiles + photos on the server.
import type { SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://okhbffslttanrqljubdv.supabase.co'
export const photoUrl = (path: string) => `${SUPABASE_URL}/storage/v1/object/public/talent-photos/${path}`

export type PhotoRow = { id: string; profile_id: string; path: string; position: number }

export async function photosByProfile(db: SupabaseClient, ids: string[]) {
  const map = new Map<string, string[]>()
  if (!ids.length) return map
  const { data } = await db.from('photos').select('profile_id, path, position').in('profile_id', ids).order('position')
  for (const p of (data ?? []) as PhotoRow[]) {
    const list = map.get(p.profile_id) ?? []
    list.push(photoUrl(p.path))
    map.set(p.profile_id, list)
  }
  return map
}

// Returns the signed-in admin's email, or null. The browser sends its Supabase access token.
export async function requireAdmin(db: SupabaseClient, request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data } = await db.auth.getUser(token)
  const email = data.user?.email?.toLowerCase()
  if (!email) return null
  const { data: admin } = await db.from('admins').select('email').eq('email', email).maybeSingle()
  return admin ? email : null
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}
