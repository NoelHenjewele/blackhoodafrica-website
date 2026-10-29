import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import OpportunityCard from '../components/OpportunityCard'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import { opportunities } from '../data/opportunities'

export default function OpportunitiesPage() {
  return (
    <>
      <section className="pt-40 pb-16 sm:pt-48 sm:pb-20">
        <div className="container-editorial">
          <Reveal>
            <SectionHeading
              eyebrow="Opportunities"
              title="Castings, bookings, and open calls."
              description="A running list of current opportunities for BlackhoodAfrica talent. Tap any listing to apply directly via WhatsApp — quick, simple, and personal."
            />
          </Reveal>
        </div>
      </section>

      <section className="container-editorial pb-24 sm:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {opportunities.map((opportunity, i) => (
            <Reveal key={opportunity.id} delay={(i % 3) * 90}>
              <OpportunityCard opportunity={opportunity} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-bone py-20 sm:py-24">
        <div className="container-editorial text-center flex flex-col items-center">
          <Reveal>
            <span className="eyebrow">Don't See a Fit?</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl max-w-xl text-balance">
              Send us your details and we'll reach out when a match comes up.
            </h2>
            <WhatsAppButton
              message="Hello BlackhoodAfrica, I'd like to be considered for future opportunities."
              label="Message Us on WhatsApp"
              className="mt-8"
            />
          </Reveal>
        </div>
      </section>
    </>
  )
}
