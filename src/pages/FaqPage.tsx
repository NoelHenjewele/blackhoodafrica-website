import { Plus } from 'lucide-react'
import { site, whatsappLink } from '../config/site'
import { faqs as academyFaqs } from '../data/academy'
import { useLang, type L } from '../i18n'

type QA = { q: L; a: L }

const groups: { title: L; items: QA[] }[] = [
  {
    title: { en: 'Applying', sw: 'Kuomba' },
    items: [
      {
        q: { en: 'How do I apply?', sw: 'Ninaombaje?' },
        a: {
          en: 'Fill in the form on our Apply page, or message us on WhatsApp with your name, age, height, city and 3 photos with no filters: a face close-up, full body and side profile.',
          sw: 'Jaza fomu kwenye ukurasa wa Omba, au tuandikie WhatsApp jina lako, umri, urefu, mji na picha 3 bila filter: uso karibu, mwili mzima na ubavuni.',
        },
      },
      {
        q: { en: 'Do I need experience?', sw: 'Je, nahitaji uzoefu?' },
        a: {
          en: 'No. We look for presence and potential. If you have none, the academy can teach you the skills.',
          sw: 'Hapana. Tunatafuta mvuto na uwezo. Kama huna uzoefu, chuo kinaweza kukufundisha ujuzi.',
        },
      },
      {
        q: { en: 'How old do I need to be?', sw: 'Ninatakiwa kuwa na umri gani?' },
        a: {
          en: 'Anyone can apply. Under-18s need a parent or guardian involved from the start, and they are chaperoned at every job.',
          sw: 'Yeyote anaweza kuomba. Walio chini ya miaka 18 wanahitaji mzazi au mlezi ahusike tangu mwanzo, na husimamiwa kila kazi.',
        },
      },
      {
        q: { en: 'Is there a height requirement?', sw: 'Je, kuna kigezo cha urefu?' },
        a: {
          en: 'Not for every board. Runway work usually needs more height, but commercial, creator and hosting work suits many heights and looks.',
          sw: 'Si kwa kila orodha. Kazi za jukwaa la mitindo kwa kawaida zinahitaji urefu zaidi, lakini matangazo, maudhui na ushereheshaji yanafaa urefu na mwonekano mbalimbali.',
        },
      },
      {
        q: { en: 'How long until I hear back?', sw: 'Nitajibiwa baada ya muda gani?' },
        a: {
          en: 'Our scouting team reviews every application and replies on WhatsApp.',
          sw: 'Timu yetu ya usaili hupitia kila ombi na hujibu kwa WhatsApp.',
        },
      },
    ],
  },
  {
    title: { en: 'Fees & the academy', sw: 'Ada na chuo' },
    items: academyFaqs,
  },
  {
    title: { en: 'Safety', sw: 'Usalama' },
    items: [
      {
        q: { en: 'How do I know a message is really from Blackhood?', sw: 'Nitajuaje ujumbe ni kweli kutoka Blackhood?' },
        a: {
          en: `Our only official WhatsApp is ${site.phoneDisplay} and our social accounts are @blackhoodafrica. If in doubt, message that number to check.`,
          sw: `WhatsApp yetu rasmi pekee ni ${site.phoneDisplay} na akaunti zetu za mitandao ni @blackhoodafrica. Ukiwa na shaka, tuma ujumbe kwa namba hiyo kuthibitisha.`,
        },
      },
      {
        q: { en: 'Will I ever have to go to a private casting?', sw: 'Je, nitawahi kwenda usaili wa faragha?' },
        a: {
          en: 'No. There are no closed-door castings. A Blackhood team member is present at fittings and castings.',
          sw: 'Hapana. Hakuna usaili wa milango iliyofungwa. Mwanatimu wa Blackhood huwepo kwenye upimaji na usaili.',
        },
      },
    ],
  },
  {
    title: { en: 'For brands', sw: 'Kwa makampuni' },
    items: [
      {
        q: { en: 'How do I book talent?', sw: 'Ninaajirije vipaji?' },
        a: {
          en: 'Send a brief from our For brands page or on WhatsApp with the job type, dates, location, budget and usage rights. We reply within 24 hours.',
          sw: 'Tuma maelezo kupitia ukurasa wa Kwa makampuni au WhatsApp ukieleza aina ya kazi, tarehe, mahali, bajeti na haki za matumizi. Tunajibu ndani ya saa 24.',
        },
      },
      {
        q: { en: 'What are usage rights?', sw: 'Haki za matumizi ni nini?' },
        a: {
          en: 'Where and for how long the images or video will be used, such as social only, or TV and billboards for a year. They affect the fee, so we agree them up front.',
          sw: 'Wapi na kwa muda gani picha au video zitatumika, mfano mitandao ya kijamii pekee, au TV na mabango kwa mwaka mmoja. Zinaathiri malipo, kwa hiyo tunakubaliana mapema.',
        },
      },
    ],
  },
]

export default function FaqPage() {
  const { t } = useLang()

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">FAQ</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Questions, answered.', sw: 'Maswali, majibu.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: "Everything models, parents and brands usually ask us. Can't find yours? Message us on WhatsApp.",
              sw: 'Kila kitu ambacho wanamitindo, wazazi na makampuni hutuuliza. Hujapata swali lako? Tuandikie WhatsApp.',
            })}
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl space-y-14 px-5 py-16 lg:py-24">
          {groups.map((g) => (
            <div key={g.title.en}>
              <h2 className="font-display text-3xl text-gold">{t(g.title)}</h2>
              <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
                {g.items.map((f) => (
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
          ))}

          <div className="flex flex-col items-start justify-between gap-6 border border-white/10 bg-ink-soft p-8 sm:flex-row sm:items-center">
            <p className="font-display text-2xl">{t({ en: 'Still have a question?', sw: 'Bado una swali?' })}</p>
            <a
              href={whatsappLink('Hello Blackhood Africa, I have a question:')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory"
            >
              {t({ en: 'Ask on WhatsApp', sw: 'Uliza kwa WhatsApp' })}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
