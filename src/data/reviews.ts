export type Review = {
  quote: string
  name: string
  role: string // e.g. "Model, Women board", "Parent, Kinondoni", "Marketing lead, Brand X"
  photo?: string
}

// Real, approved quotes only. The reviews section stays hidden while this list is empty.
export const reviews: Review[] = []
