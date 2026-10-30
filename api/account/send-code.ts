// Step 1 of login: email a 6-digit code.
// New accounts are invite-only: the talent code must be approved in the sheet AND belong to this email.
import { randomInt } from 'node:crypto'
import { adminClient, callSheet, hashCode, normaliseEmail } from '../_lib/supabaseAdmin.js'

type Body = { email?: string; talentCode?: string; lang?: string }

export async function POST(request: Request) {
  const db = adminClient()
  if (!db) return Response.json({ ok: false, error: 'not configured' }, { status: 503 })

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return Response.json({ ok: false, error: 'bad request' }, { status: 400 })
  }
  const email = normaliseEmail(body.email)
  if (!email) return Response.json({ ok: false, error: 'invalid email' }, { status: 400 })

  const { data: existing } = await db.from('profiles').select('id').eq('email', email).maybeSingle()

  if (!existing) {
    const talentCode = String(body.talentCode ?? '').trim().toUpperCase()
    if (!/^BHA-T-\d{4}$/.test(talentCode)) return Response.json({ ok: false, error: 'needs code' })

    const check = await callSheet<{ ok: boolean; valid?: boolean; name?: string }>({ type: 'verify-email', code: talentCode, email })
    if (!check?.ok) return Response.json({ ok: false, error: 'server' }, { status: 502 })
    if (!check.valid || !check.name) return Response.json({ ok: false, error: 'no match' })

    const { data: taken } = await db.from('profiles').select('id').eq('talent_code', talentCode).maybeSingle()
    if (taken) return Response.json({ ok: false, error: 'code used' })

    const created = await db.auth.admin.createUser({ email, email_confirm: true })
    const userId = created.data.user?.id
    if (!userId) return Response.json({ ok: false, error: 'server' }, { status: 500 })
    const { error } = await db.from('profiles').insert({ id: userId, talent_code: talentCode, full_name: check.name, email })
    if (error) return Response.json({ ok: false, error: 'server' }, { status: 500 })
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  const { data: prev } = await db.from('login_codes').select('expires_at').eq('email', email).maybeSingle()
  // At most one new code a minute per email.
  if (prev && new Date(prev.expires_at).getTime() - 9 * 60_000 > Date.now()) {
    return Response.json({ ok: false, error: 'wait' })
  }
  await db.from('login_codes').upsert({
    email,
    code_hash: hashCode(email, code),
    expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
    attempts: 0,
  })

  const sent = await callSheet<{ ok: boolean }>({ type: 'login-code', email, code, lang: body.lang === 'sw' ? 'sw' : 'en' })
  if (!sent?.ok) return Response.json({ ok: false, error: 'email failed' }, { status: 502 })
  return Response.json({ ok: true })
}
