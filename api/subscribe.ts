// Vercel Function: newsletter sign-up, forwarded to the Google Sheet script ("Subscribers" tab).
// Uses the same settings as /api/apply: APPLY_SCRIPT_URL and APPLY_SECRET.

type Body = { email?: string; name?: string; interest?: string; lang?: string; source?: string; website?: string }

export async function POST(request: Request) {
  const url = process.env.APPLY_SCRIPT_URL
  const secret = process.env.APPLY_SECRET
  if (!url || !secret) return Response.json({ ok: false, error: 'not configured' }, { status: 503 })

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return Response.json({ ok: false, error: 'bad request' }, { status: 400 })
  }

  if (body.website) return Response.json({ ok: true })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email?.trim() ?? '')) {
    return Response.json({ ok: false, error: 'invalid email' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...body, type: 'subscribe', secret }),
      redirect: 'follow',
    })
    const result = (await res.json()) as { ok: boolean; already?: boolean }
    if (!result.ok) return Response.json({ ok: false, error: 'save failed' }, { status: 502 })
    return Response.json({ ok: true, already: !!result.already })
  } catch {
    return Response.json({ ok: false, error: 'save failed' }, { status: 502 })
  }
}
