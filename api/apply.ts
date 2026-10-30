// Vercel Function: receives an application from /apply and forwards it to the Google Sheet script.
// Settings in Vercel: APPLY_SCRIPT_URL (the Apps Script web app URL) and APPLY_SECRET (shared with the script).

type Body = {
  name?: string
  age?: number | string
  gender?: string
  height?: number | string
  city?: string
  phone?: string
  email?: string
  social?: string
  interest?: string
  experience?: string
  guardianName?: string
  guardianPhone?: string
  lang?: string
  website?: string // honeypot: real people never fill this
  photos?: { headshot?: string; full?: string; side?: string }
}

// The browser shrinks photos to ~200 KB before sending; this cap keeps 3 photos under Vercel's 4.5 MB body limit.
const MAX_PHOTO_CHARS = 1_000_000

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

  // Bots fill every field; quietly accept and drop.
  if (body.website) return Response.json({ ok: true, ref: 'BHA-OK' })

  const age = Number(body.age)
  const missing =
    !body.name?.trim() || !body.phone?.trim() || !body.email?.trim() || !body.city?.trim() || !Number.isFinite(age) || !body.photos?.headshot || !body.photos?.full
  if (missing) return Response.json({ ok: false, error: 'missing fields' }, { status: 400 })
  if (age < 18 && (!body.guardianName?.trim() || !body.guardianPhone?.trim())) {
    return Response.json({ ok: false, error: 'guardian required' }, { status: 400 })
  }
  for (const p of Object.values(body.photos ?? {})) {
    if (p && p.length > MAX_PHOTO_CHARS) return Response.json({ ok: false, error: 'photo too large' }, { status: 413 })
  }

  try {
    // Apps Script answers with a redirect to the result; fetch follows it.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...body, secret }),
      redirect: 'follow',
    })
    const result = (await res.json()) as { ok: boolean; ref?: string; error?: string }
    if (!result.ok) return Response.json({ ok: false, error: 'save failed' }, { status: 502 })
    return Response.json({ ok: true, ref: result.ref })
  } catch {
    return Response.json({ ok: false, error: 'save failed' }, { status: 502 })
  }
}
