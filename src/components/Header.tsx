import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Moon, ShieldCheck, Sun, UserRound, X } from 'lucide-react'
import { useAuthStatus } from '../auth'
import { useLang } from '../i18n'

const nav = [
  { to: '/talent', label: { en: 'Talent', sw: 'Vipaji' } },
  { to: '/clients', label: { en: 'For brands', sw: 'Kwa makampuni' } },
  { to: '/academy', label: { en: 'Academy', sw: 'Chuo' } },
  { to: '/castings', label: { en: 'Castings', sw: 'Usaili' } },  { to: '/gallery', label: { en: 'Gallery', sw: 'Picha' } },
  { to: '/about', label: { en: 'About', sw: 'Kuhusu' } },
]

// Light / dark: follows the phone until the visitor taps this; the choice is remembered (see index.html).
function ThemeToggle() {
  const current = () =>
    (document.documentElement.dataset.theme as 'light' | 'dark' | undefined) ??
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  const [theme, setTheme] = useState(current)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const sync = () => setTheme(current())
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('bha-theme', next)
    } catch {
      // private mode: works for this visit only
    }
    setTheme(next)
  }

  const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-ivory/20 text-ivory/85 transition-colors hover:border-gold hover:text-gold"
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}

function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex rounded-full border border-ivory/20 p-0.5 text-[11px] font-semibold" role="group" aria-label="Language">
      {(['en', 'sw'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase tracking-[0.1em] transition-colors ${
            lang === l ? 'bg-ivory text-ink' : 'text-ivory/85 hover:text-gold'
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
  const { loggedIn, isAdmin } = useAuthStatus()
  const accountLabel = loggedIn ? t({ en: 'My account', sw: 'Akaunti yangu' }) : t({ en: 'Log in', sw: 'Ingia' })

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-ink/95 backdrop-blur border-b border-ivory/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link to="/" aria-label="Blackhood Africa home" onClick={() => setOpen(false)}>
          <img src="/brand/logo-white.webp" width={420} height={102} alt="Blackhood Africa" className="only-dark h-9 w-auto lg:h-10" />
          <img src="/brand/logo-black.webp" width={420} height={102} alt="Blackhood Africa" className="only-light h-9 w-auto lg:h-10" />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-[13px] font-medium uppercase tracking-[0.14em] transition-colors hover:text-gold ${
                  isActive ? 'text-gold' : 'text-ivory/90'
                }`
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle />
          <ThemeToggle />
          {isAdmin && (
            <Link
              to="/admin"
              title="Admin: profile review"
              aria-label="Admin: profile review"
              className="grid h-9 w-9 place-items-center rounded-full border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              <ShieldCheck size={16} />
            </Link>
          )}
          <Link
            to="/account"
            title={accountLabel}
            aria-label={accountLabel}
            className="relative grid h-9 w-9 place-items-center rounded-full border border-ivory/20 text-ivory/90 transition-colors hover:border-gold hover:text-gold"
          >
            <UserRound size={17} />
            {loggedIn && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-gold" />}
          </Link>
          <Link
            to="/clients"
            className="hidden whitespace-nowrap rounded-full bg-gold px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory sm:inline-block"
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
        <nav className="border-t border-ivory/10 bg-ink px-5 pb-8 pt-4 xl:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-ivory/5 py-4 font-display text-2xl text-ivory"
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
