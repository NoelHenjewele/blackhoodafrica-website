export interface Opportunity {
  id: string
  title: string
  category: string
  location: string
  deadline: string
  description: string
}

export const opportunities: Opportunity[] = [
  {
    id: 'dar-fashion-week-runway',
    title: 'Dar es Salaam Fashion Week — Runway Casting',
    category: 'Runway',
    location: 'Dar es Salaam',
    deadline: '15 September 2026',
    description:
      'Casting confident runway models for the main-stage shows at this year’s Dar es Salaam Fashion Week. Academy graduates encouraged to apply.',
  },
  {
    id: 'kitenge-heritage-campaign',
    title: 'Kitenge Heritage Brand Campaign',
    category: 'Commercial',
    location: 'Arusha',
    deadline: '02 September 2026',
    description:
      'A local fashion label is seeking Women and Men talent for a print and social campaign celebrating contemporary East African style.',
  },
  {
    id: 'new-faces-scouting-mwanza',
    title: 'New Faces Scouting Day — Mwanza',
    category: 'Scouting',
    location: 'Mwanza',
    deadline: 'Ongoing',
    description:
      'BlackhoodAfrica scouts are visiting Mwanza to meet aspiring models aged 16–25. No experience necessary — just presence and confidence.',
  },
  {
    id: 'coastal-swim-editorial',
    title: 'Zanzibar Coastal Editorial Shoot',
    category: 'Editorial',
    location: 'Zanzibar',
    deadline: '20 September 2026',
    description:
      'An editorial story for a regional lifestyle publication, shot on location along the Zanzibar coastline. Seeking Women and New Faces.',
  },
  {
    id: 'university-brand-ambassador',
    title: 'Campus Brand Ambassador Programme',
    category: 'Brand Ambassador',
    location: 'Dodoma',
    deadline: '10 October 2026',
    description:
      'A telecom brand is recruiting outgoing student ambassadors for a semester-long activation across university campuses.',
  },
  {
    id: 'menswear-lookbook-arusha',
    title: 'Menswear Lookbook Booking',
    category: 'Commercial',
    location: 'Arusha',
    deadline: '05 September 2026',
    description:
      'A tailoring house is booking Men talent for its season lookbook. Studio and outdoor locations across two shoot days.',
  },
]
