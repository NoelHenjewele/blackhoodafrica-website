import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Camera, CheckCircle2, Loader2, Send, ShieldCheck, X } from 'lucide-react'
import { site, whatsappLink } from '../config/site'
import { useLang, type L } from '../i18n'
import { shrinkPhoto } from '../utils/photo'

// Option values stay in English so the spreadsheet stays in one language.
const ACADEMY = 'Academy training'
const interests = [
  { value: 'Modeling (agency)', label: { en: 'Modeling (agency)', sw: 'Uanamitindo (wakala)' } },
  { value: ACADEMY, label: { en: 'Academy training', sw: 'Mafunzo ya chuo' } },
  { value: 'Creator / UGC work', label: { en: 'Creator / UGC work', sw: 'Kutengeneza maudhui' } },
  { value: 'Hosting & events', label: { en: 'Hosting & events', sw: 'Ushereheshaji na matukio' } },
  { value: 'Not sure yet', label: { en: 'Not sure yet', sw: 'Bado sijaamua' } },
]
const genders = [
  { value: 'Female', label: { en: 'Female', sw: 'Mwanamke' } },
  { value: 'Male', label: { en: 'Male', sw: 'Mwanaume' } },
  { value: 'Prefer not to say', label: { en: 'Prefer not to say', sw: 'Sipendi kusema' } },
]

type PhotoKey = 'headshot' | 'full' | 'side'
const photoSlots: { key: PhotoKey; required: boolean; title: L; text: L }[] = [
  {
    key: 'headshot',
    required: true,
    title: { en: 'Headshot', sw: 'Picha ya uso' },
    text: { en: 'Face to camera, hair back, no filter.', sw: 'Uso kuelekea kamera, nywele nyuma, bila filter.' },
  },
  {
    key: 'full',
    required: true,
    title: { en: 'Full length', sw: 'Mwili mzima' },
    text: { en: 'Head to toe, fitted clothes, plain wall.', sw: 'Kichwa hadi miguu, nguo zinazobana kiasi, ukuta mtupu.' },
  },
  {
    key: 'side',
    required: false,
    title: { en: 'Side profile', sw: 'Ubavuni' },
    text: { en: 'Standing side-on, natural light.', sw: 'Umesimama kwa ubavu, mwanga wa asili.' },
  },
]

type Photo = { base64: string; preview: string }

const field =
  'w-full border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none'
const label = 'mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-ivory/70'

