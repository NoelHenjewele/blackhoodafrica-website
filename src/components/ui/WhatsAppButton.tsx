import { MessageCircle } from 'lucide-react'
import { buildWhatsAppLink } from '../../utils/whatsapp'

interface WhatsAppButtonProps {
  message?: string
  label?: string
  variant?: 'solid' | 'floating'
  className?: string
}

export default function WhatsAppButton({
  message,
  label = 'Chat on WhatsApp',
  variant = 'solid',
  className = '',
}: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(message)

  if (variant === 'floating') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with BlackhoodAfrica on WhatsApp"
        className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3.5 shadow-lg shadow-black/20 hover:brightness-95 transition-all duration-300 sm:bottom-7 sm:right-7 ${className}`}
      >
        <MessageCircle size={22} strokeWidth={2} />
        <span className="hidden sm:inline text-sm font-medium tracking-wide">WhatsApp Us</span>
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn bg-[#25D366] text-white hover:brightness-95 ${className}`.trim()}
    >
      <MessageCircle size={18} />
      {label}
    </a>
  )
}
