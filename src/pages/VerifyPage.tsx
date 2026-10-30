import { Link } from 'react-router-dom'
import { AlertTriangle, BadgeCheck, Globe, MessageCircle, ShieldCheck } from 'lucide-react'
import { site, whatsappLink } from '../config/site'
import { useLang, type L } from '../i18n'

type StaffMember = { name: string; role: L }

// Real Blackhood staff who may contact applicants. The section stays hidden while this list is empty.
const staff: StaffMember[] = []

const officialChannels = [
  { icon: MessageCircle, label: { en: 'WhatsApp & phone', sw: 'WhatsApp na simu' }, value: site.phoneDisplay, href: whatsappLink('Hello Blackhood Africa, I want to check something is really from you.') },
  { icon: Globe, label: { en: 'Website', sw: 'Tovuti' }, value: 'blackhoodafrica-website.vercel.app', href: '/' },
  { icon: BadgeCheck, label: { en: 'Instagram', sw: 'Instagram' }, value: '@blackhoodafrica', href: site.socials.instagram },
  { icon: BadgeCheck, label: { en: 'TikTok', sw: 'TikTok' }, value: '@blackhoodafrica', href: site.socials.tiktok },
  { icon: BadgeCheck, label: { en: 'Facebook', sw: 'Facebook' }, value: 'Blackhood Africa', href: site.socials.facebook },
]

const redFlags: L[] = [
  {
    en: 'Someone asks you to pay to join the agency, register, or "reserve your spot". Joining the agency is always free.',
    sw: 'Mtu anakuomba ulipe ili kujiunga na wakala, kujisajili, au "kuhifadhi nafasi". Kujiunga na wakala ni bure daima.',
  },
  {
    en: 'You are asked to send money to a personal M-Pesa, Tigo Pesa, Airtel Money or bank account.',
    sw: 'Unaombwa kutuma pesa kwenye M-Pesa, Tigo Pesa, Airtel Money au akaunti binafsi ya benki.',
  },
  {
    en: 'A "Blackhood scout" contacts you from a number or account not listed on this page.',
    sw: '"Mtafuta vipaji wa Blackhood" anawasiliana nawe kutoka namba au akaunti isiyoorodheshwa kwenye ukurasa huu.',
  },
  {
    en: 'You are asked to send revealing photos, or photos in underwear or swimwear, by chat.',
    sw: 'Unaombwa kutuma picha za utupu, au picha ukiwa na nguo za ndani au za kuogelea, kwa ujumbe.',
  },
  {
    en: 'A casting or meeting is at a private home, a hotel room, or late at night.',
    sw: 'Usaili au mkutano uko nyumbani kwa mtu, chumba cha hoteli, au usiku wa manane.',
  },
  {
    en: 'Someone wants to meet or work with an under-18 without their parent or guardian present.',
    sw: 'Mtu anataka kukutana au kufanya kazi na aliye chini ya miaka 18 bila mzazi au mlezi wake kuwepo.',
  },
  {
    en: 'You are promised guaranteed work, travel abroad or fame in exchange for money.',
    sw: 'Unaahidiwa kazi ya uhakika, safari ya nje au umaarufu kwa kubadilishana na pesa.',
  },
  {
    en: 'You are pressured to sign something on the spot, or told not to tell your family.',
    sw: 'Unalazimishwa kusaini kitu papo hapo, au unaambiwa usiiambie familia yako.',
  },
]

