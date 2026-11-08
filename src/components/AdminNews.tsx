import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react'
import { shrinkPhoto } from '../utils/photo'

// Team-only: write News & events posts for /news.
type Post = { id: string; title: string; body: string | null; photo: string | null; video_url: string | null; created_at: string }

const field = 'w-full border border-ivory/15 bg-ink px-4 py-3 text-ivory placeholder:text-ivory/50 focus:border-gold focus:outline-none'

export default function AdminNews({ token }: { token: string }) {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [photo, setPhoto] = useState<{ base64: string; preview: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const r = (await fetch('/api/talent?news=1', { cache: 'no-store' }).then((res) => res.json())) as { posts?: Post[] }
      setPosts(r.posts ?? [])
    } catch {
      setPosts([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function send(body: Record<string, unknown>) {
    setBusy(true)
    setError('')
    const res = await fetch('/api/admin/profiles?news=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    setBusy(false)
    if (!res.ok) setError('That didn’t save. Check the video link is from TikTok or YouTube, and that the news SQL has been run.')
    await load()
    return res.ok
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    const ok = await send({ action: 'create', title: d.get('title'), body: d.get('body'), video: d.get('video'), photo: photo?.base64 })
    if (ok) {
      form.reset()
      setPhoto(null)
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={onCreate} className="grid gap-3 border border-ivory/10 bg-ink-soft p-6">
        <h2 className="font-display text-3xl">New post</h2>
        <input name="title" required placeholder="Title, e.g. Eladia crowned Miss Kinondoni" className={field} />
        <textarea name="body" rows={5} placeholder="The story (optional)" className={field} />
        <input name="video" type="url" placeholder="Video link (optional): paste a TikTok or YouTube link" className={field} />
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ivory/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold">
            <ImagePlus size={14} /> {photo ? 'Change photo' : 'Add photo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) setPhoto(await shrinkPhoto(file, 1600, 0.82))
              }}
            />
          </label>
          {photo && <img src={photo.preview} alt="" className="h-16 w-auto" />}
          <button type="submit" disabled={busy} className="ml-auto inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Publish
          </button>
        </div>
        <p className="text-xs text-ivory/75">It appears on the News page within a minute.</p>
      </form>

      {error && <p className="mt-4 text-red-300">{error}</p>}
      {posts === null && <Loader2 className="mt-8 animate-spin text-gold" />}
      {posts?.length === 0 && <p className="mt-8 text-ivory/80">No posts yet.</p>}

      <div className="mt-8 space-y-4">
        {posts?.map((p) => (
          <article key={p.id} className="flex gap-4 border border-ivory/10 bg-ink-soft p-5">
            {p.photo && <img src={p.photo} alt="" className="h-20 w-28 shrink-0 object-cover" />}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl">{p.title}</h3>
              <p className="text-sm text-ivory/80">{new Date(p.created_at).toLocaleDateString('en-GB')}{p.video_url && ' · with video'}</p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => confirm(`Delete "${p.title}"?`) && send({ action: 'delete', id: p.id })}
              className="self-start text-red-300 hover:text-red-200 disabled:opacity-50"
              aria-label="Delete post"
            >
              <Trash2 size={18} />
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
