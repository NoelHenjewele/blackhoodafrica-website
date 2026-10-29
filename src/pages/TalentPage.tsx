import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { boardLabels, boards, talent, type Board } from '../data/talent'
import { TalentCard, TalentPlaceholder } from '../components/TalentCard'
import { useLang } from '../i18n'

const ALL = 'All'
const toSlug = (b: string) => b.toLowerCase().replace(/\s+/g, '-')
const heightRanges = [
  { label: { en: 'Any height', sw: 'Urefu wowote' }, min: 0, max: 999 },
  { label: { en: 'Under 165 cm', sw: 'Chini ya sm 165' }, min: 0, max: 164 },
  { label: { en: '165–175 cm', sw: 'sm 165–175' }, min: 165, max: 175 },
  { label: { en: '176–185 cm', sw: 'sm 176–185' }, min: 176, max: 185 },
  { label: { en: 'Over 185 cm', sw: 'Zaidi ya sm 185' }, min: 186, max: 999 },
]

const select =
  'border border-white/15 bg-ink px-4 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none'

export default function TalentPage() {
  const { t } = useLang()
  const [params, setParams] = useSearchParams()
  const active = boards.find((b) => toSlug(b) === params.get('board')) ?? ALL
  const [city, setCity] = useState(ALL)
  const [height, setHeight] = useState(0)

  const cities = useMemo(() => [ALL, ...Array.from(new Set(talent.map((p) => p.city)))], [])

  const results = talent.filter((p) => {
    const range = heightRanges[height]
    return (
      (active === ALL || p.boards.includes(active as Board)) &&
      (city === ALL || p.city === city) &&
      (height === 0 || (p.heightCm !== undefined && p.heightCm >= range.min && p.heightCm <= range.max))
    )
  })
  const placeholders = Math.max(0, 8 - results.length)
  const allLabel = t({ en: 'All', sw: 'Wote' })
  const boardName = (b: string) => (b === ALL ? allLabel : t(boardLabels[b as Board]))

  function pick(b: string) {
    setParams(b === ALL ? {} : { board: toSlug(b) })
  }

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Talent boards', sw: 'Orodha ya vipaji' })}</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Find the right face.', sw: 'Pata sura sahihi.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: "Every Blackhood model is trained in our academy. Browse the boards, then send us a brief and we'll confirm availability within 24 hours.",
              sw: 'Kila mwanamitindo wa Blackhood amefunzwa katika chuo chetu. Pitia orodha, kisha tutumie maelezo na tutathibitisha upatikanaji ndani ya saa 24.',
            })}
          </p>
        </div>
      </section>

      <section className="sticky top-20 z-30 border-y border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Boards">
            {[ALL, ...boards].map((b) => (
              <button
                key={b}
                role="tab"
                aria-selected={active === b}
                onClick={() => pick(b)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                  active === b
                    ? 'border-gold bg-gold text-ink'
                    : 'border-white/20 text-ivory/70 hover:border-gold hover:text-gold'
                }`}
              >
                {boardName(b)}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <select aria-label="City" value={city} onChange={(e) => setCity(e.target.value)} className={select}>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === ALL ? t({ en: 'Any city', sw: 'Mji wowote' }) : c}
                </option>
              ))}
            </select>
            <select aria-label="Height" value={height} onChange={(e) => setHeight(Number(e.target.value))} className={select}>
              {heightRanges.map((r, i) => (
                <option key={r.label.en} value={i}>
                  {t(r.label)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
          <p className="text-sm text-ivory/50">
            {t({
              en: `${results.length} ${results.length === 1 ? 'model' : 'models'} shown · more faces being added`,
              sw: `Wanamitindo ${results.length} wanaonyeshwa · sura zaidi zinaongezwa`,
            })}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {results.map((p) => (
              <TalentCard key={p.slug} person={p} />
            ))}
            {Array.from({ length: placeholders }).map((_, i) => (
              <TalentPlaceholder key={i} label={active === ALL ? t({ en: 'Talent', sw: 'Kipaji' }) : boardName(active)} />
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border border-white/10 bg-ink-soft p-8 sm:flex-row sm:items-center lg:p-10">
            <p className="font-display text-2xl sm:text-3xl">{t({ en: 'Seen someone you like?', sw: 'Umeona unayempenda?' })}</p>
            <Link
              to="/clients#brief"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory"
            >
              {t({ en: 'Send a brief', sw: 'Tuma maelezo' })}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
