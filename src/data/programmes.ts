export interface Programme {
  id: string
  title: string
  duration: string
  summary: string
  learn: string[]
  whoCanApply: string
  image: string
}

export const programmes: Programme[] = [
  {
    id: 'runway-catwalk',
    title: 'Runway & Catwalk',
    duration: '4 weeks',
    summary:
      'Master the walk, turns, and stage presence that define a professional runway model.',
    learn: [
      'Foundational and advanced walk technique',
      'Turns, pace, and formation work',
      'Working with music, lighting, and choreography',
      'Show-day discipline and backstage etiquette',
    ],
    whoCanApply: 'Open to new faces and developing models aged 16 and above.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80&auto=format&fit=crop',
  },
  {
    id: 'posing-camera-confidence',
    title: 'Posing & Camera Confidence',
    duration: '3 weeks',
    summary:
      'Learn to move and hold expression with intention, in stillness and in motion, for stills and video.',
    learn: [
      'Facial expression and eye-line control',
      'Body angles, tension, and line',
      'Working with a photographer and direction',
      'Building a natural, repeatable range',
    ],
    whoCanApply: 'Ideal for beginners with little or no prior photographic experience.',
    image: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=1000&q=80&auto=format&fit=crop',
  },
  {
    id: 'grooming-personal-branding',
    title: 'Grooming & Personal Branding',
    duration: '2 weeks',
    summary:
      'Develop the personal presentation, skincare, and online identity that carries a career.',
    learn: [
      'Skin, hair, and grooming fundamentals',
      'Personal style and wardrobe basics',
      'Building an authentic social media presence',
      'Professional communication and first impressions',
    ],
    whoCanApply: 'Open to all current academy students and enrolled talent.',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1000&q=80&auto=format&fit=crop',
  },
  {
    id: 'portfolio-development',
    title: 'Portfolio Development',
    duration: '3 weeks',
    summary:
      'Build a versatile, agency-ready portfolio through guided studio and location shoots.',
    learn: [
      'Test shoot planning and concept development',
      'Working with hair, makeup, and styling teams',
      'Curating a comp card and digital portfolio',
      'Presenting yourself to clients and casting directors',
    ],
    whoCanApply: 'Recommended after completing Posing & Camera Confidence.',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1000&q=80&auto=format&fit=crop',
  },
  {
    id: 'professional-etiquette',
    title: 'Professional Etiquette & Industry Readiness',
    duration: '2 weeks',
    summary:
      'Understand contracts, castings, agency relationships, and the business behind the industry.',
    learn: [
      'Castings, go-sees, and booking etiquette',
      'Understanding contracts and usage rights',
      'Managing agency and client relationships',
      'Financial literacy for working models',
    ],
    whoCanApply: 'Required for all students before graduation.',
    image: 'https://images.unsplash.com/photo-1519575706483-221027bfbb31?w=1000&q=80&auto=format&fit=crop',
  },
]
