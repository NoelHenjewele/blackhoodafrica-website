import { useState } from 'react'
import { ArrowRight, Compass, Sparkles, GraduationCap, Briefcase } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import ModelCard from '../components/ModelCard'
import ModelModal from '../components/ModelModal'
import SocialLinks from '../components/SocialLinks'
import { models } from '../data/models'
import { opportunities } from '../data/opportunities'
import type { Model } from '../data/models'
import { buildWhatsAppLink, INSTAGRAM_URL, TIKTOK_URL } from '../utils/whatsapp'

const paths = [
  {
    icon: Sparkles,
    title: 'Aspiring Model',
    description: 'New to the industry and ready to be discovered, trained, and represented.',
    to: '/apply',
  },
  {
    icon: Briefcase,
    title: 'Professional Model',
    description: 'Established talent looking for representation, bookings, and industry growth.',
    to: '/talent',
  },
  {
    icon: Compass,
    title: 'Brand or Creative',
    description: 'Casting for a campaign, editorial, or production and need the right face.',
    to: '/opportunities',
  },
  {
    icon: GraduationCap,
    title: 'Academy Student',
    description: 'Ready to build the skills and confidence a modeling career demands.',
    to: '/academy',
  },
]

export default function HomePage() {
  const [selected, setSelected] = useState<Model | null>(null)
  const featured = models.filter((m) => m.featured).slice(0, 6)
  const currentOpportunities = opportunities.slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=80&auto=format&fit=crop"
          alt="Editorial portrait of a BlackhoodAfrica model"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="relative container-editorial pb-24 sm:pb-28 pt-40 text-cream">
          <Reveal>
            <span className="eyebrow">BlackhoodAfrica Modeling Academy · Tanzania</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-5 max-w-4xl font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] text-balance">
              Discover. Develop.
              <br />
              Define your presence.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-cream/80 leading-relaxed">
              We scout, train, and represent Tanzania's next generation of confident, professional
              models — from first casting to international runway.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Button to="/apply" variant="gold" icon={<ArrowRight size={16} />}>
                Apply to Join
              </Button>
              <Button to="/talent" variant="outline-light">
                Explore Our Talent
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Find your path */}
      <section className="container-editorial py-20 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Find Your Path"
            title="Wherever you are in your journey, there's a place for you here."
            align="left"
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10">
          {paths.map((path, i) => (
            <Reveal key={path.title} delay={i * 80}>
              <a
                href={path.to}
                className="group flex flex-col justify-between h-full bg-cream p-8 min-h-[280px] hover:bg-ink transition-colors duration-500"
              >
                <path.icon
                  size={28}
                  strokeWidth={1.5}
                  className="text-gold-dark group-hover:text-gold transition-colors duration-500"
                />
                <div>
                  <h3 className="mt-8 font-display text-xl text-ink group-hover:text-cream transition-colors duration-500">
                    {path.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60 group-hover:text-cream/70 transition-colors duration-500">
                    {path.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest2 text-gold-dark group-hover:text-gold transition-colors duration-500">
                    Learn more <ArrowRight size={13} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured talent */}
      <section className="bg-bone py-20 sm:py-28">
        <div className="container-editorial">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <SectionHeading
                eyebrow="Featured Talent"
                title="Faces we're proud to represent."
                align="left"
              />
              <Button to="/talent" variant="outline" className="shrink-0">
                View Full Directory
              </Button>
            </div>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {featured.map((model, i) => (
              <Reveal key={model.id} delay={(i % 3) * 100}>
                <ModelCard model={model} onSelect={setSelected} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Academy intro */}
      <section className="py-20 sm:py-28 overflow-hidden">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal className="img-zoom order-2 lg:order-1 aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=1000&q=80&auto=format&fit=crop"
              alt="BlackhoodAfrica Academy students in training"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal className="order-1 lg:order-2" delay={100}>
            <SectionHeading
              eyebrow="The Academy"
              title="Where raw potential becomes industry-ready talent."
              description="Our academy trains aspiring models in runway, posing, grooming, portfolio-building, and professional etiquette — the full foundation for a lasting modeling career."
            />
            <Button to="/academy" variant="primary" className="mt-8" icon={<ArrowRight size={16} />}>
              Explore the Academy
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Opportunities */}
      <section className="bg-ink text-cream py-20 sm:py-28">
        <div className="container-editorial">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <SectionHeading
                eyebrow="Opportunities"
                title="Current castings and bookings."
                light
              />
              <Button to="/opportunities" variant="outline-light" className="shrink-0">
                View All Opportunities
              </Button>
            </div>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {currentOpportunities.map((op, i) => (
              <Reveal key={op.id} delay={i * 100}>
                <div className="border border-cream/15 p-7 h-full flex flex-col">
                  <span className="eyebrow">{op.category}</span>
                  <h3 className="mt-3 font-display text-lg leading-snug">{op.title}</h3>
                  <p className="mt-3 text-sm text-cream/60">{op.location} · {op.deadline}</p>
                  <a
                    href={buildWhatsAppLink(`Hello BlackhoodAfrica, I would like to apply for "${op.title}".`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest2 text-gold hover:text-gold-light transition-colors"
                  >
                    Apply via WhatsApp <ArrowRight size={13} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Social callout */}
      <section className="py-20 sm:py-28">
        <div className="container-editorial text-center flex flex-col items-center">
          <Reveal>
            <span className="eyebrow">Follow the Journey</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl max-w-xl text-balance">
              See our talent in motion on Instagram and TikTok.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 flex items-center gap-6">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                @blackhoodafrica
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                TikTok
              </a>
            </div>
            <SocialLinks className="mt-8 justify-center" iconSize={22} />
          </Reveal>
        </div>
      </section>

      {/* WhatsApp CTA banner */}
      <section className="bg-gold text-ink py-16 sm:py-20">
        <div className="container-editorial flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">
              Ready to start your modeling journey?
            </h2>
            <p className="mt-2 text-ink/70">
              Message us directly on WhatsApp — we typically reply within a day.
            </p>
          </div>
          <a
            href={buildWhatsAppLink('Hello BlackhoodAfrica, I would like to know more about joining the academy.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-ink text-cream hover:bg-white hover:text-ink shrink-0"
          >
            Message Us on WhatsApp
          </a>
        </div>
      </section>

      {selected && <ModelModal model={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
