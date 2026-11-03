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

export const photos: GalleryPhoto[] = [
  {
    src: '/talent/eladia-edwin/runway-stage.jpg',
    caption: { en: 'On the runway', sw: 'Jukwaani' },
  },
  {
    src: '/talent/eladia-edwin/crowned-portrait.jpg',
    caption: { en: 'Crowned', sw: 'Ametwaa taji' },
  },
  {
    src: '/talent/eladia-edwin/crowned-with-host.jpg',
    caption: { en: 'Final night', sw: 'Usiku wa fainali' },
  },
]
