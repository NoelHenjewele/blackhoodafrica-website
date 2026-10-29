import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Plus, User } from 'lucide-react'

const boards = ['Women', 'Men', 'New Faces', 'Curve', 'Creators'] as const
type Board = (typeof boards)[number]

type Talent = {
  name: string
  boards: Board[]
  height?: string
  note?: string
  photo?: string
}

// Real roster goes here. Only confirmed talent is named; the rest are placeholders.
const featured: Talent[] = [
  {
    name: 'Eladia Edwin',
    boards: ['Women'],
    note: 'Miss Kinondoni 2027–2028',
    photo: '/talent/eladia-edwin/runway-stage.jpg',
  },
]

const PLACEHOLDER_SLOTS = 7

export default function TalentPreview() {
  const [active, setActive] = useState<Board>('Women')
  const named = featured.filter((t) => t.boards.includes(active))
  const placeholders = Math.max(0, PLACEHOLDER_SLOTS + 1 - named.length)

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Our talent</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Faces trained in-house, ready to book.
            </h2>
          </div>
          <Link
            to="/talent"
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory"
          >
            View all boards
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Talent boards">
          {boards.map((b) => (
            <button
              key={b}
              role="tab"
              aria-selected={active === b}
              onClick={() => setActive(b)}
              className={`shrink-0 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                active === b
                  ? 'border-gold bg-gold text-ink'
                  : 'border-white/20 text-ivory/70 hover:border-gold hover:text-gold'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {named.map((t) => (
            <article key={t.name} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-[30%_top] transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center border border-white/10 text-center">
                    <div>
                      <User className="mx-auto text-stone/50" size={36} strokeWidth={1.2} />
                      <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-stone">Photo coming</p>
                    </div>
                  </div>
                )}
                <span className="absolute left-3 top-3 bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ink">
                  Featured
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl">{t.name}</h3>
              {t.note && <p className="text-sm text-gold">{t.note}</p>}
              {t.height && <p className="text-sm text-ivory/60">{t.height}</p>}
            </article>
          ))}

          {Array.from({ length: placeholders }).map((_, i) => (
            <div key={i}>
              <div className="grid aspect-[3/4] place-items-center border border-dashed border-white/15 text-center">
                <div>
                  <Plus className="mx-auto text-stone/40" size={28} strokeWidth={1.2} />
                  <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-stone/70">{active} talent</p>
                </div>
              </div>
              <div className="mt-4 h-4 w-2/3 bg-white/5" />
              <div className="mt-2 h-3 w-1/3 bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
