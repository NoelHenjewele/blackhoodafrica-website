// Central place for contact details and links.
export const site = {
  name: 'Blackhood Africa',
  tagline: "Tanzania's most trusted talent house.",
  promise: 'Trained here, booked everywhere.',
  city: 'Dar es Salaam',
  // Digits only, with country code (used for wa.me links)
  whatsappNumber: '255711505927',
  phoneDisplay: '+255 711 505 927',
  // Scouting and agency applications are free; the academy has a published application fee.
  feeLine: 'Free to apply · Academy fees published upfront',
  academyRegistrationFee: 'TZS 60,000',
  academyFeeTerms: 'paid in full or in 2 instalments of TZS 30,000',
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
