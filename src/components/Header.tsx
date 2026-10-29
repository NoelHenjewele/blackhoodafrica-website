import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const nav = [
  { to: '/talent', label: 'Talent' },
  { to: '/clients', label: 'For brands' },
  { to: '/academy', label: 'Academy' },
  { to: '/castings', label: 'Castings' },
  { to: '/trust', label: 'Our promise' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

        <nav className="hidden items-center gap-8 lg:flex">
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/clients"
            className="hidden rounded-full bg-gold px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ivory sm:inline-block"
          >
            Book talent
          </Link>
          <button
            type="button"
            className="p-2 text-ivory lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-ink px-5 pb-8 pt-4 lg:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-4 font-display text-2xl text-ivory"
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/clients"
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-full bg-gold py-3.5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-ink"
          >
            Book talent
          </Link>
        </nav>
      )}
    </header>
  )
}
