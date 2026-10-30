import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../config/supabase'
import { photoUrl } from '../components/ProfileEditor'

async function toDataUrl(url: string) {
  const blob = await (await fetch(url)).blob()
  return new Promise<string>((resolve) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.readAsDataURL(blob)
  })
}
import { BadgeCheck, Camera, Download, Loader2, X } from 'lucide-react'
import { useLang, type L } from '../i18n'
import { shrinkPhoto } from '../utils/photo'

const statFields: { key: string; label: L; placeholder: string }[] = [
  { key: 'height', label: { en: 'Height', sw: 'Urefu' }, placeholder: "175 cm / 5'9\"" },
  { key: 'bust', label: { en: 'Bust / chest', sw: 'Kifua' }, placeholder: '86 cm' },
  { key: 'waist', label: { en: 'Waist', sw: 'Kiuno' }, placeholder: '62 cm' },
  { key: 'hips', label: { en: 'Hips', sw: 'Nyonga' }, placeholder: '90 cm' },
  { key: 'shoes', label: { en: 'Shoes', sw: 'Viatu' }, placeholder: 'EU 39' },
  { key: 'hair', label: { en: 'Hair', sw: 'Nywele' }, placeholder: 'Black' },
  { key: 'eyes', label: { en: 'Eyes', sw: 'Macho' }, placeholder: 'Brown' },
  { key: 'city', label: { en: 'Based in', sw: 'Mahali' }, placeholder: 'Dar es Salaam' },
]
// Labels printed on the card stay in English, the industry standard for comp cards.
const printLabels: Record<string, string> = {
  height: 'Height', bust: 'Bust', waist: 'Waist', hips: 'Hips', shoes: 'Shoes', hair: 'Hair', eyes: 'Eyes', city: 'Based in',
}

const field =
  'w-full border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none'
const label = 'mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-ivory/70'

