import Castings from '../components/home/Castings'
import { useLang } from '../i18n'

export default function CastingsPage() {
  const { t } = useLang()

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-10 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {t({ en: 'Castings & open calls', sw: 'Usaili na nafasi za wazi' })}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({ en: 'Your next opportunity starts here.', sw: 'Fursa yako ijayo inaanzia hapa.' })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/70">
            {t({
              en: 'Open castings, scouting days and model searches across Tanzania. Every casting we post is real, free to attend, and run by the Blackhood team.',
              sw: 'Usaili wa wazi, siku za kutafuta vipaji na mashindano ya wanamitindo kote Tanzania. Kila usaili tunaoutangaza ni halisi, ni bure kuhudhuria, na unaendeshwa na timu ya Blackhood.',
            })}
          </p>
        </div>
      </section>
      <Castings standalone />
    </>
  )
}
