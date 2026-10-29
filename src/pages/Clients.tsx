import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import ForBrands from '../components/home/ForBrands'
import { site, whatsappLink } from '../config/site'
import { useLang } from '../i18n'

// Option values stay in English so briefs reach the team in one language.
const jobTypes = [
  { value: 'TV / video ad', label: { en: 'TV / video ad', sw: 'Tangazo la TV / video' } },
  { value: 'Print or billboard campaign', label: { en: 'Print or billboard campaign', sw: 'Kampeni ya machapisho au mabango' } },
  { value: 'Social media / UGC', label: { en: 'Social media / UGC', sw: 'Mitandao ya kijamii / maudhui' } },
  { value: 'Event / activation', label: { en: 'Event / activation', sw: 'Tukio / kampeni ya ana kwa ana' } },
  { value: 'Runway / fashion show', label: { en: 'Runway / fashion show', sw: 'Onyesho la mitindo' } },
  { value: 'Editorial shoot', label: { en: 'Editorial shoot', sw: 'Picha za jarida' } },
  { value: 'Other', label: { en: 'Other', sw: 'Nyingine' } },
]
const usageOptions = [
  { value: 'Social media only', label: { en: 'Social media only', sw: 'Mitandao ya kijamii pekee' } },
  { value: 'Digital (web + social)', label: { en: 'Digital (web + social)', sw: 'Mtandaoni (tovuti + mitandao)' } },
  { value: 'Print & outdoor', label: { en: 'Print & outdoor', sw: 'Machapisho na mabango' } },
  { value: 'TV & all media', label: { en: 'TV & all media', sw: 'TV na vyombo vyote' } },
  { value: 'Not sure yet', label: { en: 'Not sure yet', sw: 'Bado sina uhakika' } },
]

const field =
  'w-full border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none'
const label = 'mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-ivory/70'

export default function Clients() {
  const { t } = useLang()
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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {t({ en: 'For brands & agencies', sw: 'Kwa makampuni na mawakala' })}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({
              en: 'Book trained, reliable talent for your next project.',
              sw: 'Ajiri vipaji vilivyofunzwa na vya kuaminika kwa mradi wako ujao.',
            })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: "Tell us what you're making and we'll come back within 24 hours with suitable faces, availability and a clear quote.",
              sw: 'Tueleze unachotengeneza na tutakujibu ndani ya saa 24 na sura zinazofaa, upatikanaji na bei iliyo wazi.',
            })}
          </p>
        </div>
      </section>

      <ForBrands standalone />

      <section id="brief" className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Send a brief', sw: 'Tuma maelezo' })}</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              {t({ en: 'Tell us about the job.', sw: 'Tueleze kuhusu kazi.' })}
            </h2>
            <p className="mt-6 text-ivory/70">
              {t({
                en: 'Fill in what you know. Your brief opens in WhatsApp, ready to send to our bookings team. Prefer to talk? Call or message',
                sw: 'Jaza unachojua. Maelezo yako yatafunguka kwenye WhatsApp, tayari kutumwa kwa timu yetu. Ungependa kuongea? Piga simu au tuma ujumbe',
              })}{' '}
              {site.phoneDisplay}.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ivory/70">
              <li>• {t({ en: 'Reply within 24 hours', sw: 'Jibu ndani ya saa 24' })}</li>
              <li>• {t({ en: 'Written quote and contract for every booking', sw: 'Bei na mkataba wa maandishi kwa kila kazi' })}</li>
              <li>
                •{' '}
                {t({
                  en: 'Usage rights agreed up front, so there are no surprises',
                  sw: 'Haki za matumizi zinakubaliwa mapema, hakuna mshangao',
                })}
              </li>
            </ul>
          </div>

          <form onSubmit={onSubmit} className="grid gap-5 border border-white/10 bg-ink-soft p-6 sm:grid-cols-2 sm:p-10">
            <div>
              <label className={label} htmlFor="name">{t({ en: 'Your name *', sw: 'Jina lako *' })}</label>
              <input id="name" name="name" required className={field} />
            </div>
            <div>
              <label className={label} htmlFor="company">{t({ en: 'Company / brand', sw: 'Kampuni / chapa' })}</label>
              <input id="company" name="company" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="jobType">{t({ en: 'Job type *', sw: 'Aina ya kazi *' })}</label>
              <select id="jobType" name="jobType" required className={field} defaultValue="">
                <option value="" disabled>{t({ en: 'Choose one', sw: 'Chagua moja' })}</option>
                {jobTypes.map((j) => (
                  <option key={j.value} value={j.value}>{t(j.label)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="dates">{t({ en: 'Date(s) *', sw: 'Tarehe *' })}</label>
              <input id="dates" name="dates" required placeholder={t({ en: 'e.g. 14–15 Dec', sw: 'mf. 14–15 Des' })} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="location">{t({ en: 'Location', sw: 'Mahali' })}</label>
              <input id="location" name="location" placeholder={t({ en: 'e.g. Masaki, Dar es Salaam', sw: 'mf. Masaki, Dar es Salaam' })} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="talent">{t({ en: 'Talent needed', sw: 'Vipaji vinavyohitajika' })}</label>
              <input id="talent" name="talent" placeholder={t({ en: 'e.g. 2 women, 1 man, 25–35', sw: 'mf. wanawake 2, mwanaume 1, miaka 25–35' })} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="budget">{t({ en: 'Budget (TZS)', sw: 'Bajeti (TZS)' })}</label>
              <input id="budget" name="budget" inputMode="numeric" placeholder={t({ en: 'Approximate is fine', sw: 'Makadirio yanatosha' })} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="usage">{t({ en: 'Usage rights *', sw: 'Haki za matumizi *' })}</label>
              <select id="usage" name="usage" required className={field} defaultValue="">
                <option value="" disabled>{t({ en: 'Where will it appear?', sw: 'Itaonekana wapi?' })}</option>
                {usageOptions.map((u) => (
                  <option key={u.value} value={u.value}>{t(u.label)}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="notes">{t({ en: 'Anything else?', sw: 'Kitu kingine?' })}</label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder={t({ en: 'Look, references, wardrobe, hours…', sw: 'Mwonekano, mifano, mavazi, saa…' })}
                className={field}
              />
            </div>
            <label className="flex items-start gap-3 text-sm text-ivory/70 sm:col-span-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#c9a45c]"
              />
              {t({
                en: 'I agree that Blackhood Africa may use these details to respond to my enquiry.',
                sw: 'Ninakubali Blackhood Africa itumie taarifa hizi kujibu ombi langu.',
              })}
            </label>
            <button
              type="submit"
              disabled={!consent}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 sm:justify-self-start"
            >
              <Send size={16} /> {t({ en: 'Send brief via WhatsApp', sw: 'Tuma maelezo kwa WhatsApp' })}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
