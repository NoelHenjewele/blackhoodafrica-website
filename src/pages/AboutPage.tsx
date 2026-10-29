import { ArrowRight } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'

const values = [
  {
    title: 'Authenticity',
    description: 'We celebrate the diversity of African beauty, in every shade, shape, and story.',
  },
  {
    title: 'Discipline',
    description: 'Talent opens the door; discipline and professionalism keep you in the room.',
  },
  {
    title: 'Community',
    description: 'We grow together — models, mentors, and creatives building the industry as one.',
  },
  {
    title: 'Excellence',
    description: 'From training to representation, we hold every stage of the journey to a high standard.',
  },
]

const milestones = [
  { year: '2021', event: 'BlackhoodAfrica founded in Dar es Salaam with a handful of aspiring models.' },
  { year: '2022', event: 'Launched our first structured Academy training cohort.' },
  { year: '2023', event: 'Expanded scouting to Arusha, Mwanza, and Zanzibar.' },
  { year: '2024', event: 'Talent represented at regional fashion weeks and national campaigns.' },
  { year: '2026', event: 'Continuing to grow a home-grown pipeline of professional African talent.' },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-40 pb-24 sm:pt-48 sm:pb-32 bg-ink text-cream overflow-hidden">
        <div className="container-editorial">
          <Reveal>
            <span className="eyebrow">About BlackhoodAfrica</span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-balance">
              Built in Tanzania, for the future of African modeling.
            </h1>
            <p className="mt-6 max-w-xl text-cream/75 text-base sm:text-lg leading-relaxed">
              BlackhoodAfrica exists to discover overlooked talent, develop it with real
              professional training, and connect it to genuine opportunity — across Tanzania and
              beyond.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-editorial py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal className="img-zoom aspect-[4/5] order-2 lg:order-1">
          <img
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1000&q=80&auto=format&fit=crop"
            alt="A BlackhoodAfrica model in an editorial studio setting"
            className="h-full w-full object-cover"
          />
        </Reveal>
        <Reveal delay={100} className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Our Mission"
            title="Give Tanzanian talent a genuine, professional path into modeling."
            description="Too much promising talent in Tanzania and across the continent never gets a fair shot — not for lack of ability, but for lack of access, training, and representation. BlackhoodAfrica closes that gap with real structure: honest scouting, rigorous training, and industry-ready representation."
          />
        </Reveal>
      </section>

      <section className="bg-bone py-20 sm:py-28">
        <div className="container-editorial">
          <Reveal>
            <SectionHeading
              eyebrow="Our Vision"
              title="A modeling industry rooted in Africa, respected worldwide."
              description="We believe the next generation of globally recognised modeling talent will come from cities like Dar es Salaam, Arusha, and Mwanza — not despite being Tanzanian, but because of it."
              align="left"
            />
          </Reveal>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <div className="border-t-2 border-gold pt-5">
                  <h3 className="font-display text-lg text-ink">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-editorial">
          <Reveal>
            <SectionHeading eyebrow="Milestones" title="Our journey so far." align="left" />
          </Reveal>
          <div className="mt-14 flex flex-col divide-y divide-ink/10 max-w-3xl">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 60}>
                <div className="flex items-baseline gap-8 py-6">
                  <span className="font-display text-2xl sm:text-3xl text-gold-dark w-24 shrink-0">
                    {m.year}
                  </span>
                  <p className="text-ink/75 leading-relaxed">{m.event}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-cream py-20 sm:py-24">
        <div className="container-editorial text-center flex flex-col items-center">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl max-w-xl text-balance">
              Ready to be part of the next chapter?
            </h2>
            <Button to="/apply" variant="gold" className="mt-8" icon={<ArrowRight size={16} />}>
              Apply to Join
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
