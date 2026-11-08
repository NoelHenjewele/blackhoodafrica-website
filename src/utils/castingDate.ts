// Reads the day out of a casting's date text ("Saturday 14 Nov 2026, from 9:00am", "14 November 2026", "2026-11-14")
// and works out where it is relative to today, so the castings list updates itself.
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export function castingDay(text: string | null | undefined): Date | null {
  if (!text) return null
  const iso = text.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  const m = text.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,})\.?,?\s+(\d{4})/)
  if (!m) return null
  const month = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase())
  return month < 0 ? null : new Date(Number(m[3]), month, Number(m[1]))
}

export type CastingStatus = { kind: 'upcoming' | 'tomorrow' | 'today' | 'ended' | 'undated'; days: number }

export function castingStatus(text: string | null | undefined, now = new Date()): CastingStatus {
  const day = castingDay(text)
  if (!day) return { kind: 'undated', days: 0 }
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.round((day.getTime() - today.getTime()) / 86_400_000)
  return { kind: days < 0 ? 'ended' : days === 0 ? 'today' : days === 1 ? 'tomorrow' : 'upcoming', days }
}

// Upcoming first (soonest at the top), then undated, then ended (most recent first); ended over 30 days ago are dropped.
export function sortCastings<T extends { date_text: string | null }>(list: T[]) {
  const rank = (s: CastingStatus) => (s.kind === 'ended' ? 2 : s.kind === 'undated' ? 1 : 0)
  return list
    .map((c) => ({ c, s: castingStatus(c.date_text) }))
    .filter(({ s }) => !(s.kind === 'ended' && s.days < -30))
    .sort((a, b) => rank(a.s) - rank(b.s) || (a.s.kind === 'ended' ? b.s.days - a.s.days : a.s.days - b.s.days))
    .map(({ c }) => c)
}
