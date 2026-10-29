export const boards = ['Women', 'Men', 'New Faces', 'Curve', 'Creators'] as const
export type Board = (typeof boards)[number]

export type Talent = {
  slug: string
  name: string
  boards: Board[]
  city: string
  heightCm?: number
  note?: string
  photo?: string
  featured?: boolean
}

// The roster. Only confirmed talent goes here; empty boards show placeholders on the site.
export const talent: Talent[] = [
  {
    slug: 'eladia-edwin',
    name: 'Eladia Edwin',
    boards: ['Women'],
    city: 'Dar es Salaam',
    note: 'Miss Kinondoni 2027–2028',
    photo: '/talent/eladia-edwin/runway-stage.jpg',
    featured: true,
  },
]

export function formatHeight(cm?: number) {
  if (!cm) return ''
  const totalIn = Math.round(cm / 2.54)
  return `${cm} cm · ${Math.floor(totalIn / 12)}'${totalIn % 12}"`
}
