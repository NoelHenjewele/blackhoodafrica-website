import { useState, type FormEvent } from 'react'
import { Loader2, Send } from 'lucide-react'

// Team-only: resend the approval email (with the talent code) to an approved model who didn't get it.
const messages: Record<string, string> = {
  'bad code': 'Use a talent code like BHA-T-0003.',
  'not found': 'No row in the Sheet has that talent code.',
  'not approved': 'That row is not set to Approved in the Sheet.',
  'no email': 'That row has no valid email address. Fix it in the Sheet first.',
  quota: 'Google’s daily email limit is used up. Try again tomorrow, or send the code by WhatsApp.',
  'send failed': 'Google refused to send the email. Check the address in the Sheet.',
}

function LoginCode({ token }: { token: string }) {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    setBusy(true)
    setResult(null)
    try {
      const res = await fetch('/api/account/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: d.get('email'), talentCode: d.get('code'), show: true }),
      })
      const r = (await res.json()) as { ok: boolean; code?: string; error?: string }
      setResult(
        r.ok && r.code
          ? { ok: true, text: `Login code: ${r.code}  (works for 10 minutes). Send it to her on WhatsApp; she types it on /account after entering her email.` }
          : { ok: false, text: r.error === 'wait' ? 'A code was made less than a minute ago. Wait a minute and try again.' : r.error === 'needs code' ? 'First login: add her talent code too.' : 'That email and code don’t match an approved model in the Sheet.' },
      )
    } catch {
      setResult({ ok: false, text: 'Something went wrong. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex flex-wrap items-center gap-3 border border-white/10 bg-ink-soft p-4 text-sm">
      <span className="text-ivory/75">Login code by WhatsApp (if her email doesn’t arrive):</span>
      <input name="email" type="email" required placeholder="her email" className="w-56 border border-white/15 bg-ink px-3 py-2 text-ivory focus:border-gold focus:outline-none" />
      <input name="code" placeholder="BHA-T-0003 (first login)" className="w-48 border border-white/15 bg-ink px-3 py-2 font-mono uppercase text-ivory focus:border-gold focus:outline-none" />
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-ink disabled:opacity-50">
        {busy ? <Loader2 size={14} className="animate-spin" /> : null} Get code
      </button>
      {result && <p className={`w-full font-medium ${result.ok ? 'text-green-300' : 'text-red-300'}`}>{result.text}</p>}
    </form>
  )
}

export default function ResendCode({ token }: { token: string }) {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const code = String(new FormData(e.currentTarget).get('code') ?? '').trim().toUpperCase()
    setBusy(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/profiles?resend=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code }),
      })
      const r = (await res.json()) as { ok: boolean; error?: string; email?: string; name?: string }
      setResult(
        r.ok
          ? { ok: true, text: `Sent to ${r.name} at ${r.email}. Ask her to check Spam/Promotions too.` }
          : { ok: false, text: messages[r.error ?? ''] ?? 'Something went wrong. Please try again.' },
      )
    } catch {
      setResult({ ok: false, text: 'Something went wrong. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
    <form onSubmit={onSubmit} className="mt-6 flex flex-wrap items-center gap-3 border border-white/10 bg-ink-soft p-4 text-sm">
      <span className="text-ivory/75">Resend talent code email:</span>
      <input name="code" required placeholder="BHA-T-0003" className="w-36 border border-white/15 bg-ink px-3 py-2 font-mono uppercase text-ivory focus:border-gold focus:outline-none" />
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50">
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send
      </button>
      {result && <p className={`w-full ${result.ok ? 'text-green-300' : 'text-red-300'}`}>{result.text}</p>}
    </form>
    <LoginCode token={token} />
    </>
  )
}
