import { Link } from 'react-router-dom'
import { ArrowRight, Plus, Quote } from 'lucide-react'
import { stories } from '../data/stories'
import { useLang } from '../i18n'

export default function StoriesPage() {
  const { t } = useLang()

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Success stories', sw: 'Hadithi za mafanikio' })}</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Trained here. Winning everywhere.', sw: 'Wamefunzwa hapa. Wanashinda kila mahali.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'Real results from real Blackhood talent: titles, campaigns and first bookings. Every story here is confirmed with the person in it.',
              sw: 'Matokeo halisi ya vipaji halisi vya Blackhood: mataji, kampeni na kazi za kwanza. Kila hadithi hapa imethibitishwa na mhusika.',
            })}
          </p>
        </div>
      </section>

      {stories.map((s, i) => (
        <section key={s.slug} className={`border-t border-white/10 ${i % 2 ? 'bg-ink-soft' : ''}`}>
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-24">
            <div className={`grid grid-cols-[2fr_1fr] gap-3 ${i % 2 ? 'lg:order-2' : ''}`}>
              <div className="row-span-2 aspect-[4/5] overflow-hidden border border-white/10">
                <img src={s.photo} alt={s.name} loading="lazy" className="h-full w-full object-cover object-[40%_center]" />
              </div>
              {s.gallery?.slice(0, 2).map((g) => (
                <div key={g} className="overflow-hidden border border-white/10">
                  <img src={g} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                </div>
              ))}
            </div>
            <div>
              {s.date && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">{s.date}</p>}
              <h2 className="font-display text-4xl font-medium sm:text-5xl">{s.name}</h2>
              <p className="mt-2 font-display text-2xl italic text-gold">{t(s.headline)}</p>
              <p className="mt-6 text-ivory/75">{t(s.summary)}</p>
              {s.quote && (
                <blockquote className="mt-8 border-l-2 border-gold pl-5 font-display text-xl">
                  <Quote className="mb-2 text-gold" size={20} />“{t(s.quote)}”
                </blockquote>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid min-h-48 place-items-center border border-dashed border-white/15 p-6 text-center">
                <div>
                  <Plus className="mx-auto text-stone/40" size={26} strokeWidth={1.2} />
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone/70">{t({ en: 'Next story', sw: 'Hadithi ijayo' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gold text-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center lg:px-10">
          <p className="font-display text-3xl sm:text-4xl">{t({ en: 'Your story could be next.', sw: 'Hadithi yako inaweza kuwa inayofuata.' })}</p>
          <Link
            to="/apply"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-ink-soft"
          >
            {t({ en: 'Apply to join', sw: 'Omba kujiunga' })}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}
