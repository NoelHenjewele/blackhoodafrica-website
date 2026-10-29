import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, FileSignature, ShieldCheck, Wallet } from 'lucide-react'
import { useLang } from '../../i18n'

const promises = [
  {
    icon: Wallet,
    title: { en: 'Free to apply. Fees in the open.', sw: 'Kuomba ni bure. Ada ziko wazi.' },
    text: {
      en: 'Joining the agency is always free. Academy fees are published on this site and paid only to our official accounts. Anyone asking for other fees in our name is a scam.',
      sw: 'Kujiunga na wakala ni bure daima. Ada za chuo zimewekwa wazi kwenye tovuti hii na hulipwa kwenye akaunti zetu rasmi pekee. Yeyote anayedai ada nyingine kwa jina letu ni tapeli.',
    },
  },
  {
    icon: FileSignature,
    title: { en: 'Clear contracts', sw: 'Mikataba iliyo wazi' },
    text: {
      en: 'Every booking has a written agreement: the fee, the dates, how your image is used, and when you get paid.',
      sw: 'Kila kazi ina makubaliano ya maandishi: malipo, tarehe, jinsi picha yako itakavyotumika, na lini utalipwa.',
    },
  },
  {
    icon: ShieldCheck,
    title: { en: 'Safe sets', sw: 'Mazingira salama' },
    text: {
      en: 'A Blackhood chaperone for under-18s, guardian consent for minors, and no closed-door castings.',
      sw: 'Msimamizi wa Blackhood kwa walio chini ya miaka 18, ridhaa ya mlezi kwa watoto, na hakuna usaili wa milango iliyofungwa.',
    },
  },
  {
    icon: BadgeCheck,
    title: { en: 'Paid on time', sw: 'Malipo kwa wakati' },
    text: {
      en: 'Talent is paid within an agreed window after every job, with a statement showing exactly what was earned.',
      sw: 'Vipaji hulipwa ndani ya muda uliokubaliwa baada ya kila kazi, pamoja na taarifa inayoonyesha kiasi halisi kilichopatikana.',
    },
  },
]

export default function OurPromise() {
  const { t } = useLang()

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Our promise', sw: 'Ahadi yetu' })}</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              {t({ en: "Trust isn't a slogan. It's how we work.", sw: 'Uaminifu si kauli mbiu. Ndivyo tunavyofanya kazi.' })}
            </h2>
            <p className="mt-6 max-w-md text-ivory/70">
              {t({
                en: 'For models, parents and brands alike: these are the rules we hold ourselves to, written down so you can hold us to them too.',
                sw: 'Kwa wanamitindo, wazazi na makampuni: hizi ni kanuni tunazojiwekea, zimeandikwa ili nawe utuwajibishe.',
              })}
            </p>
            <Link
              to="/trust"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory"
            >
              {t({ en: 'Read the full Model Charter', sw: 'Soma Mkataba kamili wa Wanamitindo' })}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {promises.map(({ icon: Icon, title, text }) => (
              <article key={title.en} className="bg-ink p-8 lg:p-10">
                <Icon className="text-gold" size={28} strokeWidth={1.4} />
                <h3 className="mt-6 font-display text-2xl">{t(title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{t(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
