import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useLang } from '../i18n'

type Post = { id: string; title: string; body: string | null; photo: string | null; created_at: string }

// News & events, posted by the team on /admin.
export default function NewsPage() {
  const { t, lang } = useLang()
  const [posts, setPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    fetch('/api/talent?news=1')
      .then((r) => r.json())
      .then((r: { posts?: Post[] }) => setPosts(r.posts ?? []))
      .catch(() => setPosts([]))
  }, [])

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'sw' ? 'sw-TZ' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'News & events', sw: 'Habari na matukio' })}</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'What’s happening at Blackhood.', sw: 'Kinachoendelea Blackhood.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'Shows, campaigns, graduations and news from our talent and academy.',
              sw: 'Maonyesho, kampeni, mahafali na habari za vipaji na chuo chetu.',
            })}
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-5 py-14 lg:px-10">
          {posts === null && <Loader2 className="animate-spin text-gold" />}
          {posts?.length === 0 && (
            <p className="text-ivory/60">{t({ en: 'News is coming soon.', sw: 'Habari zinakuja hivi karibuni.' })}</p>
          )}
          <div className="space-y-16">
            {posts?.map((p) => (
              <article key={p.id}>
                {p.photo && (
                  <div className="mb-6 overflow-hidden border border-white/10">
                    <img src={p.photo} alt="" loading="lazy" className="max-h-[560px] w-full object-cover" />
                  </div>
                )}
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{date(p.created_at)}</p>
                <h2 className="mt-2 font-display text-4xl">{p.title}</h2>
                {p.body && <p className="mt-4 whitespace-pre-line text-ivory/80">{p.body}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
