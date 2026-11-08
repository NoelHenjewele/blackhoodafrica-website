import { Link } from 'react-router-dom'
import { Plus, User } from 'lucide-react'
import { formatHeight, type Talent } from '../data/talent'
import { useLang } from '../i18n'
import { ShortlistButton } from './Shortlist'

export function TalentCard({ person }: { person: Talent }) {
  const { t } = useLang()

  return (
    <Link to={`/talent/${person.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            loading="lazy"
            className="h-full w-full object-cover object-[30%_top] transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center border border-ivory/10 text-center">
            <div>
              <User className="mx-auto text-stone/70" size={36} strokeWidth={1.2} />
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-stone">
                {t({ en: 'Photo coming', sw: 'Picha inakuja' })}
              </p>
            </div>
          </div>
        )}
        <ShortlistButton item={{ slug: person.slug, name: person.name }} />
        {person.featured && (
          <span className="absolute left-3 top-3 bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ink">
            {t({ en: 'Featured', sw: 'Maalum' })}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-2xl">{person.name}</h3>
      {person.note && <p className="text-sm text-gold">{person.note}</p>}
      <p className="text-sm text-ivory/80">{[person.city, formatHeight(person.heightCm)].filter(Boolean).join(' · ')}</p>
    </Link>
  )
}

export function TalentPlaceholder({ label }: { label: string }) {
  return (
    <div>
      <div className="grid aspect-[3/4] place-items-center border border-dashed border-ivory/15 text-center">
        <div>
          <Plus className="mx-auto text-stone/60" size={28} strokeWidth={1.2} />
          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-stone">{label}</p>
        </div>
      </div>
      <div className="mt-4 h-4 w-2/3 bg-ivory/5" />
      <div className="mt-2 h-3 w-1/3 bg-ivory/5" />
    </div>
  )
}

// One invitation card instead of rows of empty boxes while the boards are still filling up.
export function JoinCard() {
  const { t } = useLang()
  return (
    <Link to="/apply" className="group grid aspect-[3/4] place-items-center border border-dashed border-gold/50 bg-ink-soft p-5 text-center hover:border-gold">
      <div>
        <p className="font-display text-2xl italic text-gold">{t({ en: 'New faces joining weekly', sw: 'Sura mpya zinajiunga kila wiki' })}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/85 group-hover:text-gold">
          {t({ en: 'Apply to join →', sw: 'Omba kujiunga →' })}
        </p>
      </div>
    </Link>
  )
}