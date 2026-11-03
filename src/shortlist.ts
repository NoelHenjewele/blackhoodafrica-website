import { useEffect, useState } from 'react'

// Brand shortlist: models a visitor has hearted, kept in this browser only.
export type ShortlistItem = { slug: string; name: string }

const KEY = 'bha-shortlist'
const EVENT = 'bha-shortlist-change'

export function readShortlist(): ShortlistItem[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function write(list: ShortlistItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // storage blocked: the shortlist just won't survive a reload
  }
  window.dispatchEvent(new Event(EVENT))
}

export function clearShortlist() {
  write([])
}

export function useShortlist() {
  const [list, setList] = useState<ShortlistItem[]>(readShortlist)

  useEffect(() => {
    const sync = () => setList(readShortlist())
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const has = (slug: string) => list.some((p) => p.slug === slug)
  const toggle = (item: ShortlistItem) =>
    write(has(item.slug) ? list.filter((p) => p.slug !== item.slug) : [...list, item])

  return { list, has, toggle }
}
