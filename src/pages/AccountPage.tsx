import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { BadgeCheck, Loader2, LogOut } from 'lucide-react'
import { supabase } from '../config/supabase'
import { useLang, type L } from '../i18n'

type Profile = { full_name: string; talent_code: string; email: string }

const errors: Record<string, L> = {
  'needs code': {
    en: "We don't have an account for this email yet. Add your talent code to create one.",
    sw: 'Hatuna akaunti ya barua pepe hii bado. Weka namba yako ya kipaji kuifungua.',
  },
  'no match': {
    en: 'That talent code and email do not match an approved model. Use the email you applied with.',
    sw: 'Namba hiyo ya kipaji na barua pepe havilingani na mwanamitindo aliyekubaliwa. Tumia barua pepe uliyoombea.',
  },
  'code used': {
    en: 'An account already exists for this talent code. Log in with the email you used before.',
    sw: 'Akaunti tayari ipo kwa namba hii ya kipaji. Ingia kwa barua pepe uliyotumia awali.',
  },
  wait: { en: 'A code was just sent. Please wait a minute before asking again.', sw: 'Namba imetumwa sasa hivi. Subiri dakika moja kabla ya kuomba tena.' },
  'wrong code': { en: 'That code is not right. Check the email and try again.', sw: 'Namba hiyo si sahihi. Angalia barua pepe na ujaribu tena.' },
  expired: { en: 'That code has expired. Ask for a new one.', sw: 'Namba hiyo imeisha muda. Omba mpya.' },
  'too many': { en: 'Too many tries. Ask for a new code.', sw: 'Majaribio mengi mno. Omba namba mpya.' },
}
const fallback: L = { en: 'Something went wrong. Please try again.', sw: 'Kuna tatizo. Tafadhali jaribu tena.' }

const field =
  'w-full border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none'
const label = 'mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-ivory/70'
const button =
  'inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory disabled:opacity-50'

export default function AccountPage() {
  const { t, lang } = useLang()
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [talentCode, setTalentCode] = useState('')
  const [needsCode, setNeedsCode] = useState(false)
  const [otp, setOtp] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return setProfile(null)
    supabase
      .from('profiles')
      .select('full_name, talent_code, email')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null))
  }, [session])

  function showError(code?: string) {
    if (code === 'needs code') setNeedsCode(true)
    setError(t(errors[code ?? ''] ?? fallback))
  }

  async function sendCode(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/account/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, talentCode: needsCode ? talentCode : undefined, lang }),
      })
      const r = (await res.json()) as { ok: boolean; error?: string }
      if (r.ok) setStep('code')
      else showError(r.error)
    } catch {
      showError()
    } finally {
      setBusy(false)
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/account/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      })
      const r = (await res.json()) as { ok: boolean; tokenHash?: string; error?: string }
      if (!r.ok || !r.tokenHash) return showError(r.error)
      const { error: authError } = await supabase.auth.verifyOtp({ token_hash: r.tokenHash, type: 'magiclink' })
      if (authError) showError()
    } catch {
      showError()
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setStep('email')
    setOtp('')
  }

  return (
    <section className="min-h-[80vh] pt-20">
      <div className="mx-auto max-w-xl px-5 py-16 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Model account', sw: 'Akaunti ya mwanamitindo' })}</p>

        {!ready ? (
          <Loader2 className="mt-10 animate-spin text-gold" />
        ) : session ? (
          <div className="mt-5">
            <h1 className="font-display text-5xl font-medium">
              {t({ en: 'Welcome', sw: 'Karibu' })}
              {profile ? `, ${profile.full_name.split(' ')[0]}` : ''}.
            </h1>
            {profile && (
              <div className="mt-8 border border-gold/40 bg-ink-soft p-6">
                <p className="flex items-center gap-2 text-green-300">
                  <BadgeCheck size={18} /> {t({ en: 'Approved Blackhood Africa talent', sw: 'Kipaji kilichokubaliwa na Blackhood Africa' })}
                </p>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                  <dt className="text-ivory/55">{t({ en: 'Name', sw: 'Jina' })}</dt>
                  <dd>{profile.full_name}</dd>
                  <dt className="text-ivory/55">{t({ en: 'Talent code', sw: 'Namba ya kipaji' })}</dt>
                  <dd className="font-mono">{profile.talent_code}</dd>
                  <dt className="text-ivory/55">{t({ en: 'Email', sw: 'Barua pepe' })}</dt>
                  <dd>{profile.email}</dd>
                </dl>
              </div>
            )}
            <p className="mt-6 text-sm text-ivory/65">
              {t({
                en: 'Profile editing and photo uploads are coming next. For now you can make your comp card.',
                sw: 'Kuhariri wasifu na kupakia picha kunakuja hivi karibuni. Kwa sasa unaweza kutengeneza comp card yako.',
              })}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/compcard" className={button}>{t({ en: 'Make my comp card', sw: 'Tengeneza comp card yangu' })}</Link>
              <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] hover:border-gold hover:text-gold">
                <LogOut size={16} /> {t({ en: 'Log out', sw: 'Toka' })}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <h1 className="font-display text-5xl font-medium">{t({ en: 'Log in', sw: 'Ingia' })}</h1>
            <p className="mt-4 text-ivory/70">
              {t({
                en: 'For approved Blackhood talent. First time? Use the email you applied with and your talent code from your welcome email.',
                sw: 'Kwa vipaji vilivyokubaliwa na Blackhood. Mara ya kwanza? Tumia barua pepe uliyoombea na namba yako ya kipaji kutoka barua pepe ya ukaribisho.',
              })}
            </p>

            {step === 'email' ? (
              <form onSubmit={sendCode} className="mt-8 space-y-5">
                <div>
                  <label className={label} htmlFor="acc-email">{t({ en: 'Email', sw: 'Barua pepe' })}</label>
                  <input id="acc-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
                </div>
                {needsCode && (
                  <div>
                    <label className={label} htmlFor="acc-code">{t({ en: 'Talent code', sw: 'Namba ya kipaji' })}</label>
                    <input id="acc-code" required placeholder="BHA-T-0001" value={talentCode} onChange={(e) => setTalentCode(e.target.value.toUpperCase())} className={`${field} font-mono uppercase`} />
                  </div>
                )}
                {error && <p className="text-sm text-red-300">{error}</p>}
                <button type="submit" disabled={busy} className={button}>
                  {busy && <Loader2 size={16} className="animate-spin" />}
                  {t({ en: 'Email me a login code', sw: 'Nitumie namba ya kuingia' })}
                </button>
              </form>
            ) : (
              <form onSubmit={verify} className="mt-8 space-y-5">
                <p className="text-sm text-ivory/70">
                  {t({ en: 'We sent a 6-digit code to', sw: 'Tumetuma namba ya tarakimu 6 kwa' })} <strong>{email}</strong>.
                </p>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  aria-label={t({ en: 'Login code', sw: 'Namba ya kuingia' })}
                  className={`${field} text-center font-mono text-2xl tracking-[0.5em]`}
                />
                {error && <p className="text-sm text-red-300">{error}</p>}
                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={busy || otp.length !== 6} className={button}>
                    {busy && <Loader2 size={16} className="animate-spin" />}
                    {t({ en: 'Log in', sw: 'Ingia' })}
                  </button>
                  <button type="button" onClick={() => { setStep('email'); setError('') }} className="text-sm text-ivory/60 underline hover:text-gold">
                    {t({ en: 'Use a different email', sw: 'Tumia barua pepe nyingine' })}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