export default function VerifyPage() {
  const { t } = useLang()

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <ShieldCheck size={14} /> {t({ en: 'Safety check', sw: 'Ukaguzi wa usalama' })}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Is it really Blackhood?', sw: 'Je, ni Blackhood kweli?' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'Scammers sometimes pretend to be modeling agencies. If someone contacts you in our name, check it against this page first. If anything does not match, it is not us.',
              sw: 'Matapeli wakati mwingine hujifanya kuwa mawakala wa wanamitindo. Mtu akiwasiliana nawe kwa jina letu, linganisha na ukurasa huu kwanza. Kama kitu hakilingani, si sisi.',
            })}
          </p>
        </div>
      </section>

      {/* Official channels */}
      <section className="border-t border-white/10 bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-20">
          <h2 className="font-display text-4xl font-medium sm:text-5xl">
            {t({ en: 'Our only official contacts', sw: 'Mawasiliano yetu rasmi pekee' })}
          </h2>
          <p className="mt-4 max-w-2xl text-ivory/70">
            {t({
              en: 'Blackhood Africa only contacts applicants and clients through these channels.',
              sw: 'Blackhood Africa huwasiliana na waombaji na wateja kupitia njia hizi pekee.',
            })}
          </p>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {officialChannels.map(({ icon: Icon, label, value, href }) => {
              const internal = href.startsWith('/')
              const cls = 'group block bg-ink p-6 transition-colors hover:bg-ink-soft'
              const inner = (
                <>
                  <Icon className="text-gold" size={22} strokeWidth={1.5} />
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone">{t(label)}</p>
                  <p className="mt-1 break-words font-semibold group-hover:text-gold">{value}</p>
                </>
              )
              return internal ? (
                <Link key={label.en} to={href} className={cls}>{inner}</Link>
              ) : (
                <a key={label.en} href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="border-t border-white/10 bg-ivory text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
          <div>
            <h2 className="font-display text-4xl font-medium sm:text-5xl">{t({ en: 'What we charge', sw: 'Tunachotoza' })}</h2>
            <p className="mt-4 text-ink/70">
              {t({
                en: 'These are the only payments Blackhood Africa ever asks for. Anything else is not from us.',
                sw: 'Haya ndiyo malipo pekee ambayo Blackhood Africa huomba. Kingine chochote si chetu.',
              })}
            </p>
          </div>
          <div className="space-y-4">
            <div className="border border-ink/10 bg-white p-6">
              <p className="font-display text-3xl text-gold-deep">{t({ en: 'Free', sw: 'Bure' })}</p>
              <p className="mt-1 font-semibold">{t({ en: 'Scouting, castings and joining the agency', sw: 'Usaili, kuhudhuria casting na kujiunga na wakala' })}</p>
            </div>
            <div className="border border-ink/10 bg-white p-6">
              <p className="font-display text-3xl text-gold-deep lining-nums">{site.academyRegistrationFee}</p>
              <p className="mt-1 font-semibold">{t({ en: 'Academy application fee (optional)', sw: 'Ada ya maombi ya chuo (si lazima)' })}</p>
              <p className="mt-2 text-sm text-ink/70">
                {t({ en: 'Can be', sw: 'Inaweza' })} {t(site.academyFeeTerms)}.{' '}
                {t({
                  en: 'Paid only through official Blackhood channels, always with a receipt. Never to a personal number.',
                  sw: 'Hulipwa kupitia njia rasmi za Blackhood pekee, daima na risiti. Kamwe si kwa namba binafsi.',
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Red flags */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-20">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <AlertTriangle size={14} /> {t({ en: 'Red flags', sw: 'Ishara za hatari' })}
          </p>
          <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">
            {t({ en: 'Signs it is a scam.', sw: 'Dalili kwamba ni utapeli.' })}
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {redFlags.map((r) => (
              <li key={r.en} className="flex gap-4 border border-white/10 bg-ink-soft p-6 text-ivory/85">
                <AlertTriangle className="mt-0.5 shrink-0 text-red-300" size={18} />
                {t(r)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Staff (hidden until real names are added) */}
      {staff.length > 0 && (
        <section className="border-t border-white/10 bg-ink-soft">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-20">
            <h2 className="font-display text-4xl font-medium sm:text-5xl">
              {t({ en: 'Who may contact you', sw: 'Nani anaweza kuwasiliana nawe' })}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((s) => (
                <li key={s.name} className="border border-white/10 bg-ink p-6">
                  <p className="font-display text-2xl">{s.name}</p>
                  <p className="text-sm text-gold">{t(s.role)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Report */}
      <section className="border-t border-white/10 bg-gold text-ink">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10">
          <div>
            <h2 className="font-display text-4xl font-medium">{t({ en: 'Seen something suspicious?', sw: 'Umeona jambo la kutiliwa shaka?' })}</h2>
            <p className="mt-3 max-w-xl">
              {t({
                en: 'Do not pay and do not send photos. Screenshot the messages and the number, send them to us on WhatsApp, and we will tell you if it is real. If you have lost money or feel unsafe, also report it at your nearest police station.',
                sw: 'Usilipe na usitume picha. Piga picha ya skrini ya ujumbe na namba, tutumie kwa WhatsApp, nasi tutakuambia kama ni kweli. Kama umepoteza pesa au hujisikii salama, toa taarifa pia kituo cha polisi kilicho karibu.',
              })}
            </p>
          </div>
          <a
            href={whatsappLink('Hello Blackhood Africa, I want to report a possible scam using your name:')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-ink-soft lg:justify-self-end"
          >
            <MessageCircle size={16} /> {t({ en: 'Report or verify on WhatsApp', sw: 'Ripoti au thibitisha kwa WhatsApp' })}
          </a>
        </div>
      </section>
    </>
  )
}
