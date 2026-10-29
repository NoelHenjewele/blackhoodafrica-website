import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

type NewFace = {
  name: string
  intake: string
  photo?: string
}

// Fresh signings and recent academy graduates. Add real entries here as they're confirmed.
const newFaces: NewFace[] = []

const SLOTS = 5

export default function NewFaces() {
  const placeholders = Math.max(0, SLOTS - newFaces.length)

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink-soft">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              <Sparkles size={14} /> New faces
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-6xl">
              Fresh from the academy.
            </h2>
          </div>
          <p className="max-w-lg text-ivory/70 lg:justify-self-end">
            Our newest signings and recent graduates: trained, tested and ready for their first bookings. Brands get
            first look at the faces everyone will know next.
          </p>
        </div>

        <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {newFaces.map((f) => (
            <article key={f.name} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto">
              <div className="aspect-[3/4] overflow-hidden bg-ink">
                {f.photo && <img src={f.photo} alt={f.name} loading="lazy" className="h-full w-full object-cover" />}
              </div>
              <h3 className="mt-4 font-display text-2xl">{f.name}</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-gold">{f.intake}</p>
            </article>
          ))}

          {Array.from({ length: placeholders }).map((_, i) => (
            <div key={i} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto">
              <div
                className={`grid aspect-[3/4] place-items-center border border-dashed border-white/15 bg-ink/60 text-center ${
                  i % 2 ? 'lg:translate-y-8' : ''
                }`}
              >
                <div>
                  <p className="font-display text-3xl italic text-gold/70">New face</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-stone/70">Photo coming</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center">
          <p className="font-display text-2xl sm:text-3xl">
            Think you could be next? <span className="italic text-gold">Applying is free.</span>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/apply"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory"
            >
              Apply to join
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/talent?board=new-faces"
              className="inline-flex items-center justify-center rounded-full border border-ivory/30 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] hover:border-gold hover:text-gold"
            >
              See all new faces
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