export default function Apply() {
  const { t, lang } = useLang()
  const [age, setAge] = useState('')
  const [consent, setConsent] = useState(false)
  const [interest, setInterest] = useState('')
  const [photos, setPhotos] = useState<Partial<Record<PhotoKey, Photo>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ ref: string; name: string } | null>(null)
  const isMinor = age !== '' && Number(age) < 18

  async function pickPhoto(key: PhotoKey, file: File | undefined) {
    if (!file) return
    try {
      const shrunk = await shrinkPhoto(file)
      setPhotos((p) => ({ ...p, [key]: shrunk }))
    } catch {
      setError(t({ en: 'That photo could not be read. Try a JPG or PNG.', sw: 'Picha hiyo haikusomeka. Jaribu JPG au PNG.' }))
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (!photos.headshot || !photos.full) {
      setError(t({ en: 'Please add your headshot and full-length photo.', sw: 'Tafadhali weka picha ya uso na ya mwili mzima.' }))
      return
    }

    const d = new FormData(e.currentTarget)
    const get = (k: string) => String(d.get(k) ?? '').trim()
    const payload = {
      name: get('name'),
      age: Number(get('age')),
      gender: get('gender'),
      height: Number(get('height')),
      city: get('city'),
      phone: get('phone'),
      email: get('email'),
      social: get('social'),
      interest: get('interest'),
      experience: get('experience'),
      guardianName: isMinor ? get('guardianName') : '',
      guardianPhone: isMinor ? get('guardianPhone') : '',
      lang,
      website: get('website'),
      photos: {
        headshot: photos.headshot.base64,
        full: photos.full.base64,
        side: photos.side?.base64,
      },
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = (await res.json()) as { ok: boolean; ref?: string }
      if (!result.ok) throw new Error('failed')
      setDone({ ref: result.ref ?? '', name: payload.name })
      window.scrollTo(0, 0)
    } catch {
      setStatus('error')
      setError(
        t({
          en: 'Something went wrong sending your application. Please try again, or message us on WhatsApp.',
          sw: 'Kuna tatizo katika kutuma ombi lako. Tafadhali jaribu tena, au tuandikie WhatsApp.',
        }),
      )
      return
    }
    setStatus('idle')
  }

  if (done) {
    return (
      <section className="grid min-h-[80vh] place-items-center px-5 pt-20">
        <div className="max-w-xl text-center">
          <CheckCircle2 className="mx-auto text-gold" size={56} strokeWidth={1.4} />
          <h1 className="mt-6 font-display text-5xl font-medium">
            {t({ en: 'Application received.', sw: 'Ombi limepokelewa.' })}
          </h1>
          <p className="mt-5 text-lg text-ivory/70">
            {t({
              en: `Thank you, ${done.name.split(' ')[0]}. We've emailed you a confirmation. Our scouting team reviews every application and will contact you on WhatsApp.`,
              sw: `Asante, ${done.name.split(' ')[0]}. Tumekutumia barua pepe ya uthibitisho. Timu yetu ya usaili hupitia kila ombi na itawasiliana nawe kwa WhatsApp.`,
            })}
          </p>
          {done.ref && (
            <p className="mt-8 inline-block border border-gold/50 px-6 py-3 font-display text-2xl text-gold lining-nums">
              {t({ en: 'Your reference:', sw: 'Namba yako:' })} {done.ref}
            </p>
          )}
          <p className="mt-6 text-sm text-ivory/55">
            {t({
              en: `Only trust messages from ${site.phoneDisplay}. We never ask for money to apply.`,
              sw: `Amini ujumbe kutoka ${site.phoneDisplay} pekee. Hatuombi pesa kwa ajili ya kuomba.`,
            })}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappLink(`Hello Blackhood Africa, I just applied on the website. My reference is ${done.ref}.`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory"
            >
              {t({ en: 'Say hello on WhatsApp', sw: 'Tusalimie WhatsApp' })}
            </a>
            <Link
              to="/academy"
              className="rounded-full border border-ivory/30 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] hover:border-gold hover:text-gold"
            >
              {t({ en: 'Explore the academy', sw: 'Gundua chuo' })}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <ShieldCheck size={14} /> {t(site.feeLine)}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Apply to Blackhood Africa.', sw: 'Omba kujiunga na Blackhood Africa.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'It takes about 5 minutes. Our scouting team reviews every application and replies on WhatsApp. No experience needed.',
              sw: 'Inachukua takriban dakika 5. Timu yetu ya usaili hupitia kila ombi na hujibu kwa WhatsApp. Huhitaji uzoefu.',
            })}
          </p>
          <Link to="/verify" className="mt-4 inline-block text-sm text-gold underline-offset-4 hover:underline">
            {t({ en: 'Contacted by someone claiming to be Blackhood? Check here →', sw: 'Umewasiliana na mtu anayedai ni Blackhood? Hakiki hapa →' })}
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10">
        <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-12 px-5 py-16 lg:py-20" noValidate={false}>
          {/* 1. About you */}
          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-6 font-display text-3xl">
              <span className="text-gold lining-nums">01</span> {t({ en: 'About you', sw: 'Kuhusu wewe' })}
            </legend>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="name">{t({ en: 'Full name *', sw: 'Jina kamili *' })}</label>
              <input id="name" name="name" required autoComplete="name" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="age">{t({ en: 'Age *', sw: 'Umri *' })}</label>
              <input id="age" name="age" type="number" min={12} max={60} required value={age} onChange={(e) => setAge(e.target.value)} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="gender">{t({ en: 'Gender *', sw: 'Jinsia *' })}</label>
              <select id="gender" name="gender" required defaultValue="" className={field}>
                <option value="" disabled>{t({ en: 'Choose', sw: 'Chagua' })}</option>
                {genders.map((g) => (
                  <option key={g.value} value={g.value}>{t(g.label)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="height">{t({ en: 'Height (cm) *', sw: 'Urefu (sm) *' })}</label>
              <input id="height" name="height" type="number" min={120} max={220} required placeholder={t({ en: 'e.g. 175', sw: 'mf. 175' })} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="city">{t({ en: 'City / area *', sw: 'Mji / eneo *' })}</label>
              <input id="city" name="city" required placeholder={t({ en: 'e.g. Sinza, Dar es Salaam', sw: 'mf. Sinza, Dar es Salaam' })} className={field} />
            </div>
          </fieldset>

          {/* 2. Contact */}
          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-6 font-display text-3xl">
              <span className="text-gold lining-nums">02</span> {t({ en: 'How we reach you', sw: 'Jinsi ya kukufikia' })}
            </legend>
            <div>
              <label className={label} htmlFor="phone">{t({ en: 'WhatsApp number *', sw: 'Namba ya WhatsApp *' })}</label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+255 7XX XXX XXX" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="email">{t({ en: 'Email *', sw: 'Barua pepe *' })}</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="social">Instagram / TikTok</label>
              <input id="social" name="social" placeholder="@yourname" className={field} />
            </div>
            {/* Honeypot for bots: hidden from people */}
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          </fieldset>

          {/* 3. Interest */}
          <fieldset className="grid gap-5">
            <legend className="mb-6 font-display text-3xl">
              <span className="text-gold lining-nums">03</span> {t({ en: 'What you want', sw: 'Unachotaka' })}
            </legend>
            <div>
              <label className={label} htmlFor="interest">{t({ en: "I'm interested in *", sw: 'Ninavutiwa na *' })}</label>
              <select id="interest" name="interest" required value={interest} onChange={(e) => setInterest(e.target.value)} className={field}>
                <option value="" disabled>{t({ en: 'Choose one', sw: 'Chagua moja' })}</option>
                {interests.map((i) => (
                  <option key={i.value} value={i.value}>{t(i.label)}</option>
                ))}
              </select>
            </div>
            {interest === ACADEMY && (
              <p className="border border-gold/40 p-4 text-sm text-ivory/80">
                {t({
                  en: 'Scouting and agency applications are free. The academy application fee is',
                  sw: 'Usaili na maombi ya wakala ni bure. Ada ya maombi ya chuo ni',
                })}{' '}
                {site.academyRegistrationFee}, {t(site.academyFeeTerms)}.{' '}
                {t({
                  en: "Pay only to Blackhood's official accounts and always ask for a receipt.",
                  sw: 'Lipa kwenye akaunti rasmi za Blackhood pekee na daima omba risiti.',
                })}
              </p>
            )}
            <div>
              <label className={label} htmlFor="experience">{t({ en: 'Any experience?', sw: 'Una uzoefu wowote?' })}</label>
              <textarea
                id="experience"
                name="experience"
                rows={3}
                placeholder={t({ en: 'Shows, shoots, pageants, or none at all', sw: 'Maonyesho, picha, mashindano ya urembo, au hakuna kabisa' })}
                className={field}
              />
            </div>
          </fieldset>

          {/* 4. Photos */}
          <fieldset>
            <legend className="mb-3 font-display text-3xl">
              <span className="text-gold lining-nums">04</span> {t({ en: 'Your photos', sw: 'Picha zako' })}
            </legend>
            <p className="mb-6 flex items-start gap-2 text-sm text-ivory/65">
              <Camera size={18} className="mt-0.5 shrink-0 text-gold" />
              {t({
                en: 'A phone camera is perfect. No make-up, filters or professional shoot needed.',
                sw: 'Kamera ya simu inatosha. Huhitaji vipodozi, filter wala mpiga picha wa kitaalamu.',
              })}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {photoSlots.map((s) => {
                const p = photos[s.key]
                return (
                  <div key={s.key}>
                    <label className="group relative grid aspect-[3/4] cursor-pointer place-items-center overflow-hidden border border-dashed border-white/25 bg-ink-soft text-center hover:border-gold">
                      {p ? (
                        <img src={p.preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="px-4">
                          <Camera className="mx-auto text-gold" size={28} strokeWidth={1.4} />
                          <p className="mt-3 font-semibold">
                            {t(s.title)} {s.required ? '*' : `(${t({ en: 'optional', sw: 'si lazima' })})`}
                          </p>
                          <p className="mt-1 text-xs text-ivory/55">{t(s.text)}</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => pickPhoto(s.key, e.target.files?.[0])}
                      />
                    </label>
                    {p && (
                      <button
                        type="button"
                        onClick={() => setPhotos((ph) => ({ ...ph, [s.key]: undefined }))}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-ivory/60 hover:text-gold"
                      >
                        <X size={14} /> {t({ en: 'Change', sw: 'Badilisha' })} {t(s.title).toLowerCase()}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </fieldset>

          {/* 5. Guardian (under 18) */}
          {isMinor && (
            <fieldset className="grid gap-5 border border-gold/40 p-6 sm:grid-cols-2">
              <legend className="px-2 font-display text-2xl text-gold">{t({ en: 'Parent / guardian', sw: 'Mzazi / mlezi' })}</legend>
              <p className="text-sm text-ivory/75 sm:col-span-2">
                {t({
                  en: "You're under 18, so a parent or guardian needs to be part of your application.",
                  sw: 'Uko chini ya miaka 18, kwa hiyo mzazi au mlezi anahitajika kwenye ombi lako.',
                })}{' '}
                <Link to="/parents" target="_blank" className="text-gold underline">
                  {t({ en: 'Share our parents’ guide with them.', sw: 'Washirikishe mwongozo wetu kwa wazazi.' })}
                </Link>
              </p>
              <div>
                <label className={label} htmlFor="guardianName">{t({ en: 'Their name *', sw: 'Jina lake *' })}</label>
                <input id="guardianName" name="guardianName" required className={field} />
              </div>
              <div>
                <label className={label} htmlFor="guardianPhone">{t({ en: 'Their phone *', sw: 'Simu yake *' })}</label>
                <input id="guardianPhone" name="guardianPhone" type="tel" required className={field} />
              </div>
            </fieldset>
          )}

          <div className="space-y-6 border-t border-white/10 pt-10">
            <label className="flex items-start gap-3 text-sm text-ivory/75">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#c9a45c]"
              />
              {isMinor
                ? t({
                    en: 'My parent or guardian knows about this application. Blackhood Africa may store these details and photos to review it and contact us.',
                    sw: 'Mzazi au mlezi wangu anajua kuhusu ombi hili. Blackhood Africa inaweza kuhifadhi taarifa na picha hizi ili kulipitia na kuwasiliana nasi.',
                  })
                : t({
                    en: 'I agree that Blackhood Africa may store these details and photos to review my application and contact me.',
                    sw: 'Ninakubali Blackhood Africa ihifadhi taarifa na picha hizi ili kupitia ombi langu na kuwasiliana nami.',
                  })}
            </label>

            {error && <p className="border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}

            <button
              type="submit"
              disabled={!consent || status === 'sending'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> {t({ en: 'Sending…', sw: 'Inatuma…' })}
                </>
              ) : (
                <>
                  <Send size={16} /> {t({ en: 'Submit application', sw: 'Tuma ombi' })}
                </>
              )}
            </button>
            <p className="text-xs text-ivory/45">
              {t({ en: 'Questions first? Message us on', sw: 'Una maswali kwanza? Tuandikie kwa' })}{' '}
              <a href={whatsappLink('Hello Blackhood Africa, I have a question about applying.')} target="_blank" rel="noreferrer" className="underline hover:text-gold">
                {site.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </form>
      </section>
    </>
  )
}
