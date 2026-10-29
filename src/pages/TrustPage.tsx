import { AlertTriangle } from 'lucide-react'
import OurPromise from '../components/home/OurPromise'
import { site, whatsappLink } from '../config/site'

// Draft charter. Every point is a public commitment, so confirm each with the team before launch.
const charter = [
  'Scouting and agency applications are free. Academy fees are published on this website.',
  'Every booking comes with written terms: fee, dates, hours, usage rights and payment date.',
  'Talent sees the full client fee and the agency commission before accepting a job.',
  'Under-18s need a parent or guardian’s written consent and are chaperoned at every job.',
  'No closed-door castings. Fittings and castings happen with a Blackhood team member present.',
  'Talent can turn down any job they are not comfortable with, without penalty.',
  'Complaints are answered within 7 days, and serious concerns go straight to the director.',
]

const redFlags = [
  'Someone asks you to pay a fee to a personal M-Pesa or bank account in our name.',
  'You are contacted by a "Blackhood scout" from a number that is not ours.',
  'A casting is at a private home, hotel room or anywhere that feels unsafe.',
  'You are pressured to sign something on the spot or to send revealing photos.',
]

export default function TrustPage() {
  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Our promise</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            The Blackhood Model Charter.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            Modeling should be safe, fair and transparent. These are the rules we hold ourselves to, published so
            models, parents and brands can hold us to them.
          </p>
        </div>
      </section>

      <OurPromise />

      <section className="border-t border-white/10 bg-ivory text-ink">
        <div className="mx-auto max-w-4xl px-5 py-20 lg:py-24">
          <h2 className="font-display text-4xl font-medium sm:text-5xl">The Charter, in full</h2>
          <ol className="mt-10 space-y-6">
            {charter.map((c, i) => (
              <li key={c} className="flex gap-6 border-t border-ink/10 pt-6">
                <span className="font-display text-3xl text-gold-deep lining-nums">{String(i + 1).padStart(2, '0')}</span>
                <p className="pt-1 text-lg">{c}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              <AlertTriangle size={14} /> Scam alert
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">How to spot a fake.</h2>
            <p className="mt-6 text-ivory/70">
              Our only official WhatsApp is <strong className="text-ivory">{site.phoneDisplay}</strong>, and our social
              accounts are @blackhoodafrica. If something feels wrong, check with us first.
            </p>
            <a
              href={whatsappLink('Hello Blackhood Africa, I want to check whether this is really from you:')}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory"
            >
              Verify with us
            </a>
          </div>
          <ul className="space-y-4">
            {redFlags.map((r) => (
              <li key={r} className="border border-white/10 bg-ink-soft p-6 text-ivory/80">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
