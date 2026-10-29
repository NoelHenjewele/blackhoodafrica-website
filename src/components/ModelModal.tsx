import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { Model } from '../data/models'
import WhatsAppButton from './ui/WhatsAppButton'

interface ModelModalProps {
  model: Model
  onClose: () => void
}

export default function ModelModal({ model, onClose }: ModelModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const message = `Hello BlackhoodAfrica, I would like to enquire about ${model.name}.`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${model.name} profile`}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
    >
      <button
        type="button"
        aria-label="Close profile"
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-cream grid grid-cols-1 sm:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center bg-ink/80 text-cream hover:bg-gold hover:text-ink transition-colors duration-300"
        >
          <X size={18} />
        </button>
        <div className="aspect-[3/4] sm:aspect-auto sm:h-full bg-charcoal">
          <img
            src={model.image}
            alt={`Portrait of ${model.name}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-7 sm:p-9 flex flex-col">
          <span className="eyebrow">{model.category}</span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl text-ink">{model.name}</h2>
          <p className="mt-2 text-sm text-ink/60">{model.location}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-sm border-y border-ink/10 py-6">
            <div>
              <dt className="text-ink/50 uppercase tracking-wide text-xs">Height</dt>
              <dd className="mt-1 text-ink">{model.height}</dd>
            </div>
            <div>
              <dt className="text-ink/50 uppercase tracking-wide text-xs">Experience</dt>
              <dd className="mt-1 text-ink">{model.experience}</dd>
            </div>
            <div>
              <dt className="text-ink/50 uppercase tracking-wide text-xs">Location</dt>
              <dd className="mt-1 text-ink">{model.location}</dd>
            </div>
            <div>
              <dt className="text-ink/50 uppercase tracking-wide text-xs">Category</dt>
              <dd className="mt-1 text-ink">{model.category}</dd>
            </div>
          </dl>

          <p className="mt-6 text-sm sm:text-base leading-relaxed text-ink/70">{model.bio}</p>

          <div className="mt-auto pt-8">
            <WhatsAppButton message={message} label="Enquire via WhatsApp" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
