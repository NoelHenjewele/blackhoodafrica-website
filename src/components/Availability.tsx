import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../config/supabase'
import { useLang } from '../i18n'

// Model's own calendar: tap a day to mark it busy (not available). Saves straight away.
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default function Availability({ profileId }: { profileId: string }) {
  const { t, lang } = useLang()
  const [busy, setBusy] = useState<Set<string>>(new Set())
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('busy_days')
      .select('day')
      .eq('profile_id', profileId)
      .then(({ data }) => setBusy(new Set((data ?? []).map((r) => r.day as string))))
  }, [profileId])

  const today = iso(new Date())
  const first = new Date()
  first.setDate(1)
  first.setMonth(first.getMonth() + offset)
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const lead = (first.getDay() + 6) % 7 // weeks start on Monday
  const days = Array.from({ length: daysInMonth }, (_, i) => iso(new Date(first.getFullYear(), first.getMonth(), i + 1)))
  const locale = lang === 'sw' ? 'sw-TZ' : 'en-GB'
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'narrow' }))

  async function toggle(day: string) {
    setError('')
    const on = !busy.has(day)
    setBusy((s) => {
      const next = new Set(s)
      if (on) next.add(day)
      else next.delete(day)
      return next
    })
    const { error } = on
      ? await supabase.from('busy_days').insert({ profile_id: profileId, day })
      : await supabase.from('busy_days').delete().eq('profile_id', profileId).eq('day', day)
    if (error) setError(t({ en: 'That didn’t save. Please try again.', sw: 'Haikuhifadhiwa. Tafadhali jaribu tena.' }))
  }

  return (
    <div className="mt-12 border-t border-white/10 pt-10">
      <h2 className="font-display text-3xl">{t({ en: 'Your availability', sw: 'Upatikanaji wako' })}</h2>
      <p className="mt-2 text-sm text-ivory/60">
        {t({
          en: 'Tap the days you are busy (school, travel, other jobs). The Blackhood team sees this before offering you to a brand. Changes save straight away.',
          sw: 'Gusa siku ambazo uko na shughuli (shule, safari, kazi nyingine). Timu ya Blackhood huona hii kabla ya kukupendekeza kwa kampuni. Mabadiliko yanahifadhiwa papo hapo.',
        })}
      </p>

      <div className="mt-6 max-w-sm">
        <div className="flex items-center justify-between">
          <button type="button" disabled={offset === 0} onClick={() => setOffset((o) => o - 1)} className="p-2 text-ivory/70 hover:text-gold disabled:opacity-30" aria-label="Previous month">
            <ChevronLeft size={20} />
          </button>
          <p className="font-display text-xl capitalize">{first.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</p>
          <button type="button" disabled={offset === 5} onClick={() => setOffset((o) => o + 1)} className="p-2 text-ivory/70 hover:text-gold disabled:opacity-30" aria-label="Next month">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-ivory/50">
          {weekdays.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: lead }).map((_, i) => (
            <span key={`x${i}`} />
          ))}
          {days.map((d) => {
            const past = d < today
            const on = busy.has(d)
            return (
              <button
                key={d}
                type="button"
                disabled={past}
                onClick={() => toggle(d)}
                aria-pressed={on}
                className={`aspect-square text-sm transition-colors ${
                  past ? 'text-ivory/20' : on ? 'bg-red-400/25 text-red-200 line-through' : 'border border-white/10 hover:border-gold'
                } ${d === today ? 'ring-1 ring-gold' : ''}`}
              >
                {Number(d.slice(8))}
              </button>
            )
          })}
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs text-ivory/55">
          <span className="inline-block h-3 w-3 bg-red-400/25" /> {t({ en: 'Busy', sw: 'Nina shughuli' })}
          <span className="ml-3 inline-block h-3 w-3 border border-white/20" /> {t({ en: 'Available', sw: 'Nipo' })}
        </p>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      </div>
    </div>
  )
}
