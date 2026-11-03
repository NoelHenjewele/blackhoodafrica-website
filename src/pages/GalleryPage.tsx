import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, X } from 'lucide-react'
import { photos, videos } from '../data/gallery'
import { useLang } from '../i18n'

export default function GalleryPage() {
  const { t } = useLang()
  const [playing, setPlaying] = useState<string | null>(null)
  const [photo, setPhoto] = useState<number | null>(null)

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t({ en: 'Gallery', sw: 'Picha na video' })}</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Inside the training.', sw: 'Ndani ya mafunzo.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'Runway, posing and camera sessions from our past intakes. See how Blackhood talent is trained before they ever step in front of a client.',
              sw: 'Mazoezi ya jukwaa, pozi na kamera kutoka awamu zetu zilizopita. Ona jinsi vipaji vya Blackhood vinavyofunzwa kabla ya kukutana na mteja.',
            })}
          </p>
        </div>
      </section>

      {videos.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
            <h2 className="font-display text-4xl font-medium">{t({ en: 'Training videos', sw: 'Video za mafunzo' })}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {videos.map((v) => v.tiktokId ? (
                <figure key={v.tiktokId}>
                  <div className="relative mx-auto aspect-[9/16] max-w-[340px] overflow-hidden border border-white/10 bg-ink-soft">
                    <iframe
                      src={`https://www.tiktok.com/player/v1/${v.tiktokId}?rel=0&description=0&music_info=0`}
                      title={t(v.title)}
                      loading="lazy"
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                  <figcaption className="mx-auto mt-3 max-w-[340px] text-sm text-ivory/80">
                    {t(v.title)}
                    {v.intake && <span className="ml-2 text-stone">· {v.intake}</span>}
                  </figcaption>
                </figure>
              ) : v.youtubeId && (
                <figure key={v.youtubeId}>
                  <div className="relative aspect-video overflow-hidden border border-white/10 bg-ink-soft">
                    {playing === v.youtubeId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
                        title={t(v.title)}
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <button type="button" onClick={() => setPlaying(v.youtubeId!)} className="group absolute inset-0" aria-label={t(v.title)}>
                        <img src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                        <span className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-ink">
                          <Play size={22} fill="currentColor" />
                        </span>
                      </button>
                    )}
                  </div>
                  <figcaption className="mt-3 text-sm text-ivory/80">
                    {t(v.title)}
                    {v.intake && <span className="ml-2 text-stone">· {v.intake}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-white/10 bg-ink-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
          <h2 className="font-display text-4xl font-medium">{t({ en: 'Photos', sw: 'Picha' })}</h2>
          <div className="mt-8 columns-2 gap-3 md:columns-3 lg:columns-4">
            {photos.map((p, i) => (
              <button key={p.src} type="button" onClick={() => setPhoto(i)} className="mb-3 block w-full overflow-hidden border border-white/10">
                <img src={p.src} alt={p.caption ? t(p.caption) : ''} loading="lazy" className="w-full transition-transform duration-500 hover:scale-105" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-16 sm:flex-row sm:items-center lg:px-10">
          <p className="font-display text-3xl">{t({ en: 'Want to train with us next intake?', sw: 'Ungependa kufunzwa nasi awamu ijayo?' })}</p>
          <Link to="/academy" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory">
            {t({ en: 'See the Academy', sw: 'Tazama Chuo' })} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {photo !== null && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/95 p-5" onClick={() => setPhoto(null)}>
          <button type="button" className="absolute right-5 top-5 text-ivory" aria-label="Close">
            <X size={28} />
          </button>
          <figure className="max-h-full" onClick={(e) => e.stopPropagation()}>
            <img src={photos[photo].src} alt="" className="max-h-[80vh] w-auto" />
            {photos[photo].caption && <figcaption className="mt-3 text-center text-ivory/80">{t(photos[photo].caption!)}</figcaption>}
          </figure>
        </div>
      )}
    </>
  )
}
