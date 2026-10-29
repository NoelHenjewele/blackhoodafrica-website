import { useMemo, useState } from 'react'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import ModelCard from '../components/ModelCard'
import ModelModal from '../components/ModelModal'
import { models } from '../data/models'
import type { Model } from '../data/models'

type Filter = 'All' | 'Women' | 'Men' | 'New Faces' | 'Featured'

const filters: Filter[] = ['All', 'Women', 'Men', 'New Faces', 'Featured']

export default function TalentPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const [selected, setSelected] = useState<Model | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'All') return models
    if (filter === 'Featured') return models.filter((m) => m.featured)
    return models.filter((m) => m.category === filter)
  }, [filter])

  return (
    <>
      <section className="pt-40 pb-16 sm:pt-48 sm:pb-20">
        <div className="container-editorial">
          <Reveal>
            <SectionHeading
              eyebrow="Talent Directory"
              title="Meet the faces of BlackhoodAfrica."
              description="Browse our roster of professional models, developing talent, and fresh new faces — each trained and represented by the BlackhoodAfrica Academy."
            />
          </Reveal>

          <Reveal delay={100}>
            <div
              className="mt-10 flex flex-wrap gap-3"
              role="group"
              aria-label="Filter talent by category"
            >
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`px-5 py-2.5 text-sm uppercase tracking-wide border transition-colors duration-300 ${
                    filter === f
                      ? 'bg-ink text-cream border-ink'
                      : 'border-ink/20 text-ink/70 hover:border-ink hover:text-ink'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-editorial pb-24 sm:pb-32">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filtered.map((model, i) => (
              <Reveal key={model.id} delay={(i % 4) * 80}>
                <ModelCard model={model} onSelect={setSelected} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-ink/60 text-center py-20">No talent found in this category yet.</p>
        )}
      </section>

      {selected && <ModelModal model={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
