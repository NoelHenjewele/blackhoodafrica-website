import { useState, type FormEvent } from 'react'
import { Camera, Send, ShieldCheck } from 'lucide-react'
import { site, whatsappLink } from '../config/site'

const ACADEMY = 'Academy training'
const interests = ['Modeling (agency)', ACADEMY, 'Creator / UGC work', 'Hosting & events', 'Not sure yet']
const photoGuide = [
  { title: 'Headshot', text: 'Face to camera, hair back, no filter.' },
  { title: 'Full length', text: 'Head to toe, fitted clothes, plain wall.' },
  { title: 'Side profile', text: 'Standing side-on, natural light.' },
]

const field =
  'w-full border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none'
const label = 'mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-ivory/70'

export default function Apply() {
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
            <ShieldCheck size={14} /> {site.feeLine}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            Your career starts with one message.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            Tell us a little about yourself. Our scouting team reviews every application and replies on WhatsApp. No
            experience needed.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-24">
          <form onSubmit={onSubmit} className="grid gap-5 border border-white/10 bg-ink-soft p-6 sm:grid-cols-2 sm:p-10">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="name">Full name *</label>
              <input id="name" name="name" required className={field} />
            </div>
            <div>
              <label className={label} htmlFor="age">Age *</label>
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
              <label className={label} htmlFor="gender">Gender *</label>
              <select id="gender" name="gender" required defaultValue="" className={field}>
                <option value="" disabled>Choose</option>
                <option>Female</option>
                <option>Male</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="height">Height (cm) *</label>
              <input id="height" name="height" type="number" min={120} max={220} required placeholder="e.g. 175" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="city">City *</label>
              <input id="city" name="city" required placeholder="e.g. Dar es Salaam" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="interest">I'm interested in *</label>
              <select
                id="interest"
                name="interest"
                required
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className={field}
              >
                <option value="" disabled>Choose one</option>
                {interests.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            {interest === ACADEMY && (
              <p className="border border-gold/40 p-4 text-sm text-ivory/80 sm:col-span-2">
                Scouting and agency applications are free. The academy application fee is{' '}
                {site.academyRegistrationFee}, {site.academyFeeTerms}. Pay only to
                Blackhood's official accounts and always ask for a receipt.
              </p>
            )}
            <div>
              <label className={label} htmlFor="social">Instagram / TikTok</label>
              <input id="social" name="social" placeholder="@yourname" className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="experience">Any experience?</label>
              <textarea id="experience" name="experience" rows={3} placeholder="Shows, shoots, pageants, or none at all" className={field} />
            </div>

            {isMinor && (
              <div className="grid gap-5 border border-gold/40 p-5 sm:col-span-2 sm:grid-cols-2">
                <p className="text-sm text-gold sm:col-span-2">
                  You're under 18, so a parent or guardian needs to be part of your application.
                </p>
                <div>
                  <label className={label} htmlFor="guardianName">Parent / guardian name *</label>
                  <input id="guardianName" name="guardianName" required className={field} />
                </div>
                <div>
                  <label className={label} htmlFor="guardianPhone">Their phone *</label>
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
                ? 'My parent or guardian knows about this application, and Blackhood Africa may contact us about it.'
                : 'I agree that Blackhood Africa may use these details to review my application and contact me.'}
            </label>
            <button
              type="submit"
              disabled={!consent}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 sm:justify-self-start"
            >
              <Send size={16} /> Send application via WhatsApp
            </button>
          </form>

          <aside>
            <h2 className="flex items-center gap-3 font-display text-3xl">
              <Camera className="text-gold" size={26} strokeWidth={1.4} /> Your 3 photos
            </h2>
            <p className="mt-4 text-ivory/70">
              After you send the form, share these three photos in the same WhatsApp chat. A phone camera is perfect.
              No make-up or professional shoot needed.
            </p>
            <ol className="mt-8 space-y-6">
              {photoGuide.map((p, i) => (
                <li key={p.title} className="flex gap-5 border-t border-white/10 pt-6">
                  <span className="font-display text-3xl text-gold lining-nums">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-ivory/65">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-10 border-t border-white/10 pt-6 text-sm text-ivory/55">
              Questions first? Message us on {site.phoneDisplay}.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
