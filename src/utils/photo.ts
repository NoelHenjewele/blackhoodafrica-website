// Shrinks a phone photo in the browser before upload: max 1200px on the long side, JPEG.
// Returns base64 (no data: prefix) plus a preview URL. Keeps uploads fast on mobile data.
// iPhone HEIC photos are converted to JPEG first (Windows/Android browsers can't read HEIC).
export async function shrinkPhoto(file: File, maxSide = 1200, quality = 0.8) {
  const bitmap = await createImageBitmap(await readable(file), { imageOrientation: 'from-image' })
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const dataUrl = canvas.toDataURL('image/jpeg', quality)
  return { base64: dataUrl.split(',')[1], preview: dataUrl }
}

const isHeic = (f: File) => /image\/hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name)

async function readable(file: File): Promise<Blob> {
  if (!isHeic(file)) return file
  try {
    // Safari opens HEIC itself; only load the (large) converter when the browser can't.
    await createImageBitmap(file)
    return file
  } catch {
    const { heicTo } = await import('heic-to')
    return heicTo({ blob: file, type: 'image/jpeg', quality: 0.9 })
  }
}
