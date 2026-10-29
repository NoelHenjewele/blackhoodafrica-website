import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useLang } from '../i18n'

const nav = [
  { to: '/talent', label: { en: 'Talent', sw: 'Vipaji' } },
  { to: '/clients', label: { en: 'For brands', sw: 'Kwa makampuni' } },
  { to: '/academy', label: { en: 'Academy', sw: 'Chuo' } },
  { to: '/castings', label: { en: 'Castings', sw: 'Usaili' } },
  { to: '/trust', label: { en: 'Our promise', sw: 'Ahadi yetu' } },
  { to: '/about', label: { en: 'About', sw: 'Kuhusu' } },
]

function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex rounded-full border border-white/20 p-0.5 text-[11px] font-semibold" role="group" aria-label="Language">
      {(['en', 'sw'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase tracking-[0.1em] transition-colors ${
            lang === l ? 'bg-ivory text-ink' : 'text-ivory/70 hover:text-gold'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Header() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const bookLabel = t({ en: 'Book talent', sw: 'Ajiri kipaji' })

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-ink/95 backdrop-blur border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link to="/" aria-label="Blackhood Africa home" onClick={() => setOpen(false)}>
          <img src="/brand/logo-white.png" alt="Blackhood Africa" className="h-9 w-auto lg:h-10" />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-[13px] font-medium uppercase tracking-[0.14em] transition-colors hover:text-gold ${
                  isActive ? 'text-gold' : 'text-ivory/80'
                }`
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle />
          <Link
            to="/clients"
            className="hidden rounded-full bg-gold px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory sm:inline-block"
          >
            {bookLabel}
          </Link>
          <button
            type="button"
            className="p-2 text-ivory xl:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-ink px-5 pb-8 pt-4 xl:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-4 font-display text-2xl text-ivory"
            >
              {t(item.label)}
            </NavLink>
          ))}
          <Link
            to="/clients"
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-full bg-gold py-3.5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-ink"
          >
            {bookLabel}
          </Link>
        </nav>
      )}
    </header>
  )
}
