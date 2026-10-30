// Step 2 of login: check the 6-digit code, then hand the browser a one-time token it exchanges for a session.
import { adminClient, hashCode, normaliseEmail } from '../_lib/supabaseAdmin.js'

export async function POST(request: Request) {
  const db = adminClient()
  if (!db) return Response.json({ ok: false, error: 'not configured' }, { status: 503 })

  let body: { email?: string; code?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'bad request' }, { status: 400 })
  }
  const email = normaliseEmail(body.email)
  const code = String(body.code ?? '').replace(/\D/g, '')
  if (!email || code.length !== 6) return Response.json({ ok: false, error: 'invalid' })

  const { data: row } = await db.from('login_codes').select('*').eq('email', email).maybeSingle()
  if (!row || new Date(row.expires_at).getTime() < Date.now()) return Response.json({ ok: false, error: 'expired' })
  if (row.attempts >= 5) return Response.json({ ok: false, error: 'too many' })

  if (row.code_hash !== hashCode(email, code)) {
    await db.from('login_codes').update({ attempts: row.attempts + 1 }).eq('email', email)
    return Response.json({ ok: false, error: 'wrong code' })
  }

  await db.from('login_codes').delete().eq('email', email)
  const link = await db.auth.admin.generateLink({ type: 'magiclink', email })
  const tokenHash = link.data.properties?.hashed_token
  if (!tokenHash) return Response.json({ ok: false, error: 'server' }, { status: 500 })
  return Response.json({ ok: true, tokenHash })
}
