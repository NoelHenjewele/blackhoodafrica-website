import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BRAND = 'Blackhood Africa'
// Browser tab / Google title for each page. Model pages get theirs from the server (api/talent.ts).
const TITLES: Record<string, string> = {
  '/': `${BRAND} · Talent House, Dar es Salaam`,
  '/talent': `Models & talent · ${BRAND}`,
  '/clients': `Book models for your brand · ${BRAND}`,
  '/apply': `Become a model · Apply to ${BRAND}`,
  '/academy': `Modelling academy in Dar es Salaam · ${BRAND}`,
  '/castings': `Castings & open calls · ${BRAND}`,
  '/gallery': `Training gallery · ${BRAND}`,
  '/news': `News & events · ${BRAND}`,
  '/review': `Leave a review · ${BRAND}`,
  '/stories': `Success stories · ${BRAND}`,
  '/trust': `Our promise · ${BRAND}`,
  '/about': `About us · ${BRAND}`,
  '/faq': `FAQ · ${BRAND}`,
  '/parents': `For parents · ${BRAND}`,
  '/verify': `Is it really us? · ${BRAND}`,
  '/compcard': `Comp card maker · ${BRAND}`,
  '/account': `Model login · ${BRAND}`,
}

// Scrolls to the top on page change, or to #anchor when the link has one. Also sets the page title.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (TITLES[pathname]) document.title = TITLES[pathname]
  }, [pathname])
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
