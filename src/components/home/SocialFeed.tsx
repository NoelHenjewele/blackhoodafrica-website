import { site } from '../../config/site'
import { useLang } from '../../i18n'

// TikTok's live profile embed proved unreliable (blank boxes, rate-limit errors), so this links out instead.
const channels = [
  { href: site.socials.tiktok, name: 'TikTok', what: { en: 'Walk tips & behind the scenes', sw: 'Mafunzo ya mwendo na nyuma ya pazia' } },
  { href: site.socials.instagram, name: 'Instagram', what: { en: 'Portfolios & campaigns', sw: 'Albamu na kampeni' } },
  { href: site.socials.facebook, name: 'Facebook', what: { en: 'Castings & announcements', sw: 'Usaili na matangazo' } },
]

export default function SocialFeed() {
  const { t } = useLang()

  return (
    <section className="border-t border-white/10">
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
        </div>

        <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center bg-ink p-8 text-center transition-colors hover:bg-ink-soft"
            >
              <img src="/brand/monogram.png" alt="" loading="lazy" className="h-16 w-16 rounded-full" />
              <p className="mt-5 font-display text-2xl">{c.name}</p>
              <p className="mt-1 text-sm text-ivory/60">{t(c.what)}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold group-hover:text-ivory">
                {t({ en: 'Follow →', sw: 'Fuata →' })}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
