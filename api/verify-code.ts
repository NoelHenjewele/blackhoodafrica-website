// Vercel Function: checks a talent code (BHA-T-0001) against the Applications sheet.
// Returns only whether it is valid and, if so, the talent's name.

export async function GET(request: Request) {
  const url = process.env.APPLY_SCRIPT_URL
  const secret = process.env.APPLY_SECRET
  if (!url || !secret) return Response.json({ ok: false, error: 'not configured' }, { status: 503 })

  const code = (new URL(request.url).searchParams.get('code') ?? '').trim().toUpperCase()
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
