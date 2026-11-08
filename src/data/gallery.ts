// Gallery: training videos and photos from past intakes.
// Videos: paste the YouTube video id (after "v=" or "youtu.be/"), or the TikTok video id (the long number after "/video/").
// Photos: put the JPEG in public/gallery/ and add its path here.

type L = { en: string; sw: string }

export type GalleryVideo = { youtubeId?: string; tiktokId?: string; title: L; intake?: string }
export type GalleryPhoto = { src: string; caption?: L; intake?: string }

export const videos: GalleryVideo[] = [
  { tiktokId: '7524361260520033592', title: { en: 'Training session', sw: 'Mafunzo' } },
  { tiktokId: '7524335556252192005', title: { en: 'Training session', sw: 'Mafunzo' } },
  { tiktokId: '7524335168455249208', title: { en: 'Training session', sw: 'Mafunzo' } },
  { tiktokId: '7524315443985698053', title: { en: 'Training session', sw: 'Mafunzo' } },
]

// Training day, 7 Nov 2026 (originals: Desktop/Blackhood Photos/2026-11-07 Training day).
const nov7 = (n: number, en: string, sw: string): GalleryPhoto => ({
  src: `/gallery/2026-11-07/training-${String(n).padStart(2, '0')}.webp`,
  caption: { en, sw },
  intake: '7 Nov 2026',
})

export const photos: GalleryPhoto[] = [
  nov7(1, 'Fitting and styling', 'Kupima na kupanga mavazi'),
  nov7(2, 'Getting the details right', 'Kurekebisha kila undani'),
  nov7(3, 'Runway walk practice', 'Mazoezi ya kutembea jukwaani'),
  nov7(4, 'Walking in pairs', 'Kutembea wawili wawili'),
  nov7(5, 'Posture coaching', 'Mafunzo ya mkao'),
  nov7(6, 'Finding the rhythm', 'Kutafuta mdundo'),
  nov7(7, 'Group walk with the coach', 'Kutembea kikundi na mkufunzi'),
  nov7(8, 'Turns and timing', 'Kugeuka na muda'),
  nov7(9, 'Break on the rooftop', 'Mapumziko juu ya paa'),
  nov7(10, 'Between sessions', 'Kati ya vipindi'),
  nov7(11, 'New faces', 'Sura mpya'),
  {
    src: '/talent/eladia-edwin/runway-stage.webp',
    caption: { en: 'On the runway', sw: 'Jukwaani' },
  },
  {
    src: '/talent/eladia-edwin/crowned-portrait.webp',
    caption: { en: 'Crowned', sw: 'Ametwaa taji' },
  },
  {
    src: '/talent/eladia-edwin/crowned-with-host.webp',
    caption: { en: 'Final night', sw: 'Usiku wa fainali' },
  },
]
