import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { site } from '../../config/site'
import { curriculum, programmes } from '../../data/academy'
import { useLang } from '../../i18n'

const path = [
  { n: '01', label: { en: 'Train', sw: 'Funzwa' } },
  { n: '02', label: { en: 'Graduate', sw: 'Hitimu' } },
  { n: '03', label: { en: 'Get booked', sw: 'Pata kazi' } },
]

export default function AcademyPreview() {
  const { t } = useLang()

  return (
    <section className="border-t border-white/10 bg-ivory text-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">{t({ en: 'The Academy', sw: 'Chuo' })}</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              {t({ en: 'The academy that feeds the agency.', sw: 'Chuo kinacholea vipaji vya wakala.' })}
            </h2>
            <p className="mt-6 max-w-lg text-ink/70">
              {t({
                en: 'Every Blackhood face is trained here. Our best graduates go straight onto our boards and into paid work for brands across Tanzania and beyond.',
                sw: 'Kila sura ya Blackhood inafunzwa hapa. Wahitimu wetu bora wanaingia moja kwa moja kwenye orodha zetu na kupata kazi za kulipwa kwa makampuni Tanzania na nje ya nchi.',
              })}
            </p>
          </div>

          <ol className="flex items-center gap-3 sm:gap-5">
            {path.map((p, i) => (
              <li key={p.n} className="flex items-center gap-3 sm:gap-5">
                <div>
                  <span className="font-display text-3xl text-gold-deep lining-nums">{p.n}</span>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em]">{t(p.label)}</p>
                </div>
                {i < path.length - 1 && <ArrowRight className="text-ink/30" size={22} />}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {programmes.map((p) => (
            <article key={p.name.en} className="flex flex-col border border-ink/10 bg-white p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">{t(p.level)}</p>
              <h3 className="mt-3 font-display text-3xl">{t(p.name)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{t(p.text)}</p>
              <p className="mt-6 border-t border-ink/10 pt-4 text-sm font-semibold">
                {p.price ? (
                  t(p.price)
                ) : (
                  <span className="text-ink/45">{t({ en: 'Price to be announced (TZS)', sw: 'Bei itatangazwa (TZS)' })}</span>
                )}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink/60">
          {t({ en: 'Academy application fee:', sw: 'Ada ya maombi ya chuo:' })}{' '}
          <strong className="text-ink">{site.academyRegistrationFee}</strong>, {t(site.academyFeeTerms)}.
        </p>

        <div className="mt-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {curriculum.map((c) => (
              <li key={c.title.en} className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-gold-deep" />
                {t(c.title)}
              </li>
            ))}
          </ul>
          <Link
            to="/academy"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-gold-deep"
          >
            {t({ en: 'Explore the academy', sw: 'Gundua chuo' })}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
