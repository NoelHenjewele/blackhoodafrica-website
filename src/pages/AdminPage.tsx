import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, EyeOff, Loader2, RotateCcw } from 'lucide-react'
import { supabase } from '../config/supabase'
import AdminCastings from '../components/AdminCastings'
import AdminBookings from '../components/AdminBookings'
import AdminPackages from '../components/AdminPackages'
import AdminNews from '../components/AdminNews'
import AdminReviews from '../components/AdminReviews'
import AdminCertificates from '../components/AdminCertificates'
import ResendCode from '../components/ResendCode'

// Team-only review page. English only: it's an internal tool.
type AdminProfile = {
  id: string
  full_name: string
  talent_code: string
  email: string
  status: 'draft' | 'pending' | 'approved' | 'hidden'
  slug: string | null
  is_minor: boolean
  board: string | null
  city: string | null
  height_cm: number | null
  bust: string | null
  waist: string | null
  hips: string | null
  shoes: string | null
  hair: string | null
  eyes: string | null
  instagram: string | null
  tiktok: string | null
  bio: string | null
  updated_at: string
  photos: string[]
  busy: string[]
  consent: { parent_name: string; relationship: string; phone: string; signed_at: string } | null
}

const filters = ['pending', 'approved', 'hidden', 'draft', 'all'] as const
const statusStyle: Record<AdminProfile['status'], string> = {
  pending: 'bg-gold text-ink',
  approved: 'bg-green-400/20 text-green-300',
  hidden: 'bg-red-400/20 text-red-300',
  draft: 'bg-white/10 text-ivory/85',
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null | undefined>(undefined)
  const [profiles, setProfiles] = useState<AdminProfile[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading')
  const [filter, setFilter] = useState<(typeof filters)[number]>('pending')
  const [busy, setBusy] = useState<string | null>(null)
  const [freeOn, setFreeOn] = useState('')
  const [tab, setTab] = useState<'profiles' | 'bookings' | 'packages' | 'castings' | 'news' | 'reviews' | 'certificates'>('profiles')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null))
  }, [])

  const load = useCallback(async () => {
    if (!token) return
    setState('loading')
    try {
      const res = await fetch('/api/admin/profiles', { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 403) return setState('denied')
      const r = (await res.json()) as { ok: boolean; profiles?: AdminProfile[] }
      if (!r.ok) throw new Error()
      setProfiles(r.profiles ?? [])
      setState('ready')
    } catch {
      setState('error')
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function act(id: string, change: { status?: AdminProfile['status']; is_minor?: boolean }) {
    setBusy(id)
    const res = await fetch('/api/admin/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...change }),
    })
    setBusy(null)
    if (res.ok) await load()
  }

  const shown = profiles.filter((p) => (filter === 'all' || p.status === filter) && (!freeOn || !p.busy.includes(freeOn)))
  const count = (f: (typeof filters)[number]) => (f === 'all' ? profiles.length : profiles.filter((p) => p.status === f).length)

  return (
    <section className="min-h-[80vh] pt-20">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Team only</p>
        <h1 className="mt-3 font-display text-5xl font-medium">{tab === 'castings' ? 'Castings' : tab === 'bookings' ? 'Bookings' : tab === 'packages' ? 'Client packages' : tab === 'news' ? 'News' : tab === 'reviews' ? 'Reviews' : tab === 'certificates' ? 'Certificates' : 'Profile review'}</h1>

        {token === undefined || (token && state === 'loading') ? (
          <Loader2 className="mt-10 animate-spin text-gold" />
        ) : !token ? (
          <p className="mt-8 text-ivory/85">
            Please <Link to="/account" className="text-gold underline">log in</Link> with your team email first, then come back to this page.
          </p>
        ) : state === 'denied' ? (
          <p className="mt-8 text-ivory/85">This email doesn't have review access. Ask Noel to add it.</p>
        ) : state === 'error' ? (
          <p className="mt-8 text-red-300">Couldn't load profiles. Refresh to try again.</p>
        ) : (
          <>
            <div className="mt-6 flex gap-6 overflow-x-auto whitespace-nowrap border-b border-white/10">
              {(['profiles', 'bookings', 'packages', 'castings', 'news', 'reviews', 'certificates'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  className={`-mb-px border-b-2 pb-3 text-sm font-semibold uppercase tracking-[0.15em] ${
                    tab === k ? 'border-gold text-gold' : 'border-transparent text-ivory/80 hover:text-ivory'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
            {tab === 'castings' ? (
              <AdminCastings token={token} />
            ) : tab === 'bookings' ? (
              <AdminBookings token={token} />
            ) : tab === 'packages' ? (
              <AdminPackages token={token} />
            ) : tab === 'news' ? (
              <AdminNews token={token} />
            ) : tab === 'reviews' ? (
              <AdminReviews token={token} />
            ) : tab === 'certificates' ? (
              <AdminCertificates token={token} />
            ) : (
            <>
            <ResendCode token={token} />
            <div className="mt-8 flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${
                    filter === f ? 'border-gold bg-gold text-ink' : 'border-white/20 text-ivory/85 hover:border-gold'
                  }`}
                >
                  {f} ({count(f)})
                </button>
              ))}
              <label className="ml-auto flex items-center gap-2 text-sm text-ivory/85">
                Free on
                <input type="date" value={freeOn} onChange={(e) => setFreeOn(e.target.value)} className="border border-white/15 bg-ink px-3 py-1.5 text-ivory [color-scheme:dark]" />
                {freeOn && <button type="button" onClick={() => setFreeOn('')} className="text-gold underline">clear</button>}
              </label>
            </div>

            {shown.length === 0 && <p className="mt-10 text-ivory/80">Nothing here.</p>}

            <div className="mt-8 space-y-6">
              {shown.map((p) => (
                <article key={p.id} className="border border-white/10 bg-ink-soft p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-3xl">{p.full_name}</h2>
                      <p className="text-sm text-ivory/80">
                        <span className="font-mono">{p.talent_code}</span> · {p.email} · updated {new Date(p.updated_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${statusStyle[p.status]}`}>{p.status}</span>
                  </div>

                  {p.photos.length > 0 ? (
                    <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
                      {p.photos.map((src, i) => (
                        <a key={src} href={src} target="_blank" rel="noreferrer" className="shrink-0">
                          <img src={src} alt="" loading="lazy" className={`h-40 w-auto object-cover ${i === 0 ? 'ring-2 ring-gold' : ''}`} />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-ivory/75">No photos yet.</p>
                  )}

                  <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
                    {(
                      [
                        ['Board', p.board], ['City', p.city], ['Height', p.height_cm ? `${p.height_cm} cm` : ''], ['Bust', p.bust],
                        ['Waist', p.waist], ['Hips', p.hips], ['Shoes', p.shoes], ['Hair', p.hair], ['Eyes', p.eyes],
                        ['Instagram', p.instagram], ['TikTok', p.tiktok],
                      ] as [string, string | null][]
                    ).map(([k, v]) => (
                      <div key={k}>
                        <dt className="inline text-ivory/75">{k}: </dt>
                        <dd className="inline">{v || '—'}</dd>
                      </div>
                    ))}
                  </dl>
                  {p.bio && <p className="mt-3 text-sm text-ivory/90">{p.bio}</p>}
                  {p.is_minor && (
                    <p className={`mt-3 text-sm ${p.consent ? 'text-green-300' : 'text-gold'}`}>
                      {p.consent
                        ? `Parent consent: signed by ${p.consent.parent_name} (${p.consent.relationship}, ${p.consent.phone}) on ${new Date(p.consent.signed_at).toLocaleDateString('en-GB')}`
                        : 'Parent consent: NOT signed yet. Ask the parent to sign on the model’s account page before approving.'}
                    </p>
                  )}
                  <p className="mt-3 text-sm">
                    <span className="text-ivory/75">Busy: </span>
                    {p.busy.length
                      ? p.busy.slice(0, 12).map((d) => new Date(d + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })).join(', ') + (p.busy.length > 12 ? ` +${p.busy.length - 12} more` : '')
                      : 'no busy days marked'}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                    {p.status !== 'approved' && (
                      <button type="button" disabled={busy === p.id} onClick={() => act(p.id, { status: 'approved' })}
                        className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50">
                        <Check size={14} /> Approve & publish
                      </button>
                    )}
                    {p.status !== 'hidden' && (
                      <button type="button" disabled={busy === p.id} onClick={() => act(p.id, { status: 'hidden' })}
                        className="inline-flex items-center gap-2 rounded-full border border-red-300/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-red-300 hover:bg-red-400/10 disabled:opacity-50">
                        <EyeOff size={14} /> Hide
                      </button>
                    )}
                    {p.status === 'hidden' && (
                      <button type="button" disabled={busy === p.id} onClick={() => act(p.id, { status: 'pending' })}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold disabled:opacity-50">
                        <RotateCcw size={14} /> Back to review
                      </button>
                    )}
                    <label className="ml-auto flex items-center gap-2 text-sm text-ivory/90">
                      <input type="checkbox" checked={p.is_minor} disabled={busy === p.id} onChange={(e) => act(p.id, { is_minor: e.target.checked })} className="h-4 w-4 accent-[#c9a45c]" />
                      Under 18 (first name + photos only)
                    </label>
                    {p.status === 'approved' && p.slug && p.photos.length > 0 && (
                      <Link to={`/talent/${p.slug}`} className="text-sm text-gold underline">View public page</Link>
                    )}
                    {p.status === 'approved' && p.photos.length === 0 && (
                      <span className="text-sm text-gold">Not on the Talent page yet: needs at least 1 photo</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
            </>
            )}
          </>
        )}
      </div>
    </section>
  )
}
