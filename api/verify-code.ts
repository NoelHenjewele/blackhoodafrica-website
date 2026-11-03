// Vercel Function: checks a talent code (BHA-T-0001) against the Applications sheet,
// or an academy certificate code (BHA-C-0001) in Supabase. Returns only whether it is valid and the name.
import { adminClient } from './_lib/supabaseAdmin.js'

export async function GET(request: Request) {
  const url = process.env.APPLY_SCRIPT_URL
  const secret = process.env.APPLY_SECRET
  if (!url || !secret) return Response.json({ ok: false, error: 'not configured' }, { status: 503 })

  const code = (new URL(request.url).searchParams.get('code') ?? '').trim().toUpperCase()
  if (/^BHA-C-\d{4}$/.test(code)) {
    const db = adminClient()
    if (!db) return Response.json({ ok: false }, { status: 503 })
    const { data } = await db.from('certificates').select('name, course, issued_on').eq('code', code).maybeSingle()
    return Response.json(
      data ? { ok: true, valid: true, kind: 'certificate', name: data.name, course: data.course, issued: data.issued_on } : { ok: true, valid: false },
      { headers: { 'Cache-Control': 's-maxage=60' } },
    )
  }
  if (!/^BHA-T-\d{4}$/.test(code)) return Response.json({ ok: true, valid: false })

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: 'verify', code, secret }),
      redirect: 'follow',
    })
    const result = (await res.json()) as { ok: boolean; valid?: boolean; name?: string }
    if (!result.ok) return Response.json({ ok: false }, { status: 502 })
    return Response.json(
      { ok: true, valid: !!result.valid, name: result.valid ? result.name : undefined },
      // Short cache so a newly approved (or switched-off) code shows correctly within a minute.
      { headers: { 'Cache-Control': 's-maxage=60' } },
    )
  } catch {
    return Response.json({ ok: false }, { status: 502 })
  }
}
