import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { buildWhatsAppLink } from '../../utils/whatsapp'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/academy', label: 'Academy' },
  { to: '/talent', label: 'Talent' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/contact', label: 'Contact' },
]

// Routes with a full-bleed dark hero at the top, where the header can start
// transparent. Every other route has a light background up top, so the
// header needs to render solid from the start to stay legible.
const DARK_HERO_ROUTES = ['/', '/about', '/academy']

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const hasDarkHero = DARK_HERO_ROUTES.includes(pathname)
  const solid = scrolled || open || !hasDarkHero

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide uppercase transition-colors duration-300 ${
      isActive ? 'text-gold' : 'text-current hover:text-gold'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid ? 'bg-cream/95 backdrop-blur-sm text-ink shadow-sm' : 'bg-transparent text-cream'
      }`}
    >
      <div className="container-editorial flex items-center justify-between py-4">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <img
            src={solid ? '/images/logo.png' : '/images/logo-white.png'}
            alt="BlackhoodAfrica Modeling Academy"
            className="h-8 sm:h-9 w-auto transition-opacity duration-300"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={buildWhatsAppLink('Hello BlackhoodAfrica, I would like to know more.')}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn ${solid ? 'btn-outline' : 'btn-outline-light'} !py-2.5 !px-5 text-xs`}
          >
            WhatsApp
          </a>
          <Link to="/apply" className="btn btn-gold !py-2.5 !px-5 text-xs">
            Apply to Join
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 -mr-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-cream text-ink border-t border-ink/10">
          <nav className="container-editorial flex flex-col py-6 gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-base border-b border-ink/5 uppercase tracking-wide ${
                    isActive ? 'text-gold' : 'text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-3 mt-5">
              <a
                href={buildWhatsAppLink('Hello BlackhoodAfrica, I would like to know more.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full"
                onClick={() => setOpen(false)}
              >
                WhatsApp Us
              </a>
              <Link to="/apply" className="btn btn-gold w-full" onClick={() => setOpen(false)}>
                Apply to Join
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
