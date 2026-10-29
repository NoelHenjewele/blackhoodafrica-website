import { Link } from 'react-router-dom'
import { ArrowRight, Plus } from 'lucide-react'
import { site } from '../config/site'
import { useLang } from '../i18n'

const pillars = [
  {
    title: { en: 'Discover', sw: 'Gundua' },
    text: {
      en: 'We scout across Tanzania for faces with presence, not just a look.',
      sw: 'Tunatafuta kote Tanzania sura zenye mvuto, si mwonekano tu.',
    },
  },
  {
    title: { en: 'Develop', sw: 'Endeleza' },
    text: {
      en: 'Our academy turns potential into professional, camera-ready skill.',
      sw: 'Chuo chetu kinageuza kipaji kuwa ujuzi wa kitaalamu, tayari kwa kamera.',
    },
  },
  {
    title: { en: 'Deliver', sw: 'Wasilisha' },
    text: {
      en: 'Brands get reliable talent, clear contracts and a team that answers.',
      sw: 'Makampuni yanapata vipaji vya kuaminika, mikataba iliyo wazi na timu inayojibu.',
    },
  },
]

export default function AboutPage() {
  const { t } = useLang()

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {t({ en: 'About Blackhood Africa', sw: 'Kuhusu Blackhood Africa' })}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t(site.tagline)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: `We are a ${site.city} talent house: a modeling agency and academy under one roof. We find people with presence, train them properly, and put them in front of the brands, stages and cameras that matter.`,
              sw: `Sisi ni nyumba ya vipaji ya ${site.city}: wakala wa wanamitindo na chuo chini ya paa moja. Tunapata watu wenye mvuto, tunawafunza ipasavyo, na kuwaweka mbele ya makampuni, majukwaa na kamera zenye umuhimu.`,
            })}
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-24">
          <figure>
            <div className="aspect-[3/2] overflow-hidden border border-white/10">
              <img
                src="/talent/eladia-edwin/crowned-with-host.jpg"
                alt="Eladia Edwin being crowned Miss Kinondoni"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-ivory/55">
              {t({ en: 'Eladia Edwin, crowned Miss Kinondoni 2027–2028.', sw: 'Eladia Edwin, akivishwa taji la Miss Kinondoni 2027–2028.' })}
            </figcaption>
          </figure>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {t({ en: 'Proof, not promises', sw: 'Ushahidi, si ahadi' })}
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              {t({ en: 'Trained here. Crowned on stage.', sw: 'Amefunzwa hapa. Amevishwa taji jukwaani.' })}
            </h2>
            <p className="mt-6 text-ivory/70">
              {t({
                en: "Eladia Edwin trained with Blackhood before taking the Miss Kinondoni 2027–2028 title. Stories like hers are why we exist: talent that's ready when the moment comes.",
                sw: 'Eladia Edwin alifunzwa na Blackhood kabla ya kushinda taji la Miss Kinondoni 2027–2028. Hadithi kama yake ndiyo sababu tupo: vipaji vilivyo tayari wakati fursa inapofika.',
              })}
            </p>
            <p className="mt-4 text-ivory/70">{t(site.promise)}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-24">
          <h2 className="font-display text-4xl font-medium sm:text-5xl">{t({ en: 'How we work', sw: 'Jinsi tunavyofanya kazi' })}</h2>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title.en} className="bg-ink-soft p-8 lg:p-10">
                <h3 className="font-display text-3xl text-gold">{t(p.title)}</h3>
                <p className="mt-3 text-ivory/70">{t(p.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our legacy: replace with real dated milestones (founding year, shows, campaigns, alumni) */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Our legacy', sw: 'Historia yetu' })}</p>
          <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">{t({ en: 'Milestones', sw: 'Hatua muhimu' })}</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="grid min-h-40 place-items-center border border-dashed border-white/15 p-6 text-center">
                <div>
                  <Plus className="mx-auto text-stone/40" size={24} strokeWidth={1.2} />
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone/70">{t({ en: 'Year · milestone', sw: 'Mwaka · tukio' })}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gold text-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center lg:px-10">
          <p className="font-display text-3xl sm:text-4xl">{t({ en: 'Work with us.', sw: 'Fanya kazi nasi.' })}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/clients" className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-ink-soft">
              {t({ en: 'Book talent', sw: 'Ajiri kipaji' })} <ArrowRight size={18} />
            </Link>
            <Link to="/apply" className="inline-flex items-center rounded-full border border-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] hover:bg-ink hover:text-ivory">
              {t({ en: 'Apply to join', sw: 'Omba kujiunga' })}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
