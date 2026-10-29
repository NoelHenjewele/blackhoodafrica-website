import { useState, type FormEvent } from 'react'
import { CheckCircle2, UploadCloud } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import WhatsAppButton from '../components/ui/WhatsAppButton'

interface FormValues {
  fullName: string
  dob: string
  gender: string
  city: string
  phone: string
  email: string
  height: string
  experience: string
  socialLink: string
  motivation: string
  consent: boolean
}

const initialValues: FormValues = {
  fullName: '',
  dob: '',
  gender: '',
  city: '',
  phone: '',
  email: '',
  height: '',
  experience: '',
  socialLink: '',
  motivation: '',
  consent: false,
}

type Errors = Partial<Record<keyof FormValues, string>>

function calculateAge(dob: string): number | null {
  if (!dob) return null
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function ApplyPage() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [fileName, setFileName] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const validate = (): Errors => {
    const next: Errors = {}
    if (!values.fullName.trim()) next.fullName = 'Please enter your full name.'
    if (!values.dob) {
      next.dob = 'Please enter your date of birth.'
    } else {
      const age = calculateAge(values.dob)
      if (age === null || age < 16) next.dob = 'Applicants must be at least 16 years old.'
    }
    if (!values.gender) next.gender = 'Please select a gender.'
    if (!values.city.trim()) next.city = 'Please enter your city or region.'
    if (!values.phone.trim()) {
      next.phone = 'Please enter a phone number.'
    } else if (!/^[+0-9\s()-]{7,}$/.test(values.phone.trim())) {
      next.phone = 'Please enter a valid phone number.'
    }
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }
    if (!values.height.trim()) next.height = 'Please enter your height.'
    if (!values.experience) next.experience = 'Please select your experience level.'
    if (!values.motivation.trim() || values.motivation.trim().length < 20) {
      next.motivation = 'Please tell us a little more (at least 20 characters).'
    }
    if (!values.consent) next.consent = 'You must agree before submitting your application.'
    return next
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const inputClass = (field: keyof FormValues) =>
    `w-full border bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-gold/60 transition-colors ${
      errors[field] ? 'border-red-400' : 'border-ink/15'
    }`

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center pt-32 pb-20">
        <div className="container-editorial max-w-2xl text-center mx-auto flex flex-col items-center">
          <CheckCircle2 size={52} className="text-gold" strokeWidth={1.5} />
          <h1 className="mt-6 font-display text-3xl sm:text-4xl text-ink">
            Application received, {values.fullName.split(' ')[0] || 'friend'}.
          </h1>
          <p className="mt-4 text-ink/70 leading-relaxed">
            Thank you for applying to the BlackhoodAfrica Modeling Academy. Our scouting team
            reviews every application personally — you'll hear from us within 5–7 business days
            if you're a good fit. In the meantime, feel free to reach out directly on WhatsApp.
          </p>
          <WhatsAppButton
            message={`Hello BlackhoodAfrica, I just submitted my application (${values.fullName}) and wanted to follow up.`}
            label="Message Us on WhatsApp"
            className="mt-8"
          />
          <button
            type="button"
            onClick={() => {
              setValues(initialValues)
              setErrors({})
              setFileName('')
              setSubmitted(false)
            }}
            className="mt-6 text-sm text-ink/50 underline hover:text-ink transition-colors"
          >
            Submit another application
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-40 pb-24 sm:pt-48 sm:pb-32">
      <div className="container-editorial">
        <Reveal>
          <SectionHeading
            eyebrow="Apply to Join"
            title="Start your BlackhoodAfrica application."
            description="Tell us about yourself. There's no cost to apply, and every submission is reviewed personally by our scouting team."
          />
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={handleSubmit} noValidate className="mt-14 max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-ink mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={values.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className={inputClass('fullName')}
                placeholder="e.g. Amani Joseph"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-1.5 text-xs text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-ink mb-2">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={values.dob}
                onChange={(e) => update('dob', e.target.value)}
                className={inputClass('dob')}
                aria-invalid={!!errors.dob}
                aria-describedby={errors.dob ? 'dob-error' : undefined}
              />
              {errors.dob && (
                <p id="dob-error" className="mt-1.5 text-xs text-red-500">
                  {errors.dob}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-ink mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={values.gender}
                onChange={(e) => update('gender', e.target.value)}
                className={inputClass('gender')}
                aria-invalid={!!errors.gender}
                aria-describedby={errors.gender ? 'gender-error' : undefined}
              >
                <option value="">Select…</option>
                <option value="Woman">Woman</option>
                <option value="Man">Man</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p id="gender-error" className="mt-1.5 text-xs text-red-500">
                  {errors.gender}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-ink mb-2">
                City / Region
              </label>
              <input
                id="city"
                type="text"
                value={values.city}
                onChange={(e) => update('city', e.target.value)}
                className={inputClass('city')}
                placeholder="e.g. Dar es Salaam"
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? 'city-error' : undefined}
              />
              {errors.city && (
                <p id="city-error" className="mt-1.5 text-xs text-red-500">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-ink mb-2">
                Height
              </label>
              <input
                id="height"
                type="text"
                value={values.height}
                onChange={(e) => update('height', e.target.value)}
                className={inputClass('height')}
                placeholder={`e.g. 5'9" or 175cm`}
                aria-invalid={!!errors.height}
                aria-describedby={errors.height ? 'height-error' : undefined}
              />
              {errors.height && (
                <p id="height-error" className="mt-1.5 text-xs text-red-500">
                  {errors.height}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-ink mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={values.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass('phone')}
                placeholder="e.g. +255 7XX XXX XXX"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1.5 text-xs text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                Email <span className="text-ink/40 font-normal">(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass('email')}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="experience" className="block text-sm font-medium text-ink mb-2">
                Experience Level
              </label>
              <select
                id="experience"
                value={values.experience}
                onChange={(e) => update('experience', e.target.value)}
                className={inputClass('experience')}
                aria-invalid={!!errors.experience}
                aria-describedby={errors.experience ? 'experience-error' : undefined}
              >
                <option value="">Select…</option>
                <option value="New Face">New Face — no prior experience</option>
                <option value="Developing">Developing — some shoots or shows</option>
                <option value="Professional">Professional — currently working</option>
              </select>
              {errors.experience && (
                <p id="experience-error" className="mt-1.5 text-xs text-red-500">
                  {errors.experience}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="socialLink" className="block text-sm font-medium text-ink mb-2">
                Instagram or TikTok Link <span className="text-ink/40 font-normal">(optional)</span>
              </label>
              <input
                id="socialLink"
                type="text"
                value={values.socialLink}
                onChange={(e) => update('socialLink', e.target.value)}
                className={inputClass('socialLink')}
                placeholder="https://instagram.com/yourname"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="motivation" className="block text-sm font-medium text-ink mb-2">
                Why do you want to join BlackhoodAfrica?
              </label>
              <textarea
                id="motivation"
                value={values.motivation}
                onChange={(e) => update('motivation', e.target.value)}
                rows={5}
                className={inputClass('motivation')}
                placeholder="Tell us about yourself and what draws you to modeling…"
                aria-invalid={!!errors.motivation}
                aria-describedby={errors.motivation ? 'motivation-error' : undefined}
              />
              {errors.motivation && (
                <p id="motivation-error" className="mt-1.5 text-xs text-red-500">
                  {errors.motivation}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <span className="block text-sm font-medium text-ink mb-2">
                Portfolio Images <span className="text-ink/40 font-normal">(optional)</span>
              </span>
              <label
                htmlFor="portfolio"
                className="flex flex-col items-center justify-center gap-2 border border-dashed border-ink/25 bg-white/40 px-6 py-10 text-center cursor-pointer hover:border-gold transition-colors duration-300"
              >
                <UploadCloud size={26} className="text-gold-dark" strokeWidth={1.5} />
                <span className="text-sm text-ink/70">
                  {fileName ? fileName : 'Click to select photos, or drag them here'}
                </span>
                <span className="text-xs text-ink/40">JPG or PNG, up to 10MB each</span>
                <input
                  id="portfolio"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const files = e.target.files
                    if (files && files.length > 0) {
                      setFileName(
                        files.length === 1 ? files[0].name : `${files.length} files selected`,
                      )
                    }
                  }}
                />
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 text-sm text-ink/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.consent}
                  onChange={(e) => update('consent', e.target.checked)}
                  className="mt-1 h-4 w-4 accent-gold shrink-0"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                />
                <span>
                  I confirm the information provided is accurate and I consent to BlackhoodAfrica
                  contacting me about my application and future opportunities.
                </span>
              </label>
              {errors.consent && (
                <p id="consent-error" className="mt-1.5 text-xs text-red-500">
                  {errors.consent}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
              <button type="submit" className="btn btn-primary">
                Submit Application
              </button>
              <WhatsAppButton
                message="Hello BlackhoodAfrica, I'd like to apply but would prefer to share my details over WhatsApp."
                label="Apply via WhatsApp Instead"
                variant="solid"
              />
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
