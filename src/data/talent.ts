import { useEffect, useState } from 'react'

export const boards = ['Women', 'Men', 'New Faces', 'Curve', 'Creators'] as const
export type Board = (typeof boards)[number]

export const boardLabels: Record<Board, { en: string; sw: string }> = {
  Women: { en: 'Women', sw: 'Wanawake' },
  Men: { en: 'Men', sw: 'Wanaume' },
  'New Faces': { en: 'New Faces', sw: 'Sura Mpya' },
  Curve: { en: 'Curve', sw: 'Curve' },
  Creators: { en: 'Creators', sw: 'Watengeneza Maudhui' },
}

export type Talent = {
  slug: string
  name: string
  boards: Board[]
  city: string
  heightCm?: number
  note?: string
  photo?: string
  gallery?: string[]
  stats?: Partial<Record<'bust' | 'waist' | 'hips' | 'shoes' | 'hair' | 'eyes', string | null>>
  instagram?: string | null
  tiktok?: string | null
  bio?: string | null
  minor?: boolean
  featured?: boolean
}

// Hand-added talent (featured proof). Approved model accounts are added automatically from /api/talent.
export const talent: Talent[] = [
  {
    slug: 'eladia-edwin',
    name: 'Eladia Edwin',
    boards: ['Women'],
    city: 'Dar es Salaam',
    note: 'Miss Kinondoni 2027–2028',
    photo: '/talent/eladia-edwin/runway-stage.jpg',
    gallery: ['/talent/eladia-edwin/runway-stage.jpg', '/talent/eladia-edwin/crowned-portrait.jpg', '/talent/eladia-edwin/crowned-with-host.jpg'],
    featured: true,
  },
]

type ApiTalent = {
  slug: string
  name: string
  board: string | null
  city?: string | null
  heightCm?: number | null
  stats?: Talent['stats']
  instagram?: string | null
  tiktok?: string | null
  bio?: string | null
  photos: string[]
  minor?: boolean
}

let cache: Talent[] | null = null

// Featured talent first, then approved profiles from model accounts.
export function useTalent() {
  const [list, setList] = useState<Talent[]>(cache ?? talent)
  // "loaded" means this visit's fresh fetch finished; a model page waits for it before saying "not found".
  const [loaded, setLoaded] = useState(false)

  // Always refresh on mount (the last result shows meanwhile), so a just-approved model appears without a reload.
  useEffect(() => {
    fetch('/api/talent')
      .then((r) => r.json())
      .then((r: { talent?: ApiTalent[] }) => {
        const live: Talent[] = (r.talent ?? []).map((a) => ({
          slug: a.slug,
          name: a.name,
          boards: boards.includes(a.board as Board) ? [a.board as Board] : [],
          city: a.city ?? '',
          heightCm: a.heightCm ?? undefined,
          photo: a.photos[0],
          gallery: a.photos,
          stats: a.stats,
          instagram: a.instagram,
          tiktok: a.tiktok,
          bio: a.bio,
          minor: a.minor,
        }))
        cache = [...talent, ...live.filter((l) => !talent.some((s) => s.slug === l.slug))]
        setList(cache)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return [list, loaded] as const
}

export function formatHeight(cm?: number) {
  if (!cm) return ''
  const totalIn = Math.round(cm / 2.54)
  return `${cm} cm · ${Math.floor(totalIn / 12)}'${totalIn % 12}"`
}
