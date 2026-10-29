export type ModelCategory = 'Women' | 'Men' | 'New Faces'

export interface Model {
  id: string
  name: string
  category: ModelCategory
  location: string
  experience: 'New Face' | 'Developing' | 'Professional'
  height: string
  image: string
  gallery: string[]
  featured: boolean
  bio: string
}

export const models: Model[] = [
  {
    id: 'amani-joseph',
    name: 'Amani Joseph',
    category: 'Women',
    location: 'Dar es Salaam',
    experience: 'Professional',
    height: "5'10\"",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: true,
    bio: 'Amani has walked runways across East Africa and brings a commanding, editorial presence to every booking.',
  },
  {
    id: 'baraka-mushi',
    name: 'Baraka Mushi',
    category: 'Men',
    location: 'Arusha',
    experience: 'Professional',
    height: "6'2\"",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: true,
    bio: 'A graduate of the BlackhoodAfrica Academy, Baraka now books national campaigns and editorial features.',
  },
  {
    id: 'neema-kilewo',
    name: 'Neema Kilewo',
    category: 'New Faces',
    location: 'Mwanza',
    experience: 'New Face',
    height: "5'9\"",
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: true,
    bio: 'Freshly scouted in Mwanza, Neema is currently developing her portfolio through the Academy.',
  },
  {
    id: 'juma-mwakalinga',
    name: 'Juma Mwakalinga',
    category: 'New Faces',
    location: 'Dodoma',
    experience: 'New Face',
    height: "6'0\"",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: false,
    bio: 'Juma joined the academy this year and is building his runway and camera fundamentals.',
  },
  {
    id: 'zawadi-mrema',
    name: 'Zawadi Mrema',
    category: 'Women',
    location: 'Dar es Salaam',
    experience: 'Developing',
    height: "5'8\"",
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: true,
    bio: 'Zawadi is building her editorial book with a focus on beauty and lifestyle campaigns.',
  },
  {
    id: 'elias-mngazija',
    name: 'Elias Mngazija',
    category: 'Men',
    location: 'Zanzibar City',
    experience: 'Developing',
    height: "6'1\"",
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: false,
    bio: 'Elias brings coastal charisma and a natural ease in front of the camera.',
  },
  {
    id: 'faraja-lyimo',
    name: 'Faraja Lyimo',
    category: 'Women',
    location: 'Arusha',
    experience: 'New Face',
    height: "5'9\"",
    image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: true,
    bio: 'Faraja stood out at our regional scouting day and has just enrolled in the Academy.',
  },
  {
    id: 'godwin-shirima',
    name: 'Godwin Shirima',
    category: 'Men',
    location: 'Mbeya',
    experience: 'Professional',
    height: "6'0\"",
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: false,
    bio: 'Godwin books commercial and editorial work across Southern Tanzania and Malawi.',
  },
  {
    id: 'happiness-ngowi',
    name: 'Happiness Ngowi',
    category: 'Women',
    location: 'Mwanza',
    experience: 'Professional',
    height: "5'11\"",
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: true,
    bio: 'Happiness has represented Tanzania at two regional fashion weeks and mentors new academy students.',
  },
  {
    id: 'ibrahim-chande',
    name: 'Ibrahim Chande',
    category: 'New Faces',
    location: 'Tanga',
    experience: 'New Face',
    height: "6'1\"",
    image: 'https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: false,
    bio: 'Ibrahim is a first-term academy student focused on posing and camera confidence.',
  },
  {
    id: 'winnie-massawe',
    name: 'Winnie Massawe',
    category: 'Women',
    location: 'Dodoma',
    experience: 'Developing',
    height: "5'9\"",
    image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: false,
    bio: 'Winnie is expanding her portfolio into runway and brand ambassador work.',
  },
  {
    id: 'kelvin-mrisho',
    name: 'Kelvin Mrisho',
    category: 'Men',
    location: 'Dar es Salaam',
    experience: 'New Face',
    height: "6'2\"",
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80&auto=format&fit=crop',
    ],
    featured: false,
    bio: 'Kelvin recently completed our Runway and Catwalk programme with distinction.',
  },
]
