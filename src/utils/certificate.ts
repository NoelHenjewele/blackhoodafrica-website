// Builds an A4 landscape academy certificate PDF in the browser. The code can be checked on /verify.
import { jsPDF } from 'jspdf'

export type CertData = { name: string; course: string; code: string; issuedOn: string; signature?: string } // signature: PNG data URL

const W = 297
const H = 210
const GOLD: [number, number, number] = [168, 132, 63]
const GOLD_LIGHT: [number, number, number] = [214, 186, 128]
const INK: [number, number, number] = [11, 11, 11]
const IVORY: [number, number, number] = [251, 248, 241]
const IVORY_HEX = '#fbf8f1'

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = url
  })
}

// Images are flattened onto the cream background as JPEG: jsPDF stores transparent PNGs uncompressed.
async function flatLogo(url: string) {
  const img = await loadImage(url)
  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const g = c.getContext('2d')!
  g.fillStyle = IVORY_HEX
  g.fillRect(0, 0, c.width, c.height)
  g.drawImage(img, 0, 0)
  return { data: c.toDataURL('image/jpeg', 0.92), ratio: img.naturalWidth / img.naturalHeight }
}

// Faint gold "BA" watermark: the light strokes of the monogram become a whisper of gold on cream.
async function watermark(url: string, strength = 0.09) {
  const img = await loadImage(url)
  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const g = c.getContext('2d')!
  g.drawImage(img, 0, 0)
  const px = g.getImageData(0, 0, c.width, c.height)
  const d = px.data
  for (let i = 0; i < d.length; i += 4) {
    // The monogram's background is near-black, not black: treat anything that dark as empty so no box shows.
    const t = Math.max(0, (d[i] + d[i + 1] + d[i + 2]) / 765 - 0.12) / 0.88 * strength
    d[i] = IVORY[0] + (GOLD[0] - IVORY[0]) * t
    d[i + 1] = IVORY[1] + (GOLD[1] - IVORY[1]) * t
    d[i + 2] = IVORY[2] + (GOLD[2] - IVORY[2]) * t
  }
  g.putImageData(px, 0, 0)
  return c.toDataURL('image/jpeg', 0.9)
}

// Round seal: the monogram in a dark disc with gold rings, on cream.
async function seal(url: string) {
  const img = await loadImage(url)
  const s = 600
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')!
  g.fillStyle = IVORY_HEX
  g.fillRect(0, 0, s, s)
  const ring = (r: number, w: number, color: string) => {
    g.beginPath()
    g.arc(s / 2, s / 2, r, 0, Math.PI * 2)
    g.lineWidth = w
    g.strokeStyle = color
    g.stroke()
  }
  g.save()
  g.beginPath()
  g.arc(s / 2, s / 2, s / 2 - 30, 0, Math.PI * 2)
  g.clip()
  g.drawImage(img, 0, 0, s, s)
  g.restore()
  ring(s / 2 - 30, 14, '#a8843f')
  ring(s / 2 - 8, 6, '#a8843f')
  // small gold dots between the rings
  for (let k = 0; k < 36; k++) {
    const a = (k / 36) * Math.PI * 2
    g.beginPath()
    g.arc(s / 2 + Math.cos(a) * (s / 2 - 19), s / 2 + Math.sin(a) * (s / 2 - 19), 3.2, 0, Math.PI * 2)
    g.fillStyle = '#d6ba80'
    g.fill()
  }
  return c.toDataURL('image/jpeg', 0.92)
}

// Gold corner ornament: two lines and a small diamond, mirrored into each corner.
function corner(doc: jsPDF, x: number, y: number, dx: number, dy: number) {
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.8)
  doc.line(x, y, x + 22 * dx, y)
  doc.line(x, y, x, y + 22 * dy)
  doc.setLineWidth(0.3)
  doc.line(x + 4 * dx, y + 4 * dy, x + 14 * dx, y + 4 * dy)
  doc.line(x + 4 * dx, y + 4 * dy, x + 4 * dx, y + 14 * dy)
  diamond(doc, x + 4 * dx, y + 4 * dy, 1.6)
}

function diamond(doc: jsPDF, cx: number, cy: number, r: number) {
  doc.setFillColor(...GOLD)
  doc.triangle(cx - r, cy, cx, cy - r, cx + r, cy, 'F')
  doc.triangle(cx - r, cy, cx, cy + r, cx + r, cy, 'F')
}

// Short gold rule with a diamond in the middle, used under headings.
function flourish(doc: jsPDF, cx: number, y: number, half: number) {
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.35)
  doc.line(cx - half, y, cx - 4, y)
  doc.line(cx + 4, y, cx + half, y)
  diamond(doc, cx, y, 1.8)
}

