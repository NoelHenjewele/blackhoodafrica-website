import { useState, type FormEvent } from 'react'
import { MapPin, Clock, Phone, CheckCircle2 } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import { InstagramIcon, TikTokIcon } from '../components/ui/BrandIcons'
import { WHATSAPP_DISPLAY, INSTAGRAM_URL, TIKTOK_URL, buildWhatsAppLink } from '../utils/whatsapp'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <section className="pt-40 pb-16 sm:pt-48 sm:pb-20">
        <div className="container-editorial">
          <Reveal>
            <SectionHeading
              eyebrow="Contact"
              title="We'd love to hear from you."
              description="Whether you're an aspiring model, a brand, or simply curious about BlackhoodAfrica — reach out and our team will respond promptly."
            />
          </Reveal>
        </div>
      </section>

      <section className="container-editorial pb-24 sm:pb-32 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        <Reveal className="lg:col-span-2 flex flex-col gap-8">
          <div className="border border-ink/10 p-7 sm:p-8">
            <Phone size={22} className="text-gold-dark" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-lg text-ink">WhatsApp Business</h3>
            <p className="mt-2 text-sm text-ink/60">{WHATSAPP_DISPLAY}</p>
            <WhatsAppButton
              message="Hello BlackhoodAfrica, I have a question."
              label="Start a Chat"
              className="mt-5 w-full sm:w-auto"
            />
          </div>

          <div className="border border-ink/10 p-7 sm:p-8">
            <MapPin size={22} className="text-gold-dark" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-lg text-ink">Location</h3>
            <p className="mt-2 text-sm text-ink/60 leading-relaxed">
              Dar es Salaam, Tanzania
              <br />
              Scouting sessions also held in Arusha, Mwanza &amp; Zanzibar.
            </p>
          </div>

          <div className="border border-ink/10 p-7 sm:p-8">
            <Clock size={22} className="text-gold-dark" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-lg text-ink">Opening Hours</h3>
            <p className="mt-2 text-sm text-ink/60 leading-relaxed">
              Monday – Friday: 9:00 – 18:00
              <br />
              Saturday: 10:00 – 14:00
              <br />
              Sunday: Closed
            </p>
          </div>

          <div className="border border-ink/10 p-7 sm:p-8">
            <h3 className="font-display text-lg text-ink">Follow Us</h3>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-ink/70 hover:text-gold-dark transition-colors"
              >
                <InstagramIcon size={18} /> @blackhoodafrica
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-ink/70 hover:text-gold-dark transition-colors"
              >
                <TikTokIcon size={18} /> @blackhoodafrica
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-3">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center border border-ink/10 p-10 sm:p-16">
              <CheckCircle2 size={44} className="text-gold" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-2xl text-ink">
                Thank you{name ? `, ${name.split(' ')[0]}` : ''}.
              </h3>
              <p className="mt-3 text-ink/60 max-w-sm leading-relaxed">
                Your message has been received. Our team will get back to you shortly — or reach
                us instantly on WhatsApp below.
              </p>
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline mt-7"
              >
                Message Us on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="contact-name" className="block text-sm font-medium text-ink mb-2">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-gold/60"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-ink mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-gold/60"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-ink mb-2">
                  Phone <span className="text-ink/40 font-normal">(optional)</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  className="w-full border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-gold/60"
                  placeholder="+255 7XX XXX XXX"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-subject" className="block text-sm font-medium text-ink mb-2">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  className="w-full border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-gold/60"
                  placeholder="What's this about?"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className="block text-sm font-medium text-ink mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  className="w-full border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-gold/60"
                  placeholder="Tell us how we can help…"
                />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </section>
    </>
  )
}
