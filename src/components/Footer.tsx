import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { site, whatsappLink } from '../config/site'
import { useLang } from '../i18n'

const columns = [
  {
    title: { en: 'Agency', sw: 'Wakala' },
    links: [
      { to: '/talent', label: { en: 'Talent boards', sw: 'Orodha ya vipaji' } },
      { to: '/clients', label: { en: 'For brands', sw: 'Kwa makampuni' } },
      { to: '/castings', label: { en: 'Castings', sw: 'Usaili' } },
    ],
  },
  {
    title: { en: 'Academy', sw: 'Chuo' },
    links: [
      { to: '/academy', label: { en: 'Programmes', sw: 'Programu' } },
      { to: '/apply', label: { en: 'Apply to join', sw: 'Omba kujiunga' } },
      { to: '/parents', label: { en: "Parents' guide", sw: 'Mwongozo kwa wazazi' } },
    ],
  },
  {
    title: { en: 'Blackhood', sw: 'Blackhood' },
    links: [
      { to: '/about', label: { en: 'About us', sw: 'Kuhusu sisi' } },
      { to: '/stories', label: { en: 'Success stories', sw: 'Hadithi za mafanikio' } },
      { to: '/trust', label: { en: 'Our promise', sw: 'Ahadi yetu' } },
      { to: '/faq', label: { en: 'FAQ', sw: 'Maswali' } },
      { to: '/verify', label: { en: 'Is it really us?', sw: 'Ni sisi kweli?' } },
    ],
  },
]

const socials = [
  { href: site.socials.instagram, label: 'Instagram' },
  { href: site.socials.tiktok, label: 'TikTok' },
  { href: site.socials.facebook, label: 'Facebook' },
]

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <img src="/brand/logo-white.png" alt="Blackhood Africa" className="h-12 w-auto" />
            <p className="mt-6 max-w-xs font-display text-2xl italic text-gold">{t(site.promise)}</p>
            <p className="mt-4 flex items-center gap-2 text-sm text-ivory/60">
              <MapPin size={16} /> {site.city}, Tanzania
            </p>
            <a href={`tel:+${site.whatsappNumber}`} className="mt-2 flex items-center gap-2 text-sm text-ivory/60 hover:text-gold">
              <Phone size={16} /> {site.phoneDisplay}
            </a>
            <a
              href={whatsappLink('Hello Blackhood Africa')}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-ink"
            >
              <MessageCircle size={16} /> {t({ en: 'Chat on WhatsApp', sw: 'Ongea nasi WhatsApp' })}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title.en}>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone">{t(col.title)}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-sm text-ivory/80 hover:text-gold">
                        {t(l.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone">{t({ en: 'Follow', sw: 'Tufuate' })}</p>
              <ul className="mt-5 space-y-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="text-sm text-ivory/80 hover:text-gold">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-ivory/50">@blackhoodafrica</p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ivory/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Blackhood Africa. {t({ en: 'All rights reserved.', sw: 'Haki zote zimehifadhiwa.' })}
          </p>
          <p>{t(site.feeLine)}</p>
        </div>
      </div>
    </footer>
  )
}
