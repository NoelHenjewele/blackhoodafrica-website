export const WHATSAPP_NUMBER = '255711505927'
export const WHATSAPP_DISPLAY = '+255 711 505 927'
export const INSTAGRAM_URL = 'https://www.instagram.com/blackhoodafrica/?hl=en'
export const TIKTOK_URL = 'https://www.tiktok.com/@blackhoodafrica?is_from_webapp=1&sender_device=pc'

/**
 * Builds a wa.me click-to-chat link with an optional pre-filled message.
 */
export function buildWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}
