import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ImagePlus, Loader2, Plus, Trash2, User } from 'lucide-react'
import { shrinkPhoto } from '../utils/photo'

// Team-only castings manager on /admin. English only, like the rest of the admin page.
type Interested = {
  id: string
  full_name: string
  talent_code: string
  email: string
  slug: string | null
  board: string | null
  city: string | null
  height_cm: number | null
  photo: string | null
}

type AdminCasting = {
  id: string
  title: string
  type: string | null
  date_text: string | null
  place: string | null
  details: string | null
  photo: string | null
  status: 'open' | 'closed'
  created_at: string
  interested: Interested[]
}

const field = 'w-full border border-white/15 bg-ink px-4 py-3 text-ivory placeholder:text-ivory/50 focus:border-gold focus:outline-none'

export default function AdminCastings({ token }: { token: string }) {
  const [castings, setCastings] = useState<AdminCasting[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [poster, setPoster] = useState<{ base64: string; preview: string } | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/castings?admin=1', { headers: { Authorization: `Bearer ${token}` } })
      const r = (await res.json()) as { ok: boolean; castings?: AdminCasting[] }
      if (!r.ok) throw new Error()
      setCastings(r.castings ?? [])
    } catch {
      setError("Couldn't load castings. Has the castings SQL been run in Supabase?")
      setCastings([])
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function send(body: Record<string, unknown>) {
    setBusy(true)
    setError('')
    const res = await fetch('/api/castings?admin=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    setBusy(false)
    if (!res.ok) setError('That didn’t save. Please try again.')
    await load()
    return res.ok
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    const get = (k: string) => String(d.get(k) ?? '')
    const ok = await send({
      action: 'create',
      title: get('title'),
      type: get('type'),
      date_text: get('date_text'),
      place: get('place'),
      details: get('details'),
      notify: d.get('notify') === 'on',
      photo: poster?.base64,
    })
    if (ok) {
      form.reset()
      setPoster(null)
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={onCreate} className="grid gap-3 border border-white/10 bg-ink-soft p-6 sm:grid-cols-2">
        <h2 className="font-display text-3xl sm:col-span-2">Post a casting</h2>
        <input name="title" required placeholder="Title, e.g. TV ad for a bank" className={`${field} sm:col-span-2`} />
        <input name="type" placeholder="Type, e.g. TV ad / Runway / Photoshoot" className={field} />
        <input name="date_text" placeholder="Date, e.g. 15 Nov 2026" className={field} />
        <input name="place" placeholder="Place, e.g. Masaki, Dar es Salaam" className={`${field} sm:col-span-2`} />
        <textarea
          name="details"
          rows={4}
          placeholder="Who you're looking for (e.g. 3 women, 20–28, 170 cm+), pay, what to bring"
          className={`${field} sm:col-span-2`}
        />
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold">
            <ImagePlus size={14} /> {poster ? 'Change poster' : 'Add poster (optional)'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) setPoster(await shrinkPhoto(file, 1600, 0.85))
              }}
            />
          </label>
          {poster && <img src={poster.preview} alt="" className="h-20 w-auto" />}
        </div>
        <div className="flex items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50"
          >
            <Plus size={14} /> Post casting
          </button>
          <label className="flex items-center gap-2 text-sm text-ivory/90">
            <input type="checkbox" name="notify" defaultChecked className="h-4 w-4 accent-[#c9a45c]" />
            Email all approved models about it
          </label>
        </div>
      </form>

      {error && <p className="mt-4 text-red-300">{error}</p>}
      {castings === null && <Loader2 className="mt-8 animate-spin text-gold" />}
      {castings?.length === 0 && !error && <p className="mt-8 text-ivory/80">No castings yet.</p>}

      <div className="mt-8 space-y-6">
        {castings?.map((c) => (
          <article key={c.id} className={`border border-white/10 bg-ink-soft p-6 ${c.status === 'closed' ? 'opacity-70' : ''}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                {c.type && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{c.type}</p>}
                <h3 className="font-display text-3xl">{c.title}</h3>
                <p className="text-sm text-ivory/80">{[c.date_text, c.place].filter(Boolean).join(' · ')}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${
                  c.status === 'open' ? 'bg-green-400/20 text-green-300' : 'bg-white/10 text-ivory/85'
                }`}
              >
                {c.status}
              </span>
            </div>
            {c.details && <p className="mt-3 whitespace-pre-line text-sm text-ivory/90">{c.details}</p>}
            {c.photo && <img src={c.photo} alt="" className="mt-3 h-40 w-auto border border-white/10" />}

            <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/80">
              Interested models ({c.interested.length})
            </h4>
            {c.interested.length === 0 ? (
              <p className="mt-2 text-sm text-ivory/75">Nobody yet.</p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {c.interested.map((m) => (
                  <div key={m.id} className="text-sm">
                    <div className="aspect-[3/4] overflow-hidden bg-ink">
                      {m.photo ? (
                        <img src={m.photo} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                      ) : (
                        <div className="grid h-full place-items-center text-stone/70">
                          <User size={28} />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 font-medium">
                      {m.slug ? (
                        <Link to={`/talent/${m.slug}`} className="hover:text-gold">{m.full_name}</Link>
                      ) : (
                        m.full_name
                      )}
                    </p>
                    <p className="text-xs text-ivory/80">
                      {[m.talent_code, m.height_cm ? `${m.height_cm} cm` : '', m.city].filter(Boolean).join(' · ')}
                    </p>
                    <a href={`mailto:${m.email}`} className="break-all text-xs text-gold/80 hover:text-gold">{m.email}</a>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                disabled={busy}
                onClick={() => send({ action: c.status === 'open' ? 'close' : 'open', id: c.id })}
                className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold disabled:opacity-50"
              >
                {c.status === 'open' ? 'Close casting' : 'Reopen'}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => confirm(`Delete "${c.title}" and its interest list?`) && send({ action: 'delete', id: c.id })}
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
