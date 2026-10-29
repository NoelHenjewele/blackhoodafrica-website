import { Link } from 'react-router-dom'
import { ArrowRight, Check, Plus } from 'lucide-react'
import { site, whatsappLink } from '../config/site'
import { curriculum, faqs, programmes } from '../data/academy'

export default function AcademyPage() {
  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">The Blackhood Academy</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            Where raw potential becomes booked talent.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            Practical training from working professionals, with a clear path onto our boards for those ready to work.
            Fees are published upfront, with no hidden extras.
          </p>
        </div>
      </section>

      <section className="bg-ivory text-ink">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-24">
          <h2 className="font-display text-4xl font-medium sm:text-5xl">Programmes</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {programmes.map((p) => (
              <article key={p.name} className="flex flex-col border border-ink/10 bg-white p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">{p.level}</p>
                <h3 className="mt-3 font-display text-3xl">{p.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{p.text}</p>
                <p className="mt-6 border-t border-ink/10 pt-4 text-sm font-semibold">
                  {p.price || <span className="text-ink/45">Price to be announced (TZS)</span>}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-6 border border-gold-deep/30 bg-white p-8 sm:grid-cols-[auto_1fr] sm:items-center">
            <p className="font-display text-4xl text-gold-deep lining-nums">{site.academyRegistrationFee}</p>
            <div>
              <p className="font-semibold">Academy application fee</p>
              <p className="text-sm text-ink/70">
                It can be {site.academyFeeTerms}. Pay only to Blackhood Africa's official accounts and keep your receipt.
                Scouting and agency applications are always free.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">What you'll learn</p>
          <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">Skills brands actually book for.</h2>
          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {curriculum.map((c) => (
              <div key={c.title} className="bg-ink p-8">
                <Check className="text-gold" size={22} />
                <h3 className="mt-4 font-display text-2xl">{c.title}</h3>
                <p className="mt-2 text-sm text-ivory/65">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches: add real names, photos and credits when confirmed */}
      <section className="border-t border-white/10 bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-24">
          <h2 className="font-display text-4xl font-medium sm:text-5xl">Your coaches</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="grid aspect-square place-items-center border border-dashed border-white/15">
                  <Plus className="text-stone/40" size={26} strokeWidth={1.2} />
                </div>
                <p className="mt-3 text-sm text-stone">Coach profile coming</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">For parents & students</p>
            <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">Questions, answered.</h2>
            <a
              href={whatsappLink('Hello Blackhood Africa, I have a question about the academy.')}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory"
            >
              Ask us on WhatsApp →
            </a>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl">
                  {f.q}
                  <Plus size={20} className="shrink-0 text-gold transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gold text-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center lg:px-10">
          <p className="font-display text-3xl sm:text-4xl">Ready to start?</p>
          <Link
            to="/apply"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-ink-soft"
          >
            Apply now
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}
