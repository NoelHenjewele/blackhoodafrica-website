import { Link } from 'react-router-dom'
import { BookOpen, FileSignature, HeartHandshake, MessageCircle, ShieldCheck, Wallet } from 'lucide-react'
import { site, whatsappLink } from '../config/site'
import { useLang, type L } from '../i18n'

// Draft commitments for parents: confirm each with the team before promoting this page.
const sections: { icon: typeof ShieldCheck; title: L; points: L[] }[] = [
  {
    icon: ShieldCheck,
    title: { en: 'Safety first', sw: 'Usalama kwanza' },
    points: [
      {
        en: 'A parent or guardian is welcome at every class, and must be present or give written consent for every casting, shoot and job.',
        sw: 'Mzazi au mlezi anakaribishwa kila darasa, na lazima awepo au atoe ridhaa ya maandishi kwa kila usaili, upigaji picha na kazi.',
      },
      {
        en: 'A Blackhood team member chaperones under-18s on every job.',
        sw: 'Mwanatimu wa Blackhood humsimamia aliye chini ya miaka 18 kila kazini.',
      },
      {
        en: 'No meetings in private homes or hotel rooms, no late-night castings, and no revealing photos. Ever.',
        sw: 'Hakuna mikutano nyumbani kwa mtu au vyumba vya hoteli, hakuna usaili wa usiku, na hakuna picha za utupu. Kamwe.',
      },
    ],
  },
  {
    icon: FileSignature,
    title: { en: 'Contracts', sw: 'Mikataba' },
    points: [
      {
        en: 'For anyone under 18, a parent or guardian reads and signs every agreement. Nothing is signed by the child alone.',
        sw: 'Kwa aliye chini ya miaka 18, mzazi au mlezi husoma na kusaini kila makubaliano. Mtoto hasaini chochote peke yake.',
      },
      {
        en: 'Every job is in writing: the fee, dates, hours, where the photos will be used, and when payment is made.',
        sw: 'Kila kazi iko kwa maandishi: malipo, tarehe, saa, mahali picha zitatumika, na lini malipo yatafanyika.',
      },
      {
        en: 'You can say no to any job, without penalty.',
        sw: 'Unaweza kukataa kazi yoyote, bila adhabu.',
      },
    ],
  },
  {
    icon: Wallet,
    title: { en: 'Costs', sw: 'Gharama' },
    points: [
      {
        en: 'Applying, scouting, castings and joining the agency are free.',
        sw: 'Kuomba, usaili, casting na kujiunga na wakala ni bure.',
      },
      {
        en: `The academy is optional. Its application fee is ${site.academyRegistrationFee}, paid in full or in 2 instalments of TZS 30,000.`,
        sw: `Chuo ni hiari. Ada yake ya maombi ni ${site.academyRegistrationFee}, kulipwa yote au kwa awamu 2 za TZS 30,000.`,
      },
      {
        en: 'Pay only through official Blackhood channels, and always get a receipt. Never pay anyone personally.',
        sw: 'Lipa kupitia njia rasmi za Blackhood pekee, na daima pata risiti. Usimlipe mtu yeyote binafsi.',
      },
    ],
  },
  {
    icon: BookOpen,
    title: { en: 'School comes first', sw: 'Shule kwanza' },
    points: [
      {
        en: 'Classes and jobs for students are planned around school hours, weekends and holidays.',
        sw: 'Madarasa na kazi za wanafunzi hupangwa kulingana na muda wa shule, wikendi na likizo.',
      },
      {
        en: 'We will never ask a student to miss exams or school days for a booking.',
        sw: 'Hatutamwomba mwanafunzi akose mitihani au siku za shule kwa ajili ya kazi.',
      },
    ],
  },
  {
    icon: HeartHandshake,
    title: { en: 'Wellbeing', sw: 'Ustawi' },
    points: [
      {
        en: 'We never ask young people to change their body or diet to get work.',
        sw: 'Hatuwaombi vijana kubadilisha miili yao au lishe ili kupata kazi.',
      },
      {
        en: 'Your child can talk to our team at any time, and so can you.',
        sw: 'Mtoto wako anaweza kuongea na timu yetu wakati wowote, nawe pia.',
      },
    ],
  },
]

export default function ParentsPage() {
  const { t } = useLang()

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: "Parents' guide", sw: 'Mwongozo kwa wazazi' })}</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Your child is safe with us. Here is how.', sw: 'Mtoto wako yuko salama nasi. Hivi ndivyo.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'If your son or daughter wants to model, you will have questions. This page answers the most important ones: safety, contracts, money and school.',
              sw: 'Kama mwanao anataka kuwa mwanamitindo, utakuwa na maswali. Ukurasa huu unajibu muhimu zaidi: usalama, mikataba, pesa na shule.',
            })}
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl space-y-6 px-5 py-16 lg:py-20">
          {sections.map(({ icon: Icon, title, points }) => (
            <article key={title.en} className="grid gap-6 border border-white/10 bg-ink-soft p-8 md:grid-cols-[220px_1fr]">
              <div>
                <Icon className="text-gold" size={28} strokeWidth={1.4} />
                <h2 className="mt-4 font-display text-3xl">{t(title)}</h2>
              </div>
              <ul className="space-y-4">
                {points.map((p) => (
                  <li key={p.en} className="border-l-2 border-gold/50 pl-4 text-ivory/80">
                    {t(p)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-ivory text-ink">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10">
          <div>
            <h2 className="font-display text-4xl font-medium">{t({ en: 'Talk to us first', sw: 'Ongea nasi kwanza' })}</h2>
            <p className="mt-3 max-w-xl text-ink/75">
              {t({
                en: `Parents are always welcome to call or WhatsApp us on ${site.phoneDisplay} before anything is decided. To check that a message really came from us, see our`,
                sw: `Wazazi wanakaribishwa kila wakati kutupigia au kutuandikia WhatsApp ${site.phoneDisplay} kabla ya uamuzi wowote. Kuhakikisha ujumbe umetoka kwetu kweli, angalia ukurasa wetu wa`,
              })}{' '}
              <Link to="/verify" className="font-semibold underline">
                {t({ en: '"Is it really us?" page', sw: '"Ni sisi kweli?"' })}
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <a
              href={whatsappLink("Hello Blackhood Africa, I'm a parent and I have some questions.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-ink-soft"
            >
              <MessageCircle size={16} /> {t({ en: 'WhatsApp us as a parent', sw: 'Tuandikie WhatsApp kama mzazi' })}
            </a>
            <Link to="/apply" className="text-sm font-semibold uppercase tracking-[0.12em] hover:underline">
              {t({ en: 'Apply together →', sw: 'Ombeni pamoja →' })}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
