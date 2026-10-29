import { useState, type FormEvent } from 'react'
import { Camera, Send, ShieldCheck } from 'lucide-react'
import { site, whatsappLink } from '../config/site'
import { useLang } from '../i18n'

// Option values stay in English so applications reach the team in one language.
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
const photoGuide = [
  {
    title: { en: 'Headshot', sw: 'Picha ya uso' },
    text: { en: 'Face to camera, hair back, no filter.', sw: 'Uso kuelekea kamera, nywele nyuma, bila filter.' },
  },
  {
    title: { en: 'Full length', sw: 'Picha ya mwili mzima' },
    text: { en: 'Head to toe, fitted clothes, plain wall.', sw: 'Kichwa hadi miguu, nguo zinazobana kiasi, ukuta mtupu.' },
  },
  {
    title: { en: 'Side profile', sw: 'Picha ya ubavuni' },
    text: { en: 'Standing side-on, natural light.', sw: 'Umesimama kwa ubavu, mwanga wa asili.' },
  },
]

const field =
  'w-full border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none'
const label = 'mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-ivory/70'

export default function Apply() {
  const { t } = useLang()
  const [age, setAge] = useState('')
  const [consent, setConsent] = useState(false)
  const [interest, setInterest] = useState('')
  const isMinor = age !== '' && Number(age) < 18

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const get = (k: string) => String(d.get(k) ?? '').trim()
    const lines = [
      'Hello Blackhood Africa, I would like to apply.',
      `Name: ${get('name')}`,
      `Age: ${get('age')}`,
      `Gender: ${get('gender')}`,
      `Height: ${get('height')} cm`,
      `City: ${get('city')}`,
      `Interested in: ${get('interest')}`,
      get('social') && `Instagram/TikTok: ${get('social')}`,
      get('experience') && `Experience: ${get('experience')}`,
      isMinor && `Parent/guardian: ${get('guardianName')} (${get('guardianPhone')})`,
      '',
      'I will send my 3 photos (headshot, full length, side profile) in this chat.',
    ].filter((l) => l !== false && l !== null && l !== undefined)
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener')
  }

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <ShieldCheck size={14} /> {t(site.feeLine)}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Your career starts with one message.', sw: 'Safari yako inaanza na ujumbe mmoja.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'Tell us a little about yourself. Our scouting team reviews every application and replies on WhatsApp. No experience needed.',
              sw: 'Tueleze kidogo kuhusu wewe. Timu yetu ya usaili hupitia kila ombi na hujibu kwa WhatsApp. Huhitaji uzoefu.',
            })}
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-24">
          <form onSubmit={onSubmit} className="grid gap-5 border border-white/10 bg-ink-soft p-6 sm:grid-cols-2 sm:p-10">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="name">{t({ en: 'Full name *', sw: 'Jina kamili *' })}</label>
              <input id="name" name="name" required className={field} />
            </div>
            <div>
              <label className={label} htmlFor="age">{t({ en: 'Age *', sw: 'Umri *' })}</label>
              <input
                id="age"
                name="age"
                type="number"
                min={12}
                max={60}
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={field}
              />
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
              <label className={label} htmlFor="city">{t({ en: 'City *', sw: 'Mji *' })}</label>
              <input id="city" name="city" required placeholder={t({ en: 'e.g. Dar es Salaam', sw: 'mf. Dar es Salaam' })} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="interest">{t({ en: "I'm interested in *", sw: 'Ninavutiwa na *' })}</label>
              <select
                id="interest"
                name="interest"
                required
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className={field}
              >
                <option value="" disabled>{t({ en: 'Choose one', sw: 'Chagua moja' })}</option>
                {interests.map((i) => (
                  <option key={i.value} value={i.value}>{t(i.label)}</option>
                ))}
              </select>
            </div>
            {interest === ACADEMY && (
              <p className="border border-gold/40 p-4 text-sm text-ivory/80 sm:col-span-2">
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
              <label className={label} htmlFor="social">Instagram / TikTok</label>
              <input id="social" name="social" placeholder="@yourname" className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="experience">{t({ en: 'Any experience?', sw: 'Una uzoefu wowote?' })}</label>
              <textarea
                id="experience"
                name="experience"
                rows={3}
                placeholder={t({ en: 'Shows, shoots, pageants, or none at all', sw: 'Maonyesho, picha, mashindano ya urembo, au hakuna kabisa' })}
                className={field}
              />
            </div>

            {isMinor && (
              <div className="grid gap-5 border border-gold/40 p-5 sm:col-span-2 sm:grid-cols-2">
                <p className="text-sm text-gold sm:col-span-2">
                  {t({
                    en: "You're under 18, so a parent or guardian needs to be part of your application.",
                    sw: 'Uko chini ya miaka 18, kwa hiyo mzazi au mlezi anahitajika kwenye ombi lako.',
                  })}
                </p>
                <div>
                  <label className={label} htmlFor="guardianName">{t({ en: 'Parent / guardian name *', sw: 'Jina la mzazi / mlezi *' })}</label>
                  <input id="guardianName" name="guardianName" required className={field} />
                </div>
                <div>
                  <label className={label} htmlFor="guardianPhone">{t({ en: 'Their phone *', sw: 'Simu yake *' })}</label>
                  <input id="guardianPhone" name="guardianPhone" type="tel" required className={field} />
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 text-sm text-ivory/70 sm:col-span-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#c9a45c]"
              />
              {isMinor
                ? t({
                    en: 'My parent or guardian knows about this application, and Blackhood Africa may contact us about it.',
                    sw: 'Mzazi au mlezi wangu anajua kuhusu ombi hili, na Blackhood Africa inaweza kuwasiliana nasi kuhusu ombi hili.',
                  })
                : t({
                    en: 'I agree that Blackhood Africa may use these details to review my application and contact me.',
                    sw: 'Ninakubali Blackhood Africa itumie taarifa hizi kupitia ombi langu na kuwasiliana nami.',
                  })}
            </label>
            <button
              type="submit"
              disabled={!consent}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 sm:justify-self-start"
            >
              <Send size={16} /> {t({ en: 'Send application via WhatsApp', sw: 'Tuma ombi kwa WhatsApp' })}
            </button>
          </form>

          <aside>
            <h2 className="flex items-center gap-3 font-display text-3xl">
              <Camera className="text-gold" size={26} strokeWidth={1.4} /> {t({ en: 'Your 3 photos', sw: 'Picha zako 3' })}
            </h2>
            <p className="mt-4 text-ivory/70">
              {t({
                en: 'After you send the form, share these three photos in the same WhatsApp chat. A phone camera is perfect. No make-up or professional shoot needed.',
                sw: 'Baada ya kutuma fomu, tuma picha hizi tatu kwenye mazungumzo hayo hayo ya WhatsApp. Kamera ya simu inatosha. Huhitaji vipodozi wala mpiga picha wa kitaalamu.',
              })}
            </p>
            <ol className="mt-8 space-y-6">
              {photoGuide.map((p, i) => (
                <li key={p.title.en} className="flex gap-5 border-t border-white/10 pt-6">
                  <span className="font-display text-3xl text-gold lining-nums">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="font-semibold">{t(p.title)}</p>
                    <p className="text-sm text-ivory/65">{t(p.text)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-10 border-t border-white/10 pt-6 text-sm text-ivory/55">
              {t({ en: 'Questions first? Message us on', sw: 'Una maswali kwanza? Tuandikie kwa' })} {site.phoneDisplay}.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
