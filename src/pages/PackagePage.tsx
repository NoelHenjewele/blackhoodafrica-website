import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useTalent } from '../data/talent'
import { TalentCard } from '../components/TalentCard'
import { useLang } from '../i18n'
import NotFound from './NotFound'

// Private client package: /p/<token>. Shows only the models the team picked for this brand.
export default function PackagePage() {
  const { token = '' } = useParams()
  const { t } = useLang()
  const [talent, loaded] = useTalent()
  const [pkg, setPkg] = useState<{ title: string; note: string | null; slugs: string[] } | null | undefined>(undefined)

  useEffect(() => {
    fetch(`/api/talent?package=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((r) => setPkg(r.ok ? r : null))
      .catch(() => setPkg(null))
  }, [token])

  if (pkg === null) return <NotFound />
  if (pkg === undefined || !loaded) {
    return (
      <section className="grid min-h-[70vh] place-items-center pt-20">
        <Loader2 className="animate-spin text-gold" />
      </section>
    )
  }

  const models = pkg.slugs.map((s) => talent.find((p) => p.slug === s)).filter((p) => p !== undefined)
  const names = models.map((m) => m.name).join(', ')

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 lg:px-10 lg:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {t({ en: 'Selected for you by Blackhood Africa', sw: 'Wamechaguliwa kwa ajili yako na Blackhood Africa' })}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl">{pkg.title}</h1>
          {pkg.note && <p className="mt-6 max-w-2xl whitespace-pre-line text-lg text-ivory/85">{pkg.note}</p>}
        </div>
      </section>

      <section className="border-t border-ivory/10">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10">
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {models.map((p) => (
              <TalentCard key={p.slug} person={p} />
            ))}
          </div>
          {models.length === 0 && (
            <p className="text-ivory/80">{t({ en: 'These models are no longer listed.', sw: 'Wanamitindo hawa hawapo tena.' })}</p>
          )}

          <div className="mt-14 flex flex-col items-start gap-4 border-t border-ivory/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-3xl">{t({ en: 'Like this selection?', sw: 'Umependa uchaguzi huu?' })}</p>
            <Link
              to={`/clients?model=${encodeURIComponent(`${pkg.title}: ${names}`)}#brief`}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory"
            >
              {t({ en: 'Request these models', sw: 'Omba wanamitindo hawa' })} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
