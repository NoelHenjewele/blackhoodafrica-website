// Builds a 2-page A5 comp card PDF entirely in the browser (nothing is uploaded).
// Page 1: main photo, name, logo. Page 2: up to 4 photos, measurements, agency contacts and talent code.
import { jsPDF } from 'jspdf'
import { site } from '../config/site'

export type CardData = {
  name: string
  code?: string // only for verified talent; otherwise the card is marked "Applicant"
  stats: { label: string; value: string }[]
  main: string // image data URL
  extras: string[] // image data URLs, up to 4
}

const W = 148 // A5 width in mm
const H = 210 // A5 height in mm
const GOLD: [number, number, number] = [168, 132, 63]
const INK: [number, number, number] = [11, 11, 11]

// Centre-crops an image to the target aspect ratio and returns a JPEG data URL.
async function crop(src: string, aspect: number, maxPx = 1600) {
  // onload rather than img.decode(): decode() can stall in background tabs on some browsers
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = src
  })
  let sw = img.naturalWidth
  let sh = img.naturalHeight
  let sx = 0
  let sy = 0
  if (sw / sh > aspect) {
    const nw = sh * aspect
    sx = (sw - nw) / 2
    sw = nw
  } else {
    const nh = sw / aspect
    sy = (sh - nh) * 0.3 // keep faces: bias the crop towards the top
    sh = nh
  }
  const scale = Math.min(1, maxPx / Math.max(sw, sh))
  const c = document.createElement('canvas')
  c.width = Math.round(sw * scale)
  c.height = Math.round(sh * scale)
  c.getContext('2d')!.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height)
  return c.toDataURL('image/jpeg', 0.9)
}

// The logo is flattened onto white as a JPEG: jsPDF stores transparent PNGs uncompressed, which bloats the file.
async function loadLogo(url: string) {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = url
  })
  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const g = c.getContext('2d')!
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, c.width, c.height)
  g.drawImage(img, 0, 0)
  return c.toDataURL('image/jpeg', 0.92)
}

export async function buildCompCard(data: CardData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a5', orientation: 'portrait' })
  const logo = await loadLogo('/brand/logo-black.png')
  const verified = !!data.code

  // ---- Page 1 ----
  const m = 8
  const photoH = H - 48
  doc.addImage(await crop(data.main, (W - 2 * m) / photoH), 'JPEG', m, m, W - 2 * m, photoH)

  doc.setFont('times', 'normal')
  doc.setTextColor(...INK)
  doc.setFontSize(26)
  doc.text(data.name.toUpperCase(), m, H - 24, { charSpace: 1 })
  doc.addImage(logo, 'JPEG', W - m - 42, H - 32, 42, 10.2, 'logo')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...GOLD)
  doc.text(verified ? `BLACKHOOD AFRICA TALENT · ${data.code}` : 'APPLICANT · NOT YET REPRESENTED', m, H - 14, { charSpace: 0.8 })

  // ---- Page 2 ----
  doc.addPage()
  const extras = data.extras.slice(0, 4)
  const gap = 3
  const cellW = (W - 2 * m - gap) / 2
  // Near-square cells leave room below for the name, two rows of stats and the agency footer.
  const cellH = cellW * 1.05
  for (let i = 0; i < extras.length; i++) {
    const x = m + (i % 2) * (cellW + gap)
    const y = m + Math.floor(i / 2) * (cellH + gap)
    doc.addImage(await crop(extras[i], cellW / cellH, 1000), 'JPEG', x, y, cellW, cellH)
  }

  let y = m + 2 * cellH + gap + 10
  doc.setFont('times', 'normal')
  doc.setFontSize(16)
  doc.setTextColor(...INK)
  doc.text(data.name.toUpperCase(), m, y, { charSpace: 0.6 })
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const filled = data.stats.filter((s) => s.value.trim())
  const colW = (W - 2 * m) / 4
  filled.forEach((s, i) => {
    const x = m + (i % 4) * colW
    const row = Math.floor(i / 4)
    doc.setTextColor(...GOLD)
    doc.text(s.label.toUpperCase(), x, y + row * 10)
    doc.setTextColor(...INK)
    doc.text(s.value, x, y + row * 10 + 4)
  })
  y += Math.ceil(filled.length / 4) * 10 + 4

  // Agency footer
  doc.setDrawColor(...GOLD)
  doc.line(m, H - 26, W - m, H - 26)
  doc.addImage(logo, 'JPEG', m, H - 22, 34, 8.25, 'logo')
  doc.setFontSize(7.5)
  doc.setTextColor(...INK)
  const contact = [
    `WhatsApp ${site.phoneDisplay}`,
    'Instagram · TikTok @blackhoodafrica',
    `${site.city}, Tanzania`,
  ]
  contact.forEach((line, i) => doc.text(line, W - m, H - 19 + i * 3.6, { align: 'right' }))
  doc.setTextColor(...GOLD)
  doc.text(
    verified ? `Talent code ${data.code} · verify at the "Is it really us?" page` : 'Applicant card · not an agency-represented model',
    m,
    H - 7,
  )

  return doc
}

export function compCardFileName(name: string) {
  return `${name.trim().replace(/\s+/g, '-') || 'comp-card'}-comp-card.pdf`
}
