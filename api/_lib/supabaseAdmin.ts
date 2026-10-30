// Server-only Supabase client using the secret key (Vercel setting SUPABASE_SECRET_KEY). Never import this in src/.
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'

const SUPABASE_URL = 'https://okhbffslttanrqljubdv.supabase.co'

export function adminClient() {
  const key = process.env.SUPABASE_SECRET_KEY
  if (!key) return null
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function hashCode(email: string, code: string) {
  return createHash('sha256').update(`${email.toLowerCase()}:${code}`).digest('hex')
}

export function normaliseEmail(v: unknown) {
  const s = String(v ?? '').trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : ''
}

// Calls the Google Apps Script (same one as /api/apply) with a typed request.
export async function callSheet<T>(payload: Record<string, unknown>): Promise<T | null> {
  const url = process.env.APPLY_SCRIPT_URL
  const secret = process.env.APPLY_SECRET
  if (!url || !secret) return null
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...payload, secret }),
      redirect: 'follow',
    })
    return (await res.json()) as T
  } catch {
    return null
  }
}
