// Central place for contact details and links.
// TODO: add the WhatsApp number once confirmed (digits only, with country code, e.g. 2557XXXXXXXX).
export const site = {
  name: 'Blackhood Africa',
  tagline: "Tanzania's most trusted talent house.",
  promise: 'Trained here, booked everywhere.',
  city: 'Dar es Salaam',
  whatsappNumber: '',
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
