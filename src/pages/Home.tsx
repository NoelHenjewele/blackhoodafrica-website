import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { site } from '../config/site'
import { useLang } from '../i18n'
import ForBrands from '../components/home/ForBrands'
import TalentPreview from '../components/home/TalentPreview'
import AcademyPreview from '../components/home/AcademyPreview'
import NewFaces from '../components/home/NewFaces'
import OurPromise from '../components/home/OurPromise'
import Castings from '../components/home/Castings'
import Reviews from '../components/home/Reviews'

export default function Home() {
  const { t } = useLang()

  return (
    <>
      <section className="relative overflow-hidden pt-20">
        <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {t({ en: 'Talent house', sw: 'Nyumba ya vipaji' })} · {site.city}
            </p>

            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] sm:text-6xl lg:text-[5.5rem]">
              {t(site.tagline)}
            </h1>

            <p className="mt-6 font-display text-2xl italic text-gold sm:text-3xl">{t(site.promise)}</p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg">
              {t({
                en: 'Models, hosts and creators for brands, ads and events, trained in our own academy and ready for the camera, the runway and the stage.',
                sw: 'Wanamitindo, washereheshaji na watengeneza maudhui kwa ajili ya makampuni, matangazo na matukio, waliofunzwa katika chuo chetu na tayari kwa kamera, jukwaa la mitindo na jukwaa la matukio.',
              })}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/clients"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory"
              >
                {t({ en: 'Book talent', sw: 'Ajiri kipaji' })}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/apply"
                className="inline-flex items-center justify-center rounded-full border border-ivory/30 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                {t({ en: "Apply to join · it's free", sw: 'Omba kujiunga · ni bure' })}
              </Link>
            </div>
          </div>

          <figure className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 bg-ink-soft">
              <img
                src="/talent/eladia-edwin/crowned-portrait.jpg"
                alt="Eladia Edwin wearing the Miss Kinondoni crown"
                className="absolute inset-0 h-full w-full object-cover object-[40%_center]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
            </div>
            <figcaption className="absolute -bottom-6 left-6 right-6 border border-gold/40 bg-ink/95 px-5 py-4 backdrop-blur sm:left-auto sm:right-[-1.5rem] sm:w-72">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                {t({ en: 'Trained at Blackhood', sw: 'Amefunzwa Blackhood' })}
              </p>
              <p className="mt-1 font-display text-2xl">Eladia Edwin</p>
              <p className="text-sm text-ivory/70">Miss Kinondoni 2027–2028</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <ForBrands />
      <TalentPreview />
      <NewFaces />
      <AcademyPreview />
      <OurPromise />
      <Reviews />
      <Castings />
    </>
  )
}
