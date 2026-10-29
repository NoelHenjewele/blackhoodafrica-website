import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import SocialLinks from '../SocialLinks'
import { WHATSAPP_DISPLAY, buildWhatsAppLink } from '../../utils/whatsapp'

const exploreLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/academy', label: 'Academy' },
  { to: '/talent', label: 'Talent Directory' },
  { to: '/opportunities', label: 'Opportunities' },
]

const startLinks = [
  { to: '/apply', label: 'Apply to Join' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="container-editorial py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <img
              src="/images/logo-white.png"
              alt="BlackhoodAfrica Modeling Academy"
              className="h-8 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-cream/60 max-w-xs">
              A Tanzania-based modeling agency and academy discovering and developing Africa's
              next generation of professional talent.
            </p>
            <SocialLinks className="mt-6" />
          </div>

          <div>
            <h3 className="eyebrow text-cream/80">Explore</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-cream/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-cream/80">Get Started</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {startLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-cream/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-cream/80">Contact</h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-cream/70">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors duration-300"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
                <a
                  href="mailto:hello@blackhoodafrica.com"
                  className="hover:text-gold transition-colors duration-300"
                >
                  hello@blackhoodafrica.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/50 text-center sm:text-left">
            &copy; {new Date().getFullYear()} BlackhoodAfrica Modeling Academy. All rights reserved.
          </p>
          <p className="text-xs text-cream/40 text-center sm:text-right">
            Discover. Develop. Define your presence.
          </p>
        </div>
      </div>
    </footer>
  )
}
