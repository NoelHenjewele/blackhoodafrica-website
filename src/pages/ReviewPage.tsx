import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import { useLang } from '../i18n'

// /review: a link the team sends to clients, models and parents. Reviews show only after approval.
const field = 'w-full border border-white/15 bg-ink-soft px-4 py-3.5 text-ivory placeholder:text-ivory/50 focus:border-gold focus:outline-none'

export default function ReviewPage() {
  const { t } = useLang()
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const kinds = [
    { value: 'client', label: t({ en: 'A brand / client', sw: 'Kampuni / mteja' }) },
    { value: 'model', label: t({ en: 'A model or academy student', sw: 'Mwanamitindo au mwanafunzi wa chuo' }) },
    { value: 'parent', label: t({ en: 'A parent or guardian', sw: 'Mzazi au mlezi' }) },
    { value: 'other', label: t({ en: 'Other', sw: 'Mengineyo' }) },
  ]

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const d = new FormData(e.currentTarget)
    const get = (k: string) => String(d.get(k) ?? '').trim()
    setSending(true)
    try {
      const res = await fetch('/api/talent?review=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: get('quote'),
          name: get('name'),
          role: get('role'),
          kind: get('kind'),
          contact: get('contact'),
          consent: d.get('consent') === 'on',
          website: get('website'),
        }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError(t({ en: 'Something went wrong. Please try again.', sw: 'Kuna tatizo. Tafadhali jaribu tena.' }))
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="min-h-[80vh] pt-20">
      <div className="mx-auto max-w-2xl px-5 py-16 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Leave a review', sw: 'Toa maoni' })}</p>
        {done ? (
          <>
            <Check className="mt-8 text-gold" size={40} />
            <h1 className="mt-4 font-display text-5xl font-medium">{t({ en: 'Thank you!', sw: 'Asante sana!' })}</h1>
            <p className="mt-4 text-ivory/85">
              {t({
                en: 'Your review has been sent to the Blackhood team. It will appear on our website once we have checked it.',
                sw: 'Maoni yako yametumwa kwa timu ya Blackhood. Yataonekana kwenye tovuti yetu baada ya kuyakagua.',
              })}
            </p>
            <Link to="/" className="mt-8 inline-block text-gold underline">{t({ en: 'Back to the home page', sw: 'Rudi ukurasa wa mwanzo' })}</Link>
          </>
        ) : (
          <>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05]">
              {t({ en: 'How was your experience with Blackhood?', sw: 'Uzoefu wako na Blackhood ulikuwaje?' })}
            </h1>
            <p className="mt-4 text-ivory/85">
              {t({
                en: 'One or two honest sentences is perfect. With your permission, we may show it on our website.',
                sw: 'Sentensi moja au mbili za kweli zinatosha. Kwa ruhusa yako, tunaweza kuyaonyesha kwenye tovuti yetu.',
              })}
            </p>

            <form onSubmit={onSubmit} className="mt-10 grid gap-4">
              <label className="grid gap-2 text-sm">
                {t({ en: 'I am…', sw: 'Mimi ni…' })}
                <select name="kind" className={field} defaultValue="client">
                  {kinds.map((k) => (
                    <option key={k.value} value={k.value}>{k.label}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                {t({ en: 'Your review', sw: 'Maoni yako' })}
                <textarea name="quote" required minLength={10} maxLength={600} rows={5} className={field}
                  placeholder={t({ en: 'e.g. The models arrived on time and were very professional…', sw: 'mf. Wanamitindo walifika kwa wakati na walikuwa na weledi…' })} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  {t({ en: 'Your name', sw: 'Jina lako' })}
                  <input name="name" required maxLength={80} className={field} />
                </label>
                <label className="grid gap-2 text-sm">
                  {t({ en: 'Role or company (shown)', sw: 'Cheo au kampuni (kitaonyeshwa)' })}
                  <input name="role" maxLength={100} className={field} placeholder={t({ en: 'e.g. Marketing lead, Azam', sw: 'mf. Mzazi, Kinondoni' })} />
                </label>
              </div>
              <label className="grid gap-2 text-sm">
                {t({ en: 'Phone or email (not shown, only so we can confirm)', sw: 'Simu au barua pepe (haitaonyeshwa, ni kwa uthibitisho tu)' })}
                <input name="contact" maxLength={100} className={field} />
              </label>
              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <label className="flex items-start gap-3 text-sm text-ivory/90">
                <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#c9a45c]" />
                {t({
                  en: 'Blackhood Africa may show my review, name and role on its website.',
                  sw: 'Blackhood Africa inaweza kuonyesha maoni, jina na cheo changu kwenye tovuti yake.',
                })}
              </label>
              {error && <p className="text-red-300">{error}</p>}
              <button type="submit" disabled={sending}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory disabled:opacity-60">
                {sending && <Loader2 size={16} className="animate-spin" />}
                {t({ en: 'Send review', sw: 'Tuma maoni' })}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
