import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'

type Post = { id: string; image: string; isVideo: boolean; caption: string; link: string }

// Latest posts from /api/instagram. Renders nothing until the token is set up and posts come back.
export default function InstagramGrid() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/instagram')
      .then((r) => r.json())
      .then((d: { posts?: Post[] }) => {
        if (!cancelled) setPosts(d.posts ?? [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (posts.length === 0) return null

  return (
    <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {posts.map((p) => (
        <a
          key={p.id}
          href={p.link}
          target="_blank"
          rel="noreferrer"
          className="group relative aspect-square overflow-hidden bg-ink-soft"
          title={p.caption}
        >
          <img
            src={p.image}
            alt={p.caption || 'Instagram post'}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {p.isVideo && <Play className="absolute right-2 top-2 fill-ivory text-ivory drop-shadow" size={18} />}
        </a>
      ))}
    </div>
  )
}