export default function CompCardPage() {
  const { t } = useLang()
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState<{ code: string; name: string } | null>(null)
  const [checking, setChecking] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [name, setName] = useState('')
  const [stats, setStats] = useState<Record<string, string>>({})
  const [main, setMain] = useState<string>('')
  const [extras, setExtras] = useState<string[]>([])
  const [building, setBuilding] = useState(false)
  const [error, setError] = useState('')

  // Logged-in talent: fill the card from their saved profile and photos.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: s } = await supabase.auth.getSession()
      const uid = s.session?.user.id
      if (!uid) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
      if (!p || cancelled) return
      setVerified({ code: p.talent_code, name: p.full_name })
      setName(p.full_name)
      setStats({
        height: p.height_cm ? `${p.height_cm} cm` : '',
        bust: p.bust ?? '', waist: p.waist ?? '', hips: p.hips ?? '', shoes: p.shoes ?? '',
        hair: p.hair ?? '', eyes: p.eyes ?? '', city: p.city ?? '',
      })
      const { data: ph } = await supabase.from('photos').select('path').eq('profile_id', uid).order('position').limit(5)
      const urls = await Promise.all((ph ?? []).map((x) => toDataUrl(photoUrl(x.path))))
      if (cancelled || !urls.length) return
      setMain(urls[0])
      setExtras(urls.slice(1))
    })().catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  async function checkCode(e: FormEvent) {
    e.preventDefault()
    setChecking(true)
    setCodeError('')
    try {
      const res = await fetch(`/api/verify-code?code=${encodeURIComponent(code.trim())}`)
      const r = (await res.json()) as { ok: boolean; valid?: boolean; name?: string }
      if (r.ok && r.valid && r.name) {
        setVerified({ code: code.trim().toUpperCase(), name: r.name })
        setName(r.name)
      } else {
        setCodeError(t({ en: 'That code was not found. Check it, or continue without one.', sw: 'Namba hiyo haikupatikana. Ihakiki, au endelea bila namba.' }))
      }
    } catch {
      setCodeError(t({ en: "Couldn't check the code right now. Try again in a moment.", sw: 'Hatukuweza kuhakiki sasa. Jaribu tena baadaye.' }))
    } finally {
      setChecking(false)
    }
  }

  async function addPhotos(files: FileList | null, isMain: boolean) {
    if (!files?.length) return
    const read = await Promise.all(Array.from(files).map((f) => shrinkPhoto(f, 1800, 0.9).then((p) => p.preview)))
    if (isMain) setMain(read[0])
    else setExtras((x) => [...x, ...read].slice(0, 4))
  }

  async function build() {
    setError('')
    if (!name.trim() || !main) {
      setError(t({ en: 'Add your name and a main photo first.', sw: 'Weka jina lako na picha kuu kwanza.' }))
      return
    }
    setBuilding(true)
    try {
      const { buildCompCard, compCardFileName } = await import('../utils/compcard')
      const doc = await buildCompCard({
        name: name.trim(),
        code: verified?.code,
        stats: statFields.map((s) => ({ label: printLabels[s.key], value: stats[s.key] ?? '' })),
        main,
        extras,
      })
      doc.save(compCardFileName(name))
    } catch {
      setError(t({ en: 'Something went wrong making the PDF. Try different photos.', sw: 'Kuna tatizo kutengeneza PDF. Jaribu picha nyingine.' }))
    } finally {
      setBuilding(false)
    }
  }

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Comp card maker', sw: 'Kitengeneza comp card' })}</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl">
            {t({ en: 'Make your comp card in minutes.', sw: 'Tengeneza comp card yako kwa dakika chache.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'A comp card is the 2-page model CV that castings and brands ask for. Add your photos and measurements and download a print-ready PDF. Your photos stay on your phone: nothing is uploaded.',
              sw: 'Comp card ni wasifu wa kurasa 2 wa mwanamitindo ambao usaili na makampuni huuomba. Weka picha na vipimo vyako kisha pakua PDF iliyo tayari kuchapishwa. Picha zako zinabaki kwenye simu yako: hakuna kinachopakiwa.',
            })}
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl space-y-12 px-5 py-14 lg:py-20">
          {/* 1. Code */}
          <div>
            <h2 className="font-display text-3xl"><span className="text-gold lining-nums">01</span> {t({ en: 'Your talent code', sw: 'Namba yako ya kipaji' })}</h2>
            <p className="mt-2 text-sm text-ivory/60">
              {t({
                en: 'Approved Blackhood talent get a code by email (BHA-T-0001). With it, your card carries the agency logo, contacts and your code. Without one, the card is marked "Applicant".',
                sw: 'Vipaji vilivyokubaliwa na Blackhood hupata namba kwa barua pepe (BHA-T-0001). Ukiwa nayo, kadi yako itakuwa na nembo ya wakala, mawasiliano na namba yako. Bila namba, kadi itaandikwa "Applicant".',
              })}
            </p>
            {verified ? (
              <p className="mt-5 flex items-center gap-2 text-green-300">
                <BadgeCheck size={20} /> {t({ en: 'Verified:', sw: 'Imethibitishwa:' })} {verified.name} · {verified.code}
              </p>
            ) : (
              <form onSubmit={checkCode} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="BHA-T-0001"
                  aria-label={t({ en: 'Talent code', sw: 'Namba ya kipaji' })}
                  className={`${field} font-mono uppercase tracking-wider sm:max-w-xs`}
                />
                <button
                  type="submit"
                  disabled={checking}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-ink disabled:opacity-50"
                >
                  {checking && <Loader2 size={14} className="animate-spin" />}
                  {t({ en: 'Check code', sw: 'Hakiki namba' })}
                </button>
              </form>
            )}
            {codeError && <p className="mt-3 text-sm text-red-300">{codeError}</p>}
          </div>

          {/* 2. Details */}
          <div>
            <h2 className="font-display text-3xl"><span className="text-gold lining-nums">02</span> {t({ en: 'Your details', sw: 'Taarifa zako' })}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="cc-name">{t({ en: 'Name on the card *', sw: 'Jina kwenye kadi *' })}</label>
                <input id="cc-name" value={name} onChange={(e) => setName(e.target.value)} disabled={!!verified} className={`${field} disabled:opacity-70`} />
              </div>
              {statFields.map((s) => (
                <div key={s.key}>
                  <label className={label} htmlFor={`cc-${s.key}`}>{t(s.label)}</label>
                  <input
                    id={`cc-${s.key}`}
                    placeholder={s.placeholder}
                    value={stats[s.key] ?? ''}
                    onChange={(e) => setStats((st) => ({ ...st, [s.key]: e.target.value }))}
                    className={field}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Photos */}
          <div>
            <h2 className="font-display text-3xl"><span className="text-gold lining-nums">03</span> {t({ en: 'Your photos', sw: 'Picha zako' })}</h2>
            <p className="mt-2 text-sm text-ivory/60">
              {t({
                en: 'One strong main photo for the front, and up to 4 more for the back: headshot, full length, a smile, a different look.',
                sw: 'Picha moja kuu yenye nguvu kwa mbele, na hadi picha 4 zaidi kwa nyuma: uso, mwili mzima, tabasamu, mwonekano tofauti.',
              })}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <label className="relative col-span-2 row-span-2 grid aspect-[3/4] cursor-pointer place-items-center overflow-hidden border border-dashed border-white/25 bg-ink-soft text-center hover:border-gold sm:col-span-2">
                {main ? (
                  <img src={main} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="px-4 text-sm">
                    <Camera className="mx-auto mb-2 text-gold" size={26} />
                    {t({ en: 'Main photo *', sw: 'Picha kuu *' })}
                  </span>
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => addPhotos(e.target.files, true)} />
              </label>
              {extras.map((src, i) => (
                <div key={i} className="relative aspect-[3/4] overflow-hidden">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setExtras((x) => x.filter((_, j) => j !== i))}
                    aria-label={t({ en: 'Remove photo', sw: 'Ondoa picha' })}
                    className="absolute right-1 top-1 rounded-full bg-ink/80 p-1 text-ivory hover:text-gold"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {extras.length < 4 && (
                <label className="grid aspect-[3/4] cursor-pointer place-items-center border border-dashed border-white/25 bg-ink-soft text-center text-xs hover:border-gold">
                  <span>
                    <Camera className="mx-auto mb-1 text-gold" size={20} />
                    {t({ en: 'Add photos', sw: 'Ongeza picha' })} ({extras.length}/4)
                  </span>
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files, false)} />
                </label>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
            <button
              type="button"
              onClick={build}
              disabled={building}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory disabled:opacity-50 sm:w-auto"
            >
              {building ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {t({ en: 'Download comp card (PDF)', sw: 'Pakua comp card (PDF)' })}
            </button>
            {!verified && (
              <p className="mt-3 text-xs text-ivory/50">
                {t({ en: 'Without a talent code, your card will be marked "Applicant".', sw: 'Bila namba ya kipaji, kadi yako itaandikwa "Applicant".' })}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
