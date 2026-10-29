import { Plus, User } from 'lucide-react'
import { formatHeight, type Talent } from '../data/talent'
import { useLang } from '../i18n'

export function TalentCard({ person }: { person: Talent }) {
  const { t } = useLang()

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            loading="lazy"
            className="h-full w-full object-cover object-[30%_top] transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center border border-white/10 text-center">
            <div>
              <User className="mx-auto text-stone/50" size={36} strokeWidth={1.2} />
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-stone">
                {t({ en: 'Photo coming', sw: 'Picha inakuja' })}
              </p>
            </div>
          </div>
        )}
        {person.featured && (
          <span className="absolute left-3 top-3 bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ink">
            {t({ en: 'Featured', sw: 'Maalum' })}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-2xl">{person.name}</h3>
      {person.note && <p className="text-sm text-gold">{person.note}</p>}
      <p className="text-sm text-ivory/60">{[person.city, formatHeight(person.heightCm)].filter(Boolean).join(' · ')}</p>
    </article>
  )
}

export function TalentPlaceholder({ label }: { label: string }) {
  return (
    <div>
      <div className="grid aspect-[3/4] place-items-center border border-dashed border-white/15 text-center">
        <div>
          <Plus className="mx-auto text-stone/40" size={28} strokeWidth={1.2} />
          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-stone/70">{label}</p>
        </div>
      </div>
      <div className="mt-4 h-4 w-2/3 bg-white/5" />
      <div className="mt-2 h-3 w-1/3 bg-white/5" />
    </div>
  )
}
