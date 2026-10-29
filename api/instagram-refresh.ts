// Vercel Cron (see vercel.json): extends an Instagram-login token's 60-day life once a week.
// Not needed with Facebook login: a Page token made from a long-lived user token does not expire.

export async function GET(request: Request) {
  // Vercel sends CRON_SECRET as a bearer token on cron calls; reject anything else.
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const token = process.env.INSTAGRAM_TOKEN
  if (!token) return Response.json({ ok: false, reason: 'no token' })
  if (process.env.INSTAGRAM_USER_ID) return Response.json({ ok: true, reason: 'page token, no refresh needed' })

  const res = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`)
  const body = (await res.json()) as { access_token?: string; expires_in?: number }

  // Instagram may hand back a different token string; if it does, it must be copied into Vercel by hand.
  return Response.json({
    ok: res.ok,
    expiresInDays: body.expires_in ? Math.round(body.expires_in / 86400) : null,
    tokenChanged: body.access_token ? body.access_token !== token : null,
  })
}
