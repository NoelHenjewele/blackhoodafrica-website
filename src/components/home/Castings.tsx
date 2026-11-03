import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, MapPin } from 'lucide-react'
import { whatsappLink } from '../../config/site'
import { supabase } from '../../config/supabase'
import { useLang } from '../../i18n'

type Casting = {
  id: string
  title: string
  type: string | null
  date_text: string | null
  place: string | null
  details: string | null
}

// Live casting calls, posted by the team on /admin. Shows a "coming soon" note while there are none.
function useCastings() {
  const [castings, setCastings] = useState<Casting[]>([])
  const [interested, setInterested] = useState<string[]>([])
  const [canApply, setCanApply] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    const tk = data.session?.access_token ?? null
    setToken(tk)
    try {
      const res = await fetch('/api/castings', tk ? { headers: { Authorization: `Bearer ${tk}` } } : undefined)
      const r = (await res.json()) as { castings?: Casting[]; interested?: string[]; canApply?: boolean }
      setCastings(r.castings ?? [])
      setInterested(r.interested ?? [])
      setCanApply(!!r.canApply)
    } catch {
      // leave the "coming soon" note
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function toggle(id: string) {
    const on = !interested.includes(id)
    setInterested((list) => (on ? [...list, id] : list.filter((x) => x !== id)))
    const res = await fetch('/api/castings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, interested: on }),
    })
    if (!res.ok) load()
  }

  return { castings, interested, canApply, loggedIn: !!token, toggle }
}

// `standalone` is used on the Castings page itself, where the heading and "Full calendar" link are redundant.
export default function Castings({ standalone = false }: { standalone?: boolean }) {
  const { t } = useLang()
  const { castings, interested, canApply, loggedIn, toggle } = useCastings()

  return (
    <section className="border-t border-white/10 bg-ink-soft">
      <div className={`mx-auto max-w-7xl px-5 lg:px-10 ${standalone ? 'py-12 lg:py-16' : 'py-20 lg:py-24'}`}>
        {!standalone && (
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Castings', sw: 'Usaili' })}</p>
              <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
                {t({ en: 'Open calls & castings.', sw: 'Nafasi za wazi na usaili.' })}
              </h2>
            </div>
            <Link
              to="/castings"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory"
            >
              {t({ en: 'Full calendar', sw: 'Kalenda kamili' })}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {castings.length > 0 ? (
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {castings.map((c) => {
              const on = interested.includes(c.id)
              return (
                <li key={c.id} className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    {c.type && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{c.type}</p>}
                    <h3 className="mt-1 font-display text-2xl">{c.title}</h3>
                    <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ivory/60">
                      {c.date_text && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={15} /> {c.date_text}
                        </span>
                      )}
                      {c.place && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} /> {c.place}
                        </span>
                      )}
                    </p>
                    {c.details && <p className="mt-3 max-w-2xl whitespace-pre-line text-sm text-ivory/75">{c.details}</p>}
                  </div>
                  <div className="flex flex-col items-stretch gap-2 sm:items-end">
                    {canApply ? (
                      <button
                        type="button"
                        onClick={() => toggle(c.id)}
                        aria-pressed={on}
                        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] ${
                          on ? 'bg-gold text-ink' : 'border border-gold text-gold hover:bg-gold hover:text-ink'
                        }`}
                      >
                        {on && <Check size={14} />}
                        {on ? t({ en: "You're interested", sw: 'Umeonyesha nia' }) : t({ en: "I'm interested", sw: 'Nina nia' })}
                      </button>
                    ) : (
                      <>
                        <a
                          href={whatsappLink(`Hello Blackhood Africa, I'd like to register for: ${c.title}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-ink"
                        >
                          {t({ en: 'Register', sw: 'Jisajili' })}
                        </a>
                        {!loggedIn && (
                          <Link to="/account" className="text-center text-xs text-ivory/60 underline hover:text-gold">
                            {t({ en: 'Blackhood model? Log in to apply', sw: 'Mwanamitindo wa Blackhood? Ingia kuomba' })}
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-start justify-between gap-6 border border-dashed border-white/15 p-8 sm:flex-row sm:items-center lg:p-10">
            <div>
              <p className="font-display text-2xl">
                {t({ en: 'New castings are announced soon.', sw: 'Usaili mpya utatangazwa hivi karibuni.' })}
              </p>
              <p className="mt-2 text-sm text-ivory/60">
                {t({
                  en: 'Follow us or message us on WhatsApp to hear first when the next open call is posted.',
                  sw: 'Tufuate au tuandikie WhatsApp ili uwe wa kwanza kujua nafasi inayofuata ikitangazwa.',
                })}
              </p>
            </div>
            <a
              href={whatsappLink('Hello Blackhood Africa, please let me know about upcoming castings.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory"
            >
              {t({ en: 'Notify me on WhatsApp', sw: 'Nijulishe kwa WhatsApp' })}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
