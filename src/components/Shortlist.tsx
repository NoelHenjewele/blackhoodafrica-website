import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'
import { useShortlist, type ShortlistItem } from '../shortlist'
import { useLang } from '../i18n'

// Heart toggle for a model. `large` is the labelled button on the model page.
export function ShortlistButton({ item, large = false }: { item: ShortlistItem; large?: boolean }) {
  const { t } = useLang()
  const { has, toggle } = useShortlist()
  const on = has(item.slug)
  const label = on
    ? t({ en: 'On your shortlist', sw: 'Kwenye orodha yako' })
    : t({ en: 'Add to shortlist', sw: 'Ongeza kwenye orodha' })

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(item)
  }

  if (large) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={on}
        className={`inline-flex items-center gap-2 rounded-full border px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
          on ? 'border-gold text-gold' : 'border-white/25 text-ivory hover:border-gold hover:text-gold'
        }`}
      >
        <Heart size={18} fill={on ? 'currentColor' : 'none'} /> {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full backdrop-blur transition-colors ${
        on ? 'bg-gold text-ink' : 'bg-ink/60 text-ivory hover:text-gold'
      }`}
    >
      <Heart size={18} fill={on ? 'currentColor' : 'none'} />
    </button>
  )
}

// Floating bar shown once a visitor has hearted someone.
export function ShortlistBar() {
  const { t } = useLang()
  const { list } = useShortlist()
  const { pathname } = useLocation()
  if (list.length === 0 || pathname === '/clients') return null

  return (
    <Link
      to="/clients?shortlist=1#brief"
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink shadow-lg hover:bg-ivory"
    >
      <Heart size={16} fill="currentColor" />
      {t({ en: `Request ${list.length} ${list.length === 1 ? 'model' : 'models'}`, sw: `Omba wanamitindo ${list.length}` })}
      <ArrowRight size={16} />
    </Link>
  )
}
