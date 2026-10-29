import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, FileSignature, ShieldCheck, Wallet } from 'lucide-react'

const promises = [
  {
    icon: Wallet,
    title: 'Free to apply. Fees in the open.',
    text: 'Joining the agency is always free. Academy fees are published on this site and paid only to our official accounts. Anyone asking for other fees in our name is a scam.',
  },
  {
    icon: FileSignature,
    title: 'Clear contracts',
    text: 'Every booking has a written agreement: the fee, the dates, how your image is used, and when you get paid.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe sets',
    text: 'A Blackhood chaperone for under-18s, guardian consent for minors, and no closed-door castings.',
  },
  {
    icon: BadgeCheck,
    title: 'Paid on time',
    text: 'Talent is paid within an agreed window after every job, with a statement showing exactly what was earned.',
  },
]

export default function OurPromise() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Our promise</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Trust isn't a slogan. It's how we work.
            </h2>
            <p className="mt-6 max-w-md text-ivory/70">
              For models, parents and brands alike: these are the rules we hold ourselves to, written down so you
              can hold us to them too.
            </p>
            <Link
              to="/trust"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory"
            >
              Read the full Model Charter
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {promises.map(({ icon: Icon, title, text }) => (
              <article key={title} className="bg-ink p-8 lg:p-10">
                <Icon className="text-gold" size={28} strokeWidth={1.4} />
                <h3 className="mt-6 font-display text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
