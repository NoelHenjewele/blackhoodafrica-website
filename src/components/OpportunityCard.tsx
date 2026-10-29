import { CalendarDays, MapPin } from 'lucide-react'
import type { Opportunity } from '../data/opportunities'
import WhatsAppButton from './ui/WhatsAppButton'

interface OpportunityCardProps {
  opportunity: Opportunity
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const message = `Hello BlackhoodAfrica, I would like to apply for the opportunity: "${opportunity.title}".`

  return (
    <article className="flex flex-col justify-between border border-ink/10 bg-white/40 p-7 sm:p-8 h-full">
      <div>
        <span className="eyebrow">{opportunity.category}</span>
        <h3 className="mt-3 font-display text-xl sm:text-2xl text-ink leading-snug">
          {opportunity.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/60">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> {opportunity.location}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} /> {opportunity.deadline}
          </span>
        </div>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/70">
          {opportunity.description}
        </p>
      </div>
      <div className="mt-6">
        <WhatsAppButton message={message} label="Apply via WhatsApp" className="w-full sm:w-auto" />
      </div>
    </article>
  )
}
