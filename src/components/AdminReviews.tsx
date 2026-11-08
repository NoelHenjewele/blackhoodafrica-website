import { useCallback, useEffect, useState } from 'react'
import { Check, Copy, EyeOff, Loader2, Trash2 } from 'lucide-react'

// Team-only: approve reviews sent through /review before they show on the home page.
type Review = { id: string; quote: string; name: string; role: string | null; kind: string | null; contact: string | null; status: 'pending' | 'approved' | 'hidden'; created_at: string }

const statusStyle: Record<Review['status'], string> = {
  pending: 'bg-gold text-ink',
  approved: 'bg-green-400/20 text-green-300',
  hidden: 'bg-white/10 text-ivory/85',
}

export default function AdminReviews({ token }: { token: string }) {
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/review`

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/profiles?reviews=1', { headers: { Authorization: `Bearer ${token}` } })
      const r = (await res.json()) as { ok: boolean; reviews?: Review[] }
      if (!r.ok) throw new Error()
      setReviews(r.reviews ?? [])
    } catch {
      setError("Couldn't load reviews. Has the reviews SQL been run in Supabase?")
      setReviews([])
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function act(id: string, change: Record<string, unknown>) {
    setBusy(id)
    const res = await fetch('/api/admin/profiles?reviews=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...change }),
    })
    setBusy(null)
    if (!res.ok) setError('That didn’t save. Please try again.')
    await load()
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3 border border-white/10 bg-ink-soft p-5">
        <p className="text-sm text-ivory/90">Send this link to clients, graduates and parents:</p>
        <span className="font-mono text-sm text-gold">{link}</span>
        <button type="button" onClick={() => navigator.clipboard?.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
        </button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`Hello! Could you write 1–2 sentences about your experience with Blackhood Africa for our website? It takes a minute: ${link}`)}`}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory">
          Share on WhatsApp
        </a>
      </div>

      {error && <p className="mt-4 text-red-300">{error}</p>}
      {reviews === null && <Loader2 className="mt-8 animate-spin text-gold" />}
      {reviews?.length === 0 && !error && <p className="mt-8 text-ivory/80">No reviews yet.</p>}

      <div className="mt-8 space-y-5">
        {reviews?.map((r) => (
          <article key={r.id} className="border border-white/10 bg-ink-soft p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-sm text-ivory/80">
                <span className="font-semibold text-ivory">{r.name}</span>
                {r.role && ` · ${r.role}`} · {r.kind} · {new Date(r.created_at).toLocaleDateString('en-GB')}
                {r.contact && <span className="block text-xs">Contact (private): {r.contact}</span>}
              </p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${statusStyle[r.status]}`}>{r.status}</span>
            </div>
            <textarea
              defaultValue={r.quote}
              rows={3}
              onBlur={(e) => e.target.value.trim() !== r.quote && act(r.id, { quote: e.target.value })}
              className="mt-4 w-full border border-white/15 bg-ink px-4 py-3 font-display text-lg text-ivory focus:border-gold focus:outline-none"
            />
            <p className="mt-1 text-xs text-ivory/75">You can fix typos above; it saves when you click away.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {r.status !== 'approved' && (
                <button type="button" disabled={busy === r.id} onClick={() => act(r.id, { status: 'approved' })}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50">
                  <Check size={14} /> Approve & show
                </button>
              )}
              {r.status !== 'hidden' && (
                <button type="button" disabled={busy === r.id} onClick={() => act(r.id, { status: 'hidden' })}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold disabled:opacity-50">
                  <EyeOff size={14} /> Hide
                </button>
              )}
              <button type="button" disabled={busy === r.id} onClick={() => confirm('Delete this review?') && act(r.id, { delete: true })}
                className="inline-flex items-center gap-2 rounded-full border border-red-300/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-red-300 hover:bg-red-400/10 disabled:opacity-50">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
