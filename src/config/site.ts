import type { L } from '../i18n'

// Central place for contact details and links.
export const site = {
  name: 'Blackhood Africa',
  tagline: { en: "Tanzania's most trusted talent house.", sw: 'Nyumba ya vipaji inayoaminika zaidi Tanzania.' } as L,
  promise: { en: 'Trained here, booked everywhere.', sw: 'Tumefunzwa hapa, tunaajiriwa kila mahali.' } as L,
  city: 'Dar es Salaam',
  // Digits only, with country code (used for wa.me links)
  whatsappNumber: '255711505927',
  phoneDisplay: '+255 711 505 927',
  // Scouting and agency applications are free; the academy has a published application fee.
  feeLine: {
    en: 'Free to apply · Academy fees published upfront',
    sw: 'Kuomba ni bure · Ada za chuo zimewekwa wazi',
  } as L,
  academyRegistrationFee: 'TZS 60,000',
  academyFeeTerms: {
    en: 'paid in full or in 2 instalments of TZS 30,000',
    sw: 'kulipwa yote kwa mara moja au kwa awamu 2 za TZS 30,000',
  } as L,
  socials: {
    instagram: 'https://instagram.com/blackhoodafrica',
    tiktok: 'https://tiktok.com/@blackhoodafrica',
    facebook: 'https://facebook.com/blackhoodafrica',
  },
}

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message)
  return site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`
}
