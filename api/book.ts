// Vercel Function: receives a booking request from /clients and forwards it to the Google Sheet script
// (same script and settings as /api/apply: APPLY_SCRIPT_URL and APPLY_SECRET).

type Body = {
  name?: string
  company?: string
  phone?: string
  email?: string
  jobType?: string
  dates?: string
  location?: string
  talent?: string
  budget?: string
  usage?: string
  notes?: string
  lang?: string
  website?: string // honeypot
}

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

  if (body.website) return Response.json({ ok: true, ref: 'BKG-OK' })

  const missing = !body.name?.trim() || !body.email?.trim() || !body.phone?.trim() || !body.jobType?.trim() || !body.dates?.trim()
  if (missing) return Response.json({ ok: false, error: 'missing fields' }, { status: 400 })

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...body, type: 'booking', secret }),
      redirect: 'follow',
    })
    const result = (await res.json()) as { ok: boolean; ref?: string }
    if (!result.ok) return Response.json({ ok: false, error: 'save failed' }, { status: 502 })
    return Response.json({ ok: true, ref: result.ref })
  } catch {
    return Response.json({ ok: false, error: 'save failed' }, { status: 502 })
  }
}
