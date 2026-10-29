import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Mic, Smartphone, Sparkles } from 'lucide-react'
import { whatsappLink } from '../../config/site'
import { clients } from '../../data/clients'

const services = [
  {
    icon: Camera,
    title: 'Commercial & ads',
    text: 'Faces for TV, billboards, print and digital campaigns, cast to your brief.',
  },
  {
    icon: Mic,
    title: 'Events & hosting',
    text: 'Hosts, ushers and brand ambassadors for launches, activations and corporate events.',
  },
  {
    icon: Smartphone,
    title: 'Creators & UGC',
    text: 'On-camera creators for TikTok, Instagram and user-generated content that sells.',
  },
  {
    icon: Sparkles,
    title: 'Runway & fashion',
    text: 'Show-ready models for fashion weeks, designers and editorial shoots.',
  },
]

const steps = [
  { n: '01', title: 'Shortlist', text: 'Browse our boards and pick the faces you like, or let us suggest them.' },
  { n: '02', title: 'Send your brief', text: 'Job type, dates, budget and usage rights. It takes two minutes.' },
  { n: '03', title: 'Confirmed in 24 hours', text: 'We reply within a day with availability, rates and a clear contract.' },
]

// `standalone` is used on the For brands page itself, where the "All services" link would point back to the same page.
export default function ForBrands({ standalone = false }: { standalone?: boolean }) {
  return (
    <section className="border-t border-white/10 bg-ink-soft">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {standalone ? 'What we do' : 'For brands'}
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              The right face for every campaign, show and stage.
            </h2>
          </div>
          {!standalone && (
            <Link
              to="/clients"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory"
            >
              All services
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-ink-soft p-8 transition-colors hover:bg-ink">
              <Icon className="text-gold" size={28} strokeWidth={1.4} />
              <h3 className="mt-6 font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h3 className="font-display text-3xl sm:text-4xl">How booking works</h3>
            <p className="mt-4 max-w-sm text-ivory/65">
              No chasing, no guesswork. Clear rates, signed contracts and talent that turns up ready.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/clients#brief"
                className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory"
              >
                Send a brief
              </Link>
              <a
                href={whatsappLink('Hello Blackhood Africa, I would like to book talent.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-ivory/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] hover:border-gold hover:text-gold"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          <ol className="grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-gold/50 pt-6">
                <span className="font-display text-4xl text-gold lining-nums">{s.n}</span>
                <h4 className="mt-3 text-lg font-semibold">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ivory/65">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Hidden until real, confirmed client logos are added to src/data/clients.ts */}
        {clients.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-10">
            <p className="text-center text-xs uppercase tracking-[0.3em] text-stone">Brands we've worked with</p>
            <div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
              {clients.map((c) => (
                <img
                  key={c.name}
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  className="mx-auto max-h-12 w-auto opacity-70 grayscale invert transition hover:opacity-100"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
