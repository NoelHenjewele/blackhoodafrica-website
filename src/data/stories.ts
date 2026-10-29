import type { L } from '../i18n'

export type Story = {
  slug: string
  name: string
  headline: L
  summary: L
  photo: string
  gallery?: string[]
  quote?: L // only a real, approved quote from the person
  date?: string // e.g. "Oct 2026", shown as given; leave out if unconfirmed
}

// Real, confirmed wins only. Newest first.
export const stories: Story[] = [
  {
    slug: 'eladia-edwin',
    name: 'Eladia Edwin',
    headline: { en: 'Crowned Miss Kinondoni 2027–2028', sw: 'Amevishwa taji la Miss Kinondoni 2027–2028' },
    summary: {
      en: 'Eladia trained with Blackhood before stepping onto the Miss Kinondoni stage, where she took the 2027–2028 title.',
      sw: 'Eladia alifunzwa na Blackhood kabla ya kupanda jukwaa la Miss Kinondoni, ambako alishinda taji la 2027–2028.',
    },
    photo: '/talent/eladia-edwin/crowned-portrait.jpg',
    gallery: ['/talent/eladia-edwin/runway-stage.jpg', '/talent/eladia-edwin/crowned-with-host.jpg'],
  },
]
