import { Link } from 'react-router-dom'
import { ArrowRight, ImageIcon } from 'lucide-react'
import { site } from '../config/site'
import ForBrands from '../components/home/ForBrands'
import TalentPreview from '../components/home/TalentPreview'
import AcademyPreview from '../components/home/AcademyPreview'

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden pt-20">
        <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Talent house · {site.city}
            </p>

            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] sm:text-6xl lg:text-[5.5rem]">
              Tanzania's most trusted talent house.
            </h1>

            <p className="mt-6 font-display text-2xl italic text-gold sm:text-3xl">{site.promise}</p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg">
              Models, hosts and creators for brands, ads and events, trained in our own academy and
              ready for the camera, the runway and the stage.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/clients"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory"
              >
                Book talent
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/apply"
                className="inline-flex items-center justify-center rounded-full border border-ivory/30 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                Apply to join · it's free
              </Link>
            </div>
          </div>

          {/* Hero photo: replace with Eladia Edwin's photo when it arrives */}
          <figure className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 bg-ink-soft">
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <ImageIcon className="mx-auto text-stone/60" size={40} strokeWidth={1.2} />
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-stone">Photo coming</p>
                  <p className="mt-1 text-sm text-stone/80">Eladia Edwin hero portrait</p>
                </div>
              </div>
            </div>
            <figcaption className="absolute -bottom-6 left-6 right-6 border border-gold/40 bg-ink/95 px-5 py-4 backdrop-blur sm:left-auto sm:right-[-1.5rem] sm:w-72">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Trained at Blackhood</p>
              <p className="mt-1 font-display text-2xl">Eladia Edwin</p>
              <p className="text-sm text-ivory/70">Miss Kinondoni 2027–2028</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <ForBrands />
      <TalentPreview />
      <AcademyPreview />
    </>
  )
}