function spacedCentre(doc: jsPDF, text: string, y: number, spacing: number) {
  const w = doc.getTextWidth(text) + spacing * (text.length - 1)
  doc.setCharSpace(spacing)
  doc.text(text, (W - w) / 2, y)
  doc.setCharSpace(0)
}

export async function buildCertificate(d: CertData) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const site = window.location.origin.replace(/^https?:\/\//, '')
  const [logo, mark, stamp] = await Promise.all([flatLogo('/brand/logo-black.png'), watermark('/brand/monogram.png'), seal('/brand/monogram.png')])

  // Cream page, dark outer border, gold frames
  doc.setFillColor(...INK)
  doc.rect(0, 0, W, H, 'F')
  doc.setFillColor(...IVORY)
  doc.rect(6, 6, W - 12, H - 12, 'F')
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(1.4)
  doc.rect(11, 11, W - 22, H - 22)
  doc.setDrawColor(...GOLD_LIGHT)
  doc.setLineWidth(0.3)
  doc.rect(14, 14, W - 28, H - 28)
  corner(doc, 18, 18, 1, 1)
  corner(doc, W - 18, 18, -1, 1)
  corner(doc, 18, H - 18, 1, -1)
  corner(doc, W - 18, H - 18, -1, -1)

  // Watermark behind the text
  const wm = 120
  doc.addImage(mark, 'JPEG', (W - wm) / 2, (H - wm) / 2 + 6, wm, wm, 'mark')

  // Logo and heading
  const lh = 15
  doc.addImage(logo.data, 'JPEG', (W - lh * logo.ratio) / 2, 24, lh * logo.ratio, lh, 'logo')
  doc.setTextColor(...GOLD)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  spacedCentre(doc, 'BLACKHOOD AFRICA ACADEMY', 48, 2.2)
  doc.setTextColor(...INK)
  doc.setFont('times', 'bold')
  doc.setFontSize(30)
  spacedCentre(doc, 'CERTIFICATE', 62, 3)
  doc.setFont('times', 'italic')
  doc.setFontSize(14)
  doc.text('of Completion', W / 2, 70, { align: 'center' })
  flourish(doc, W / 2, 76, 34)

  // Recipient
  doc.setFont('times', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(90, 90, 90)
  doc.text('This is proudly presented to', W / 2, 88, { align: 'center' })
  let size = 38
  doc.setFont('times', 'bolditalic')
  doc.setFontSize(size)
  while (doc.getTextWidth(d.name) > W - 80 && size > 22) doc.setFontSize(--size)
  doc.setTextColor(...INK)
  doc.text(d.name, W / 2, 106, { align: 'center' })
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.5)
  doc.line(W / 2 - 75, 111, W / 2 + 75, 111)

  doc.setFont('times', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(90, 90, 90)
  doc.text('for successfully completing the', W / 2, 121, { align: 'center' })
  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(...GOLD)
  doc.text(d.course, W / 2, 131, { align: 'center', maxWidth: W - 90 })
  doc.setFont('times', 'italic')
  doc.setFontSize(11)
  doc.setTextColor(90, 90, 90)
  doc.text('Runway · Posing · Camera presence · Professional conduct', W / 2, 139, { align: 'center' })

  // Signature (left), seal (centre), date (right)
  const date = new Date(d.issuedOn + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.setTextColor(...INK)
  if (d.signature) {
    const sig = await flatLogo(d.signature)
    const sh = 21
    doc.addImage(sig.data, 'JPEG', 85 - (sh * sig.ratio) / 2, 146.5, sh * sig.ratio, sh, 'signature')
  } else {
    doc.setFont('times', 'italic')
    doc.setFontSize(20)
    doc.text('N. Henjewele', 85, 163, { align: 'center' })
  }
  doc.setFont('times', 'bold')
  doc.setFontSize(16)
  doc.text(date, W - 85, 163, { align: 'center' })
  doc.setDrawColor(...INK)
  doc.setLineWidth(0.3)
  doc.line(52, 167, 118, 167)
  doc.line(W - 118, 167, W - 52, 167)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('Eng. Noel Henjewele', 85, 173, { align: 'center' })
  doc.text('Date of issue', W - 85, 173, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(90, 90, 90)
  doc.text('Founder & CEO, Blackhood Africa', 85, 178, { align: 'center' })
  doc.text('Dar es Salaam, Tanzania', W - 85, 178, { align: 'center' })

  const sd = 34
  doc.addImage(stamp, 'JPEG', (W - sd) / 2, 148, sd, sd, 'seal')

  // Verification strip
  doc.setTextColor(...GOLD)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  spacedCentre(doc, `CERTIFICATE NO. ${d.code}`, 189, 1)
  doc.setTextColor(120, 120, 120)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text(`Verify this certificate at ${site}/verify`, W / 2, 193.5, { align: 'center' })

  return doc
}

export const certificateFileName = (name: string) =>
  `Blackhood-certificate-${name.trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}.pdf`
