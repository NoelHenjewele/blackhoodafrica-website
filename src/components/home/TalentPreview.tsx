import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { boardLabels, boards, talent, type Board } from '../../data/talent'
import { TalentCard, TalentPlaceholder } from '../TalentCard'
import { useLang } from '../../i18n'

const SLOTS = 8

export default function TalentPreview() {
  const { t } = useLang()
  const [active, setActive] = useState<Board>('Women')
  const named = talent.filter((p) => p.boards.includes(active)).slice(0, SLOTS)
  const placeholders = Math.max(0, SLOTS - named.length)

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Our talent', sw: 'Vipaji vyetu' })}</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              {t({ en: 'Faces trained in-house, ready to book.', sw: 'Sura zilizofunzwa nasi, tayari kuajiriwa.' })}
            </h2>
          </div>
          <Link
            to="/talent"
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory"
          >
            {t({ en: 'View all boards', sw: 'Tazama orodha zote' })}
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
              {t(boardLabels[b])}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {named.map((p) => (
            <TalentCard key={p.slug} person={p} />
          ))}
          {Array.from({ length: placeholders }).map((_, i) => (
            <TalentPlaceholder key={i} label={t(boardLabels[active])} />
          ))}
        </div>
      </div>
    </section>
  )
}
