import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2, Share2 } from 'lucide-react'
import { boardLabels, formatHeight, useTalent } from '../data/talent'
import { useLang } from '../i18n'
import NotFound from './NotFound'
import { ShortlistButton } from '../components/Shortlist'

const statLabels = {
  bust: { en: 'Bust', sw: 'Kifua' },
  waist: { en: 'Waist', sw: 'Kiuno' },
  hips: { en: 'Hips', sw: 'Nyonga' },
  shoes: { en: 'Shoes', sw: 'Viatu' },
  hair: { en: 'Hair', sw: 'Nywele' },
  eyes: { en: 'Eyes', sw: 'Macho' },
} as const

export default function ModelPage() {
  const { t } = useLang()
  const { slug } = useParams()
  const [talent, loaded] = useTalent()
  const person = talent.find((p) => p.slug === slug)
  const [index, setIndex] = useState(0)

  if (!person) {
    // The live list may still be loading; give it a moment before showing "not found".
    return loaded ? <NotFound /> : <div className="grid min-h-[60vh] place-items-center pt-20"><Loader2 className="animate-spin text-gold" /></div>
  }

  const photos = person.gallery?.length ? person.gallery : person.photo ? [person.photo] : []
  const current = photos[index] ?? photos[0]
  const stats = Object.entries(person.stats ?? {}).filter(([, v]) => v) as [keyof typeof statLabels, string][]

  return (
    <section className="pt-20">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
        <Link to="/talent" className="inline-flex items-center gap-2 text-sm text-ivory/80 hover:text-gold">
          <ArrowLeft size={16} /> {t({ en: 'All talent', sw: 'Vipaji vyote' })}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft sm:aspect-[4/5]">
              {current && <img src={current} alt={person.name} className="h-full w-full object-cover object-top" />}
              {photos.length > 1 && (
                <>
                  <button type="button" onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)} aria-label={t({ en: 'Previous photo', sw: 'Picha iliyotangulia' })}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/70 p-2 hover:text-gold"><ArrowLeft size={18} /></button>
                  <button type="button" onClick={() => setIndex((i) => (i + 1) % photos.length)} aria-label={t({ en: 'Next photo', sw: 'Picha inayofuata' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/70 p-2 hover:text-gold"><ArrowRight size={18} /></button>
                </>
              )}
            </div>
            {photos.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {photos.map((src, i) => (
                  <button key={src} type="button" onClick={() => setIndex(i)} className={`h-20 w-16 shrink-0 overflow-hidden ${i === index ? 'ring-2 ring-gold' : 'opacity-70'}`}>
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {person.boards.map((b) => t(boardLabels[b])).join(' · ') || t({ en: 'Blackhood talent', sw: 'Kipaji cha Blackhood' })}
            </p>
            <h1 className="mt-3 font-display text-5xl font-medium sm:text-6xl">{person.name}</h1>
            {person.note && <p className="mt-2 font-display text-2xl italic text-gold">{person.note}</p>}
            {!person.minor && (
              <p className="mt-3 text-ivory/85">{[person.city, formatHeight(person.heightCm)].filter(Boolean).join(' · ')}</p>
            )}

            {stats.length > 0 && !person.minor && (
              <dl className="mt-8 grid grid-cols-3 gap-px border border-white/10 bg-white/10">
                {stats.map(([k, v]) => (
                  <div key={k} className="bg-ink p-4">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">{t(statLabels[k])}</dt>
                    <dd className="mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {person.bio && !person.minor && <p className="mt-8 text-ivory/90">{person.bio}</p>}

            {!person.minor && (person.instagram || person.tiktok) && (
              <p className="mt-6 flex gap-4 text-sm">
                {person.instagram && (
                  <a href={`https://instagram.com/${person.instagram.replace(/^@/, '')}`} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                    Instagram {person.instagram.startsWith('@') ? person.instagram : `@${person.instagram}`}
                  </a>
                )}
                {person.tiktok && (
                  <a href={`https://tiktok.com/@${person.tiktok.replace(/^@/, '')}`} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                    TikTok {person.tiktok.startsWith('@') ? person.tiktok : `@${person.tiktok}`}
                  </a>
                )}
              </p>
            )}

            <div className="mt-10 border-t border-white/10 pt-8">
              <div className="flex flex-wrap gap-3">
              <Link
                to={`/clients?model=${encodeURIComponent(person.name)}#brief`}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory"
              >
                {t({ en: `Book ${person.name.split(' ')[0]}`, sw: `Mwajiri ${person.name.split(' ')[0]}` })} <ArrowRight size={18} />
              </Link>
              <ShortlistButton large item={{ slug: person.slug, name: person.name }} />
              <button
                type="button"
                onClick={() => {
                  const url = window.location.href
                  const text = `${person.name} · Blackhood Africa`
                  // Phones open their own share sheet; computers fall back to WhatsApp.
                  if (navigator.share) navigator.share({ title: text, url }).catch(() => {})
                  else window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener')
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:border-gold hover:text-gold"
              >
                <Share2 size={18} /> {t({ en: 'Share', sw: 'Shiriki' })}
              </button>
              </div>
              <p className="mt-3 text-xs text-ivory/75">
                {t({ en: 'All bookings go through Blackhood Africa.', sw: 'Kazi zote zinapitia Blackhood Africa.' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
