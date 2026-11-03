// Builds an A4 landscape academy certificate PDF in the browser. The code can be checked on /verify.
import { jsPDF } from 'jspdf'

export type CertData = { name: string; course: string; code: string; issuedOn: string }

const W = 297
const H = 210
const GOLD: [number, number, number] = [168, 132, 63]
const INK: [number, number, number] = [11, 11, 11]

// Same trick as the comp card: flatten the logo onto white so the PDF stays small.
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
  return { data: c.toDataURL('image/jpeg', 0.92), ratio: img.naturalWidth / img.naturalHeight }
}

export async function buildCertificate(d: CertData) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const site = window.location.origin

  // Double gold frame
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(1.2)
  doc.rect(10, 10, W - 20, H - 20)
  doc.setLineWidth(0.3)
  doc.rect(14, 14, W - 28, H - 28)

  const logo = await loadLogo('/brand/logo-black.png')
  const lh = 16
  doc.addImage(logo.data, 'JPEG', (W - lh * logo.ratio) / 2, 24, lh * logo.ratio, lh, 'logo')

  doc.setTextColor(...GOLD)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  // jsPDF's centring ignores letter spacing, so centre by hand.
  const heading = 'CERTIFICATE OF COMPLETION'
  const spacing = 2.5
  const headingW = doc.getTextWidth(heading) + spacing * (heading.length - 1)
  doc.setCharSpace(spacing)
  doc.text(heading, (W - headingW) / 2, 54)
  doc.setCharSpace(0)

  doc.setTextColor(...INK)
  doc.setFont('times', 'normal')
  doc.setFontSize(13)
  doc.text('This certifies that', W / 2, 72, { align: 'center' })

  let size = 40
  doc.setFont('times', 'bold')
  doc.setFontSize(size)
  while (doc.getTextWidth(d.name) > W - 70 && size > 22) doc.setFontSize(--size)
  doc.text(d.name, W / 2, 92, { align: 'center' })
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.4)
  doc.line(W / 2 - 70, 98, W / 2 + 70, 98)

  doc.setFont('times', 'normal')
  doc.setFontSize(13)
  doc.text('has successfully completed', W / 2, 112, { align: 'center' })
  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  doc.text(d.course, W / 2, 124, { align: 'center', maxWidth: W - 80 })
  doc.setFont('times', 'normal')
  doc.setFontSize(12)
  doc.text('at the Blackhood Africa Academy, Dar es Salaam, Tanzania', W / 2, 136, { align: 'center' })

  // Signature and date
  const date = new Date(d.issuedOn + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.setLineWidth(0.3)
  doc.setDrawColor(...INK)
  doc.line(50, 166, 120, 166)
  doc.line(W - 120, 166, W - 50, 166)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Eng. Noel Henjewele', 85, 172, { align: 'center' })
  doc.text(date, W - 85, 172, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Founder & CEO, Blackhood Africa', 85, 177, { align: 'center' })
  doc.text('Date issued', W - 85, 177, { align: 'center' })

  // Verification code
  doc.setTextColor(...GOLD)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(`Certificate no. ${d.code}`, W / 2, 186, { align: 'center' })
  doc.setTextColor(110, 110, 110)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(`Check this certificate at ${site.replace(/^https?:\/\//, '')}/verify`, W / 2, 191, { align: 'center' })

  return doc
}

export const certificateFileName = (name: string) =>
  `Blackhood-certificate-${name.trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}.pdf`
