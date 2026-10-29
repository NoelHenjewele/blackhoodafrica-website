import { useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { useLang } from '../../i18n'

const TIKTOK_HANDLE = 'blackhoodafrica'

// TikTok's public creator embed: shows the latest videos from the profile, no API key needed.
// The script only loads once the section scrolls into view, to keep the page light on mobile data.
export default function SocialFeed() {
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const s = document.createElement('script')
    s.src = 'https://www.tiktok.com/embed.js'
    s.async = true
    document.body.appendChild(s)
    return () => {
      s.remove()
    }
  }, [visible])

  return (
    <section ref={ref} className="border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-10 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">@blackhoodafrica</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
            {t({ en: 'Follow the journey.', sw: 'Fuatilia safari yetu.' })}
          </h2>
          <p className="mt-6 max-w-md text-ivory/70">
            {t({
              en: 'Castings, behind-the-scenes and walk tips, posted every week.',
              sw: 'Usaili, nyuma ya pazia na mafunzo ya mwendo, kila wiki.',
            })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { href: site.socials.tiktok, label: 'TikTok' },
              { href: site.socials.instagram, label: 'Instagram' },
              { href: site.socials.facebook, label: 'Facebook' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-ivory/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold hover:text-gold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="min-h-[420px] overflow-hidden rounded-sm border border-white/10 bg-ivory">
          {visible && (
            <blockquote
              className="tiktok-embed"
              cite={`https://www.tiktok.com/@${TIKTOK_HANDLE}`}
              data-unique-id={TIKTOK_HANDLE}
              data-embed-type="creator"
              style={{ maxWidth: '100%', minWidth: 288, margin: 0 }}
            >
              <section>
                <a target="_blank" rel="noreferrer" href={`https://www.tiktok.com/@${TIKTOK_HANDLE}`}>
                  @{TIKTOK_HANDLE}
                </a>
              </section>
            </blockquote>
          )}
        </div>
      </div>
    </section>
  )
}
