import { useCallback, useEffect, useState } from 'react'
import { Loader2, Mail, MessageCircle } from 'lucide-react'

// Team-only view of brand booking requests (they live in the Google Sheet's Bookings tab).
type Booking = {
  received: string
  ref: string
  status: string
  name: string
  company: string
  phone: string
  email: string
  jobType: string
  dates: string
  location: string
  talent: string
  budget: string
  usage: string
  details: string
  lang: string
  notes: string
}

const statusStyle: Record<string, string> = {
  New: 'bg-gold text-ink',
  Replied: 'bg-sky-400/20 text-sky-300',
  'Quote sent': 'bg-purple-400/20 text-purple-300',
  Confirmed: 'bg-green-400/20 text-green-300',
  Completed: 'bg-white/10 text-ivory/70',
  Lost: 'bg-red-400/20 text-red-300',
}
const OPEN = ['New', 'Replied', 'Quote sent', 'Confirmed']

export default function AdminBookings({ token }: { token: string }) {
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [statuses, setStatuses] = useState<string[]>([])
  const [filter, setFilter] = useState('open')
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/book?admin=1', { headers: { Authorization: `Bearer ${token}` } })
      const r = (await res.json()) as { ok: boolean; bookings?: Booking[]; statuses?: string[] }
      if (!r.ok) throw new Error()
      setBookings(r.bookings ?? [])
      setStatuses(r.statuses ?? [])
    } catch {
      setError("Couldn't load bookings. Has the latest Apps Script been deployed?")
      setBookings([])
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function update(ref: string, change: { status?: string; notes?: string }) {
    setBusy(ref)
    setError('')
    const res = await fetch('/api/book?admin=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ref, ...change }),
    })
    setBusy(null)
    if (!res.ok) return setError('That didn’t save. Please try again.')
    setBookings((list) => list?.map((b) => (b.ref === ref ? { ...b, ...change } : b)) ?? null)
  }

  const filters = ['open', ...statuses, 'all']
  const matches = (b: Booking, f: string) => f === 'all' || (f === 'open' ? OPEN.includes(b.status) : b.status === f)
  const shown = (bookings ?? []).filter((b) => matches(b, filter))
  const waNumber = (p: string) => p.replace(/\D/g, '').replace(/^0/, '255')

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${
              filter === f ? 'border-gold bg-gold text-ink' : 'border-white/20 text-ivory/70 hover:border-gold'
            }`}
          >
            {f} ({(bookings ?? []).filter((b) => matches(b, f)).length})
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-red-300">{error}</p>}
      {bookings === null && <Loader2 className="mt-8 animate-spin text-gold" />}
      {bookings && shown.length === 0 && !error && <p className="mt-8 text-ivory/60">Nothing here.</p>}

      <div className="mt-8 space-y-6">
        {shown.map((b) => (
          <article key={b.ref} className="border border-white/10 bg-ink-soft p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl">{b.company || b.name}</h3>
                <p className="text-sm text-ivory/60">
                  <span className="font-mono">{b.ref}</span> · {b.name} · received {new Date(b.received).toLocaleString()}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${statusStyle[b.status] ?? 'bg-white/10'}`}>
                {b.status}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {(
                [
                  ['Job', b.jobType], ['Date(s)', b.dates], ['Location', b.location], ['Talent', b.talent],
                  ['Budget', b.budget], ['Usage', b.usage],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="inline text-ivory/50">{k}: </dt>
                  <dd className="inline">{v || '—'}</dd>
                </div>
              ))}
            </dl>
            {b.details && <p className="mt-3 whitespace-pre-line text-sm text-ivory/75">{b.details}</p>}

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              {b.phone && (
                <a
                  href={`https://wa.me/${waNumber(b.phone)}?text=${encodeURIComponent(`Hello ${b.name.split(' ')[0]}, this is Blackhood Africa about your booking ${b.ref}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory"
                >
                  <MessageCircle size={14} /> WhatsApp {b.phone}
                </a>
              )}
              {b.email && (
                <a
                  href={`mailto:${b.email}?subject=${encodeURIComponent(`Your Blackhood booking ${b.ref}`)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold"
                >
                  <Mail size={14} /> Email
                </a>
              )}
              <label className="ml-auto flex items-center gap-2 text-sm text-ivory/75">
                Status
                <select
                  value={b.status}
                  disabled={busy === b.ref}
                  onChange={(e) => update(b.ref, { status: e.target.value })}
                  className="border border-white/15 bg-ink px-3 py-2 text-ivory focus:border-gold focus:outline-none"
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <input
              defaultValue={b.notes}
              placeholder="Team notes (saved when you click away)"
              disabled={busy === b.ref}
              onBlur={(e) => e.target.value !== b.notes && update(b.ref, { notes: e.target.value })}
              className="mt-3 w-full border border-white/15 bg-ink px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
            />
          </article>
        ))}
      </div>
    </div>
  )
}
