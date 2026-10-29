import { ArrowRight, Check } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { programmes } from '../data/programmes'

export default function AcademyPage() {
  return (
    <>
      <section className="relative pt-40 pb-24 sm:pt-48 sm:pb-32 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1800&q=80&auto=format&fit=crop"
          alt="BlackhoodAfrica Academy training session"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative container-editorial text-cream">
          <Reveal>
            <span className="eyebrow">The Academy</span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-balance">
              Real training for a real modeling career.
            </h1>
            <p className="mt-6 max-w-xl text-cream/80 text-base sm:text-lg leading-relaxed">
              The BlackhoodAfrica Academy takes aspiring models from first steps to
              industry-readiness through structured, hands-on programmes led by working
              professionals.
            </p>
            <Button to="/apply" variant="gold" className="mt-8" icon={<ArrowRight size={16} />}>
              Start Your Journey
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="container-editorial py-20 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Programme Overview"
            title="Five stages. One complete foundation."
            description="Each programme builds on the last — from movement and expression to the business skills that sustain a lasting career. Students may enrol individually or complete the full pathway."
          />
        </Reveal>

        <div className="mt-16 flex flex-col gap-px bg-ink/10">
          {programmes.map((programme, i) => (
            <Reveal key={programme.id} delay={i * 60}>
              <div className="grid grid-cols-1 lg:grid-cols-12 bg-cream">
                <div className="lg:col-span-4 img-zoom aspect-[16/10] lg:aspect-auto">
                  <img
                    src={programme.image}
                    alt={programme.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="lg:col-span-8 p-7 sm:p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl sm:text-3xl text-ink">
                      {programme.title}
                    </h3>
                    <span className="eyebrow">{programme.duration}</span>
                  </div>
                  <p className="mt-3 text-ink/70 leading-relaxed">{programme.summary}</p>

                  <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-2">
                    {programme.learn.map((item) => (
                      <span key={item} className="flex items-start gap-2 text-sm text-ink/70">
                        <Check size={15} className="text-gold-dark mt-0.5 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>

                  <p className="mt-6 text-xs uppercase tracking-widest2 text-gold-dark">
                    Who can apply
                  </p>
                  <p className="mt-1 text-sm text-ink/60">{programme.whoCanApply}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink text-cream py-20 sm:py-24">
        <div className="container-editorial text-center flex flex-col items-center">
          <Reveal>
            <span className="eyebrow">Ready When You Are</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl max-w-xl text-balance">
              Your training begins with a single application.
            </h2>
            <Button to="/apply" variant="gold" className="mt-8" icon={<ArrowRight size={16} />}>
              Start Your Journey
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
