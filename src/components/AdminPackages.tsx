import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Check, Copy, Loader2, MessageCircle, Plus, Trash2 } from 'lucide-react'
import { useTalent } from '../data/talent'

// Team-only: build a private link with a hand-picked set of models to send to a brand.
type Pkg = { id: string; token: string; title: string; client: string | null; note: string | null; slugs: string[]; views: number; created_at: string }

const field = 'w-full border border-white/15 bg-ink px-4 py-3 text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none'
const linkFor = (token: string) => `${window.location.origin}/p/${token}`

export default function AdminPackages({ token }: { token: string }) {
  const [talent] = useTalent()
  const [packages, setPackages] = useState<Pkg[] | null>(null)
  const [picked, setPicked] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/profiles?packages=1', { headers: { Authorization: `Bearer ${token}` } })
      const r = (await res.json()) as { ok: boolean; packages?: Pkg[] }
      if (!r.ok) throw new Error()
      setPackages(r.packages ?? [])
    } catch {
      setError("Couldn't load packages. Has the packages SQL been run in Supabase?")
      setPackages([])
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function send(body: Record<string, unknown>) {
    setBusy(true)
    setError('')
    const res = await fetch('/api/admin/profiles?packages=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    setBusy(false)
    if (!res.ok) setError('That didn’t save. Add a title and pick at least one model.')
    await load()
    return res.ok
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    const ok = await send({ action: 'create', title: d.get('title'), client: d.get('client'), note: d.get('note'), slugs: picked })
    if (ok) {
      form.reset()
      setPicked([])
    }
  }

  function copy(p: Pkg) {
    navigator.clipboard?.writeText(linkFor(p.token)).then(() => {
      setCopied(p.id)
      setTimeout(() => setCopied(''), 2000)
    })
  }

  const toggle = (slug: string) => setPicked((l) => (l.includes(slug) ? l.filter((s) => s !== slug) : [...l, slug]))
  const nameOf = (slug: string) => talent.find((t) => t.slug === slug)?.name ?? slug

  return (
    <div className="mt-8">
      <form onSubmit={onCreate} className="grid gap-3 border border-white/10 bg-ink-soft p-6 sm:grid-cols-2">
        <h2 className="font-display text-3xl sm:col-span-2">New client package</h2>
        <input name="title" required placeholder="Title the brand sees, e.g. TV ad: women 20–28" className={`${field} sm:col-span-2`} />
        <input name="client" placeholder="Client (team only), e.g. CRDB marketing" className={field} />
        <input name="note" placeholder="Short note for the brand (optional)" className={field} />

        <p className="mt-2 text-sm text-ivory/70 sm:col-span-2">Pick models ({picked.length} selected), in the order you tap them:</p>
        <div className="grid grid-cols-3 gap-3 sm:col-span-2 sm:grid-cols-5 lg:grid-cols-7">
          {talent.map((p) => {
            const n = picked.indexOf(p.slug)
            return (
              <button key={p.slug} type="button" onClick={() => toggle(p.slug)} className="text-left">
                <div className={`relative aspect-[3/4] overflow-hidden bg-ink ${n >= 0 ? 'ring-2 ring-gold' : 'opacity-70 hover:opacity-100'}`}>
                  {p.photo && <img src={p.photo} alt="" loading="lazy" className="h-full w-full object-cover object-top" />}
                  {n >= 0 && <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-bold text-ink">{n + 1}</span>}
                </div>
                <p className="mt-1 truncate text-xs">{p.name}</p>
              </button>
            )
          })}
        </div>

        <div className="mt-2 sm:col-span-2">
          <button type="submit" disabled={busy || picked.length === 0} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50">
            <Plus size={14} /> Create link
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-red-300">{error}</p>}
      {packages === null && <Loader2 className="mt-8 animate-spin text-gold" />}
      {packages?.length === 0 && !error && <p className="mt-8 text-ivory/60">No packages yet.</p>}

      <div className="mt-8 space-y-4">
        {packages?.map((p) => (
          <article key={p.id} className="border border-white/10 bg-ink-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl">{p.title}</h3>
                <p className="text-sm text-ivory/60">
                  {[p.client, new Date(p.created_at).toLocaleDateString('en-GB'), `opened ${p.views}×`].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-1 text-sm text-ivory/75">{p.slugs.map(nameOf).join(', ')}</p>
              </div>
            </div>
            <p className="mt-3 break-all font-mono text-sm text-gold">{linkFor(p.token)}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => copy(p)} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold">
                {copied === p.id ? <Check size={14} /> : <Copy size={14} />} {copied === p.id ? 'Copied' : 'Copy link'}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hello, here is a selection of Blackhood Africa models for "${p.title}":\n${linkFor(p.token)}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory"
              >
                <MessageCircle size={14} /> Send on WhatsApp
              </a>
              <button
                type="button"
                disabled={busy}
                onClick={() => confirm(`Delete "${p.title}"? The link will stop working.`) && send({ action: 'delete', id: p.id })}
                className="inline-flex items-center gap-2 rounded-full border border-red-300/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-red-300 hover:bg-red-400/10 disabled:opacity-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
