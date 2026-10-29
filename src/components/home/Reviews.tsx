import { Quote } from 'lucide-react'
import { reviews } from '../../data/reviews'

export default function Reviews() {
  if (reviews.length === 0) return null

  return (
    <section className="border-t border-white/10 bg-ink-soft">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">In their words</p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-tight sm:text-5xl">
          What models, parents and brands say.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name + r.quote.slice(0, 12)} className="flex flex-col border border-white/10 bg-ink p-8">
              <Quote className="text-gold" size={28} strokeWidth={1.4} />
              <blockquote className="mt-5 flex-1 font-display text-xl leading-snug">“{r.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                {r.photo && <img src={r.photo} alt="" className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-ivory/55">{r.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
