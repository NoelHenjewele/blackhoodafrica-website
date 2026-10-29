// Vercel Function: returns the latest Instagram posts for the homepage grid.
// Secrets live only in Vercel's environment variables, never in the browser:
//   INSTAGRAM_TOKEN    access token
//   INSTAGRAM_USER_ID  set this when using "API setup with Facebook login" (a Page token + the Instagram
//                      business account ID); leave it out for "API setup with Instagram login".

type Media = {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'

export async function GET() {
  const token = process.env.INSTAGRAM_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID
  if (!token) return Response.json({ posts: [] })

  const url = userId
    ? `https://graph.facebook.com/v21.0/${userId}/media?fields=${FIELDS}&limit=6&access_token=${token}`
    : `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=6&access_token=${token}`

  try {
    const res = await fetch(url)
    if (!res.ok) return Response.json({ posts: [] })
    const data = (await res.json()) as { data?: Media[] }

    const posts = (data.data ?? []).map((m) => ({
      id: m.id,
      image: m.media_type === 'VIDEO' ? (m.thumbnail_url ?? m.media_url) : m.media_url,
      isVideo: m.media_type === 'VIDEO',
      caption: m.caption?.slice(0, 140) ?? '',
      link: m.permalink,
    }))

    // Cache at Vercel's edge for an hour so Instagram is called rarely.
    return Response.json(
      { posts },
      { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' } },
    )
  } catch {
    return Response.json({ posts: [] })
  }
}
