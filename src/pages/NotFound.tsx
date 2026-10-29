import { Link } from 'react-router-dom'
import { useLang } from '../i18n'

export default function NotFound() {
  const { t } = useLang()

  return (
    <section className="grid min-h-[70vh] place-items-center px-5 pt-20 text-center">
      <div>
        <p className="font-display text-7xl text-gold lining-nums">404</p>
        <h1 className="mt-4 font-display text-4xl">{t({ en: "This page isn't on the board.", sw: 'Ukurasa huu haupo.' })}</h1>
        <Link to="/" className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:text-ivory">
          {t({ en: 'Back to home →', sw: 'Rudi mwanzo →' })}
        </Link>
      </div>
    </section>
  )
}
