import { AlertTriangle } from 'lucide-react'
import OurPromise from '../components/home/OurPromise'
import { site, whatsappLink } from '../config/site'
import { useLang } from '../i18n'

// Draft charter. Every point is a public commitment, so confirm each with the team before launch.
const charter = [
  {
    en: 'Scouting and agency applications are free. Academy fees are published on this website.',
    sw: 'Usaili na maombi ya wakala ni bure. Ada za chuo zimewekwa wazi kwenye tovuti hii.',
  },
  {
    en: 'Every booking comes with written terms: fee, dates, hours, usage rights and payment date.',
    sw: 'Kila kazi ina masharti ya maandishi: malipo, tarehe, saa, haki za matumizi na tarehe ya malipo.',
  },
  {
    en: 'Talent sees the full client fee and the agency commission before accepting a job.',
    sw: 'Kipaji kinaona malipo kamili ya mteja na kamisheni ya wakala kabla ya kukubali kazi.',
  },
  {
    en: 'Under-18s need a parent or guardian’s written consent and are chaperoned at every job.',
    sw: 'Walio chini ya miaka 18 wanahitaji ridhaa ya maandishi ya mzazi au mlezi na husimamiwa kila kazi.',
  },
  {
    en: 'No closed-door castings. Fittings and castings happen with a Blackhood team member present.',
    sw: 'Hakuna usaili wa milango iliyofungwa. Upimaji na usaili hufanyika mbele ya mwanatimu wa Blackhood.',
  },
  {
    en: 'Talent can turn down any job they are not comfortable with, without penalty.',
    sw: 'Kipaji kinaweza kukataa kazi yoyote isiyokipendeza, bila adhabu.',
  },
  {
    en: 'Complaints are answered within 7 days, and serious concerns go straight to the director.',
    sw: 'Malalamiko hujibiwa ndani ya siku 7, na masuala mazito hufikishwa moja kwa moja kwa mkurugenzi.',
  },
]

const redFlags = [
  {
    en: 'Someone asks you to pay a fee to a personal M-Pesa or bank account in our name.',
    sw: 'Mtu anakuomba ulipe ada kwenye M-Pesa au akaunti binafsi ya benki kwa jina letu.',
  },
  {
    en: 'You are contacted by a "Blackhood scout" from a number that is not ours.',
    sw: 'Unawasiliana na "mtafuta vipaji wa Blackhood" kutoka namba isiyo yetu.',
  },
  {
    en: 'A casting is at a private home, hotel room or anywhere that feels unsafe.',
    sw: 'Usaili uko nyumbani kwa mtu, chumba cha hoteli au mahali popote pasipo salama.',
  },
  {
    en: 'You are pressured to sign something on the spot or to send revealing photos.',
    sw: 'Unalazimishwa kusaini kitu papo hapo au kutuma picha za utupu.',
  },
]

export default function TrustPage() {
  const { t } = useLang()

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Our promise', sw: 'Ahadi yetu' })}</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'The Blackhood Model Charter.', sw: 'Mkataba wa Wanamitindo wa Blackhood.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'Modeling should be safe, fair and transparent. These are the rules we hold ourselves to, published so models, parents and brands can hold us to them.',
              sw: 'Uanamitindo unapaswa kuwa salama, wa haki na wa uwazi. Hizi ni kanuni tunazojiwekea, zimechapishwa ili wanamitindo, wazazi na makampuni watuwajibishe.',
            })}
          </p>
        </div>
      </section>

      <OurPromise />

      <section className="border-t border-white/10 bg-ivory text-ink">
        <div className="mx-auto max-w-4xl px-5 py-20 lg:py-24">
          <h2 className="font-display text-4xl font-medium sm:text-5xl">{t({ en: 'The Charter, in full', sw: 'Mkataba kamili' })}</h2>
          <ol className="mt-10 space-y-6">
            {charter.map((c, i) => (
              <li key={c.en} className="flex gap-6 border-t border-ink/10 pt-6">
                <span className="font-display text-3xl text-gold-deep lining-nums">{String(i + 1).padStart(2, '0')}</span>
                <p className="pt-1 text-lg">{t(c)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              <AlertTriangle size={14} /> {t({ en: 'Scam alert', sw: 'Tahadhari ya utapeli' })}
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">
              {t({ en: 'How to spot a fake.', sw: 'Jinsi ya kutambua tapeli.' })}
            </h2>
            <p className="mt-6 text-ivory/70">
              {t({ en: 'Our only official WhatsApp is', sw: 'WhatsApp yetu rasmi pekee ni' })}{' '}
              <strong className="text-ivory">{site.phoneDisplay}</strong>
              {t({
                en: ', and our social accounts are @blackhoodafrica. If something feels wrong, check with us first.',
                sw: ', na akaunti zetu za mitandao ni @blackhoodafrica. Ukiona jambo lisilo sawa, wasiliana nasi kwanza.',
              })}
            </p>
            <a
              href={whatsappLink('Hello Blackhood Africa, I want to check whether this is really from you:')}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory"
            >
              {t({ en: 'Verify with us', sw: 'Thibitisha nasi' })}
            </a>
          </div>
          <ul className="space-y-4">
            {redFlags.map((r) => (
              <li key={r.en} className="border border-white/10 bg-ink-soft p-6 text-ivory/80">
                {t(r)}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
