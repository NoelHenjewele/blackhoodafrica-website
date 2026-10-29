import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { site } from '../../config/site'

// Prices and dates still to confirm with the team. Leave `price` empty to show "Price to be announced".
const programmes = [
  {
    name: 'Open masterclass',
    level: 'Start here',
    price: 'Free',
    text: 'A taster session in walk, posing and confidence. Meet the coaches and see if modeling is for you.',
  },
  {
    name: 'Weekend bootcamp',
    level: 'Foundations',
    price: '',
    text: 'An intensive in runway, posing, grooming and camera basics, ending with your first test shoot.',
  },
  {
    name: 'Full academy programme',
    level: 'Career track',
    price: '',
    text: 'The complete path to professional work: portfolio, castings, contracts and a direct route onto our boards.',
  },
]

const curriculum = ['Runway walk', 'Posing for camera', 'Grooming & style', 'Portfolio shoot', 'Castings & auditions', 'Contracts & safety']

const path = [
  { n: '01', label: 'Train' },
  { n: '02', label: 'Graduate' },
  { n: '03', label: 'Get booked' },
]

export default function AcademyPreview() {
  return (
    <section className="border-t border-white/10 bg-ivory text-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">The Academy</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              The academy that feeds the agency.
            </h2>
            <p className="mt-6 max-w-lg text-ink/70">
              Every Blackhood face is trained here. Our best graduates go straight onto our boards and into paid
              work for brands across Tanzania and beyond.
            </p>
          </div>

          <ol className="flex items-center gap-3 sm:gap-5">
            {path.map((p, i) => (
              <li key={p.n} className="flex items-center gap-3 sm:gap-5">
                <div>
                  <span className="font-display text-3xl text-gold-deep lining-nums">{p.n}</span>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em]">{p.label}</p>
                </div>
                {i < path.length - 1 && <ArrowRight className="text-ink/30" size={22} />}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {programmes.map((p) => (
            <article key={p.name} className="flex flex-col border border-ink/10 bg-white p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">{p.level}</p>
              <h3 className="mt-3 font-display text-3xl">{p.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{p.text}</p>
              <p className="mt-6 border-t border-ink/10 pt-4 text-sm font-semibold">
                {p.price ? p.price : <span className="text-ink/45">Price to be announced (TZS)</span>}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink/60">
          Academy application fee: <strong className="text-ink">{site.academyRegistrationFee}</strong>,{' '}
          {site.academyFeeTerms}.
        </p>

        <div className="mt-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {curriculum.map((c) => (
              <li key={c} className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-gold-deep" />
                {c}
              </li>
            ))}
          </ul>
          <Link
            to="/academy"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-gold-deep"
          >
            Explore the academy
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
