import { InstagramIcon, TikTokIcon } from './ui/BrandIcons'
import { INSTAGRAM_URL, TIKTOK_URL } from '../utils/whatsapp'

interface SocialLinksProps {
  className?: string
  iconSize?: number
}

export default function SocialLinks({ className = '', iconSize = 18 }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="BlackhoodAfrica on Instagram"
        className="opacity-80 hover:opacity-100 hover:text-gold transition-colors duration-300"
      >
        <InstagramIcon size={iconSize} />
      </a>
      <a
        href={TIKTOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="BlackhoodAfrica on TikTok"
        className="opacity-80 hover:opacity-100 hover:text-gold transition-colors duration-300"
      >
        <TikTokIcon size={iconSize} />
      </a>
    </div>
  )
}
