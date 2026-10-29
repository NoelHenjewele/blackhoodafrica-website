import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { whatsappLink } from '../../config/site'
import { useLang } from '../../i18n'

type Casting = {
  title: string
  type: string
  date: string
  place: string
}

// Live casting calls. Add real ones here; the section shows a "coming soon" note while this is empty.
const castings: Casting[] = []

// `standalone` is used on the Castings page itself, where the heading and "Full calendar" link are redundant.
export default function Castings({ standalone = false }: { standalone?: boolean }) {
  const { t } = useLang()

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
            {castings.map((c) => (
              <li key={c.title} className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{c.type}</p>
                  <h3 className="mt-1 font-display text-2xl">{c.title}</h3>
                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ivory/60">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={15} /> {c.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} /> {c.place}
                    </span>
                  </p>
                </div>
                <a
                  href={whatsappLink(`Hello Blackhood Africa, I'd like to register for: ${c.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-ink"
                >
                  {t({ en: 'Register', sw: 'Jisajili' })}
                </a>
              </li>
            ))}
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
