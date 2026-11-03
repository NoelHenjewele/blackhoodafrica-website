import { useState, type FormEvent } from 'react'
import { BadgeCheck, Loader2, XCircle } from 'lucide-react'
import { useLang } from '../i18n'

type Result = { valid: boolean; name?: string; kind?: string; course?: string; issued?: string } | null

// Lets brands and parents check a Blackhood talent code (BHA-T-0001) or academy certificate (BHA-C-0001).
export default function CodeCheck() {
  const { t } = useLang()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result>(null)
  const [error, setError] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(false)
    try {
      const res = await fetch(`/api/verify-code?code=${encodeURIComponent(code.trim())}`)
      const r = (await res.json()) as { ok: boolean; valid?: boolean; name?: string; kind?: string; course?: string; issued?: string }
      if (!r.ok) throw new Error()
      setResult({ valid: !!r.valid, name: r.name, kind: r.kind, course: r.course, issued: r.issued })
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-gold/40 bg-ink p-6 sm:p-8">
      <p className="font-display text-2xl">{t({ en: 'Check a talent code or certificate', sw: 'Hakiki namba ya kipaji au cheti' })}</p>
      <p className="mt-2 text-sm text-ivory/65">
        {t({
          en: 'Every approved Blackhood model has a code like BHA-T-0001, and every academy certificate has a number like BHA-C-0001. Enter it to confirm it is genuine.',
          sw: 'Kila mwanamitindo aliyekubaliwa na Blackhood ana namba kama BHA-T-0001, na kila cheti cha chuo kina namba kama BHA-C-0001. Iingize kuthibitisha ni halali.',
        })}
      </p>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
          placeholder="BHA-T-0001"
          aria-label={t({ en: 'Talent code', sw: 'Namba ya kipaji' })}
          className="min-w-0 flex-1 border border-white/15 bg-ink-soft px-4 py-3 font-mono text-sm uppercase tracking-wider text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {t({ en: 'Check', sw: 'Hakiki' })}
        </button>
      </form>

      {result?.valid && result.kind === 'certificate' && (
        <p className="mt-5 flex items-start gap-2 text-green-300">
          <BadgeCheck size={20} className="mt-0.5 shrink-0" />
          <span>
            {t({ en: 'Genuine certificate: awarded to', sw: 'Cheti halali: kimetolewa kwa' })} <strong>{result.name}</strong> {t({ en: 'for', sw: 'kwa' })} <strong>{result.course}</strong>
            {result.issued && ` (${new Date(result.issued + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })})`}.
          </span>
        </p>
      )}
      {result?.valid && result.kind !== 'certificate' && (
        <p className="mt-5 flex items-start gap-2 text-green-300">
          <BadgeCheck size={20} className="mt-0.5 shrink-0" />
          <span>
            {t({ en: 'Verified: this code belongs to', sw: 'Imethibitishwa: namba hii ni ya' })} <strong>{result.name}</strong>
            {t({ en: ', an approved Blackhood Africa talent.', sw: ', kipaji kilichokubaliwa na Blackhood Africa.' })}
          </span>
        </p>
      )}
      {result && !result.valid && (
        <p className="mt-5 flex items-start gap-2 text-red-300">
          <XCircle size={20} className="mt-0.5 shrink-0" />
          {t({
            en: 'Not found. This is not a valid Blackhood code. Please contact us before going ahead.',
            sw: 'Haipatikani. Hii si namba halali ya Blackhood. Tafadhali wasiliana nasi kabla ya kuendelea.',
          })}
        </p>
      )}
      {error && (
        <p className="mt-5 text-sm text-ivory/60">
          {t({ en: "We couldn't check right now. Please try again, or ask us on WhatsApp.", sw: 'Hatukuweza kuhakiki sasa. Jaribu tena, au tuulize kwa WhatsApp.' })}
        </p>
      )}
    </div>
  )
}
