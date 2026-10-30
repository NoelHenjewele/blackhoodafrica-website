import { useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useLang } from '../i18n'

const interests = [
  { value: 'Castings & modeling', label: { en: 'Castings & modeling', sw: 'Usaili na uanamitindo' } },
  { value: 'Academy', label: { en: 'Academy', sw: 'Chuo' } },
  { value: 'Brand / client news', label: { en: 'Brand / client news', sw: 'Habari kwa makampuni' } },
  { value: 'Everything', label: { en: 'Everything', sw: 'Kila kitu' } },
]

export default function Newsletter() {
  const { t, lang } = useLang()
  const { pathname } = useLocation()
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    setState('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(d.get('email') ?? '').trim(),
          interest: String(d.get('interest') ?? ''),
          lang,
          source: pathname,
          website: String(d.get('website') ?? ''),
        }),
      })
      const r = (await res.json()) as { ok: boolean }
      setState(r.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="border-b border-white/10 pb-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="font-display text-3xl">{t({ en: 'Be first to hear.', sw: 'Kuwa wa kwanza kujua.' })}</p>
          <p className="mt-2 text-sm text-ivory/60">
            {t({
              en: 'Castings, academy intakes and new faces, straight to your inbox. No spam, unsubscribe anytime.',
              sw: 'Usaili, nafasi za chuo na sura mpya, moja kwa moja kwenye barua pepe yako. Hakuna barua taka, jiondoe wakati wowote.',
            })}
          </p>
        </div>

        {state === 'done' ? (
          <p className="flex items-center gap-2 text-gold">
            <CheckCircle2 size={20} /> {t({ en: "You're in. Check your inbox for a welcome email.", sw: 'Umejiunga. Angalia barua pepe yako ya ukaribisho.' })}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t({ en: 'Your email', sw: 'Barua pepe yako' })}
              aria-label={t({ en: 'Your email', sw: 'Barua pepe yako' })}
              className="min-w-0 flex-1 border border-white/15 bg-ink-soft px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
            />
            <select
              name="interest"
              defaultValue="Everything"
              aria-label={t({ en: 'Interested in', sw: 'Unavutiwa na' })}
              className="border border-white/15 bg-ink-soft px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
            >
              {interests.map((i) => (
                <option key={i.value} value={i.value}>{t(i.label)}</option>
              ))}
            </select>
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <button
              type="submit"
              disabled={state === 'sending'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50"
            >
              {state === 'sending' && <Loader2 size={14} className="animate-spin" />}
              {t({ en: 'Subscribe', sw: 'Jiunge' })}
            </button>
          </form>
        )}
      </div>
      {state === 'error' && (
        <p className="mt-3 text-sm text-red-300">
          {t({ en: 'Something went wrong. Please try again.', sw: 'Kuna tatizo. Tafadhali jaribu tena.' })}
        </p>
      )}
    </div>
  )
}
