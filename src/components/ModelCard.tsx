import { ArrowUpRight } from 'lucide-react'
import type { Model } from '../data/models'

interface ModelCardProps {
  model: Model
  onSelect?: (model: Model) => void
}

export default function ModelCard({ model, onSelect }: ModelCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(model)}
      className="group text-left w-full"
      aria-label={`View profile for ${model.name}`}
    >
      <div className="img-zoom relative aspect-[3/4] bg-charcoal">
        <img
          src={model.image}
          alt={`Portrait of ${model.name}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center bg-cream/90 text-ink opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight size={16} />
        </span>
        {model.featured && (
          <span className="absolute top-3 left-3 eyebrow bg-ink/80 text-cream px-2.5 py-1 text-[10px]">
            Featured
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg text-ink">{model.name}</h3>
          <p className="text-sm text-ink/60">
            {model.location} · {model.height}
          </p>
        </div>
        <span className="text-xs uppercase tracking-widest2 text-gold-dark mt-1">
          {model.category}
        </span>
      </div>
    </button>
  )
}
