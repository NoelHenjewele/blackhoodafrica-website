import { useEffect, useState, type FormEvent } from 'react'
import { ShieldCheck } from 'lucide-react'
import { supabase } from '../config/supabase'
import { site } from '../config/site'
import { useLang } from '../i18n'

// Parent / guardian consent for under-18 models, signed on the model's own account page.
type Consent = { parent_name: string; relationship: string; phone: string; signed_name: string; signed_at: string }

const field = 'w-full border border-ivory/15 bg-ink-soft px-4 py-3 text-ivory placeholder:text-ivory/50 focus:border-gold focus:outline-none'

export default function ParentConsent({ profileId, modelName }: { profileId: string; modelName: string }) {
  const { t } = useLang()
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('parent_consents')
      .select('parent_name, relationship, phone, signed_name, signed_at')
      .eq('profile_id', profileId)
      .maybeSingle()
      .then(({ data }) => setConsent(data ?? null))
  }, [profileId])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const d = new FormData(e.currentTarget)
    const get = (k: string) => String(d.get(k) ?? '').trim()
    if (get('signed_name').toLowerCase() !== get('parent_name').toLowerCase()) {
      return setError(t({ en: 'Please type the same full name as your signature.', sw: 'Tafadhali andika jina kamili lile lile kama sahihi yako.' }))
    }
    setSaving(true)
    const row = { profile_id: profileId, parent_name: get('parent_name'), relationship: get('relationship'), phone: get('phone'), signed_name: get('signed_name'), signed_at: new Date().toISOString() }
    const { error } = await supabase.from('parent_consents').upsert(row)
    setSaving(false)
    if (error) return setError(t({ en: 'That didn’t save. Please try again.', sw: 'Haikuhifadhiwa. Tafadhali jaribu tena.' }))
    setConsent(row)
  }

  if (consent === undefined) return null

  const points = [
    t({ en: `${modelName}'s photos and first name may be shown on the Blackhood Africa website and comp card.`, sw: `Picha na jina la kwanza la ${modelName} vinaweza kuonyeshwa kwenye tovuti ya Blackhood Africa na comp card.` }),
    t({ en: 'Blackhood may put them forward for castings and jobs. I will be told about every job before it is accepted.', sw: 'Blackhood inaweza kuwapendekeza kwa usaili na kazi. Nitaarifiwa kuhusu kila kazi kabla haijakubaliwa.' }),
    t({ en: 'A parent or guardian, or a Blackhood chaperone, will be present at every casting and job.', sw: 'Mzazi au mlezi, au msimamizi wa Blackhood, atakuwepo kwenye kila usaili na kazi.' }),
    t({ en: `I can withdraw this consent at any time by contacting Blackhood on ${site.phoneDisplay}.`, sw: `Ninaweza kuondoa ridhaa hii wakati wowote kwa kuwasiliana na Blackhood kupitia ${site.phoneDisplay}.` }),
  ]

  return (
    <div className="mt-12 border-t border-ivory/10 pt-10">
      <h2 className="flex items-center gap-2 font-display text-3xl">
        <ShieldCheck className="text-gold" size={26} /> {t({ en: 'Parent / guardian consent', sw: 'Ridhaa ya mzazi / mlezi' })}
      </h2>

      {consent ? (
        <p className="mt-4 border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-200">
          {t({ en: 'Signed by', sw: 'Imesainiwa na' })} <strong>{consent.parent_name}</strong> ({consent.relationship}){' '}
          {t({ en: 'on', sw: 'tarehe' })} {new Date(consent.signed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-ivory/85">
            {t({
              en: 'Because this model is under 18, a parent or guardian must read and sign this before the profile can go live. Please hand the phone to your parent or guardian.',
              sw: 'Kwa kuwa mwanamitindo huyu yuko chini ya miaka 18, mzazi au mlezi lazima asome na kusaini hii kabla wasifu haujaonekana. Tafadhali mpe mzazi au mlezi wako simu.',
            })}
          </p>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-ivory/90">
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <form onSubmit={onSubmit} className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
            <input name="parent_name" required maxLength={80} placeholder={t({ en: 'Parent / guardian full name', sw: 'Jina kamili la mzazi / mlezi' })} className={`${field} sm:col-span-2`} />
            <input name="relationship" required maxLength={40} placeholder={t({ en: 'Relationship (e.g. Mother)', sw: 'Uhusiano (mf. Mama)' })} className={field} />
            <input name="phone" required type="tel" maxLength={30} placeholder={t({ en: 'Phone (WhatsApp)', sw: 'Simu (WhatsApp)' })} className={field} />
            <label className="flex items-start gap-3 text-sm text-ivory/90 sm:col-span-2">
              <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#c9a45c]" />
              {t({ en: 'I am the parent or legal guardian and I agree to all of the above.', sw: 'Mimi ni mzazi au mlezi halali na ninakubali yote hapo juu.' })}
            </label>
            <input name="signed_name" required maxLength={80} placeholder={t({ en: 'Type your full name again as your signature', sw: 'Andika jina lako kamili tena kama sahihi' })} className={`${field} font-display text-lg italic sm:col-span-2`} />
            {error && <p className="text-sm text-red-300 sm:col-span-2">{error}</p>}
            <button type="submit" disabled={saving} className="rounded-full bg-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory disabled:opacity-50 sm:col-span-2 sm:justify-self-start">
              {t({ en: 'Sign consent', sw: 'Saini ridhaa' })}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
