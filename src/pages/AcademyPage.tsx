import { Link } from 'react-router-dom'
import { ArrowRight, Check, Plus } from 'lucide-react'
import { site, whatsappLink } from '../config/site'
import { curriculum, faqs, programmes } from '../data/academy'
import { useLang } from '../i18n'

export default function AcademyPage() {
  const { t } = useLang()

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {t({ en: 'The Blackhood Academy', sw: 'Chuo cha Blackhood' })}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Where raw potential becomes booked talent.', sw: 'Mahali kipaji ghafi kinakuwa kipaji kinachoajiriwa.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'Practical training from working professionals, with a clear path onto our boards for those ready to work. Fees are published upfront, with no hidden extras.',
              sw: 'Mafunzo ya vitendo kutoka kwa wataalamu walio kazini, na njia iliyo wazi ya kuingia kwenye orodha zetu kwa walio tayari kufanya kazi. Ada zimewekwa wazi, bila gharama zilizofichwa.',
            })}
          </p>
        </div>
      </section>

      <section className="bg-ivory text-ink">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-24">
          <h2 className="font-display text-4xl font-medium sm:text-5xl">{t({ en: 'Programmes', sw: 'Programu' })}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
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

          <div className="mt-10 grid gap-6 border border-gold-deep/30 bg-white p-8 sm:grid-cols-[auto_1fr] sm:items-center">
            <p className="font-display text-4xl text-gold-deep lining-nums">{site.academyRegistrationFee}</p>
            <div>
              <p className="font-semibold">{t({ en: 'Academy application fee', sw: 'Ada ya maombi ya chuo' })}</p>
              <p className="text-sm text-ink/70">
                {t({ en: 'It can be', sw: 'Inaweza' })} {t(site.academyFeeTerms)}.{' '}
                {t({
                  en: "Pay only to Blackhood Africa's official accounts and keep your receipt. Scouting and agency applications are always free.",
                  sw: 'Lipa kwenye akaunti rasmi za Blackhood Africa pekee na hifadhi risiti yako. Usaili na maombi ya wakala ni bure daima.',
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: "What you'll learn", sw: 'Utakachojifunza' })}</p>
          <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">
            {t({ en: 'Skills brands actually book for.', sw: 'Ujuzi ambao makampuni huajiri kwa ajili yake.' })}
          </h2>
          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {curriculum.map((c) => (
              <div key={c.title.en} className="bg-ink p-8">
                <Check className="text-gold" size={22} />
                <h3 className="mt-4 font-display text-2xl">{t(c.title)}</h3>
                <p className="mt-2 text-sm text-ivory/65">{t(c.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches: add real names, photos and credits when confirmed */}
      <section className="border-t border-white/10 bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-24">
          <h2 className="font-display text-4xl font-medium sm:text-5xl">{t({ en: 'Your coaches', sw: 'Walimu wako' })}</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="grid aspect-square place-items-center border border-dashed border-white/15">
                  <Plus className="text-stone/40" size={26} strokeWidth={1.2} />
                </div>
                <p className="mt-3 text-sm text-stone">{t({ en: 'Coach profile coming', sw: 'Wasifu wa mwalimu unakuja' })}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {t({ en: 'For parents & students', sw: 'Kwa wazazi na wanafunzi' })}
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">{t({ en: 'Questions, answered.', sw: 'Maswali, majibu.' })}</h2>
            <a
              href={whatsappLink('Hello Blackhood Africa, I have a question about the academy.')}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory"
            >
              {t({ en: 'Ask us on WhatsApp →', sw: 'Tuulize kwa WhatsApp →' })}
            </a>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((f) => (
              <details key={f.q.en} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl">
                  {t(f.q)}
                  <Plus size={20} className="shrink-0 text-gold transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gold text-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center lg:px-10">
          <p className="font-display text-3xl sm:text-4xl">{t({ en: 'Ready to start?', sw: 'Uko tayari kuanza?' })}</p>
          <Link
            to="/apply"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-ink-soft"
          >
            {t({ en: 'Apply now', sw: 'Omba sasa' })}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}
