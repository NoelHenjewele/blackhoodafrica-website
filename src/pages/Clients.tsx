import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import ForBrands from '../components/home/ForBrands'
import { site, whatsappLink } from '../config/site'

const jobTypes = ['TV / video ad', 'Print or billboard campaign', 'Social media / UGC', 'Event / activation', 'Runway / fashion show', 'Editorial shoot', 'Other']
const usageOptions = ['Social media only', 'Digital (web + social)', 'Print & outdoor', 'TV & all media', 'Not sure yet']

const field =
  'w-full border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none'
const label = 'mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-ivory/70'

export default function Clients() {
  const [consent, setConsent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const get = (k: string) => String(d.get(k) ?? '').trim()
    const lines = [
      'Hello Blackhood Africa, I would like to book talent.',
      '',
      `Name: ${get('name')}`,
      get('company') && `Company: ${get('company')}`,
      `Job type: ${get('jobType')}`,
      `Dates: ${get('dates')}`,
      get('location') && `Location: ${get('location')}`,
      get('talent') && `Talent needed: ${get('talent')}`,
      get('budget') && `Budget (TZS): ${get('budget')}`,
      `Usage rights: ${get('usage')}`,
      get('notes') && `Notes: ${get('notes')}`,
    ].filter(Boolean)
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener')
  }

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-6 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">For brands & agencies</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            Book trained, reliable talent for your next project.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            Tell us what you're making and we'll come back within 24 hours with suitable faces, availability and a
            clear quote.
          </p>
        </div>
      </section>

      <ForBrands standalone />

      <section id="brief" className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Send a brief</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">Tell us about the job.</h2>
            <p className="mt-6 text-ivory/70">
              Fill in what you know. Your brief opens in WhatsApp, ready to send to our bookings team. Prefer to talk?
              Call or message {site.phoneDisplay}.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ivory/70">
              <li>• Reply within 24 hours</li>
              <li>• Written quote and contract for every booking</li>
              <li>• Usage rights agreed up front, so there are no surprises</li>
            </ul>
          </div>

          <form onSubmit={onSubmit} className="grid gap-5 border border-white/10 bg-ink-soft p-6 sm:grid-cols-2 sm:p-10">
            <div>
              <label className={label} htmlFor="name">Your name *</label>
              <input id="name" name="name" required className={field} />
            </div>
            <div>
              <label className={label} htmlFor="company">Company / brand</label>
              <input id="company" name="company" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="jobType">Job type *</label>
              <select id="jobType" name="jobType" required className={field} defaultValue="">
                <option value="" disabled>Choose one</option>
                {jobTypes.map((j) => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="dates">Date(s) *</label>
              <input id="dates" name="dates" required placeholder="e.g. 14–15 Dec" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="location">Location</label>
              <input id="location" name="location" placeholder="e.g. Masaki, Dar es Salaam" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="talent">Talent needed</label>
              <input id="talent" name="talent" placeholder="e.g. 2 women, 1 man, 25–35" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="budget">Budget (TZS)</label>
              <input id="budget" name="budget" inputMode="numeric" placeholder="Approximate is fine" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="usage">Usage rights *</label>
              <select id="usage" name="usage" required className={field} defaultValue="">
                <option value="" disabled>Where will it appear?</option>
                {usageOptions.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="notes">Anything else?</label>
              <textarea id="notes" name="notes" rows={4} placeholder="Look, references, wardrobe, hours…" className={field} />
            </div>
            <label className="flex items-start gap-3 text-sm text-ivory/70 sm:col-span-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#c9a45c]"
              />
              I agree that Blackhood Africa may use these details to respond to my enquiry.
            </label>
            <button
              type="submit"
              disabled={!consent}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 sm:justify-self-start"
            >
              <Send size={16} /> Send brief via WhatsApp
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
