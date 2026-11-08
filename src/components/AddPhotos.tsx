import { useState } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { shrinkPhoto } from '../utils/photo'

// Team-only: upload photos (e.g. portraits from a shoot) straight onto a model's profile.
export default function AddPhotos({ token, profileId, onDone }: { token: string; profileId: string; onDone: () => void }) {
  const [busy, setBusy] = useState('')
  const [first, setFirst] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')

  async function upload(files: FileList | null) {
    if (!files?.length) return
    setError('')
    setDone('')
    const list = Array.from(files)
    let failed = 0
    for (const [i, file] of list.entries()) {
      setBusy(`Uploading ${i + 1} of ${list.length}…`)
      try {
        const { base64 } = await shrinkPhoto(file, 1600, 0.85)
        const res = await fetch('/api/admin/profiles?upload=1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          // Only the first file of the batch can become the main picture.
          body: JSON.stringify({ id: profileId, photo: base64, first: first && i === 0 }),
        })
        if (!res.ok) failed++
      } catch {
        failed++
      }
    }
    setBusy('')
    const ok = list.length - failed
    if (ok) setDone(`✓ ${ok} photo${ok === 1 ? '' : 's'} added${first ? ' (first one is now her main picture)' : ''}. See them in her photo row above.`)
    if (failed) setError(`${failed} photo(s) didn’t upload. Please try those again.`)
    onDone()
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-ink">
        {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} {busy || 'Add photos'}
        <input type="file" accept="image/*" multiple className="hidden" disabled={!!busy} onChange={(e) => { upload(e.target.files); e.target.value = '' }} />
      </label>
      <label className="flex items-center gap-2 text-ivory/85">
        <input type="checkbox" checked={first} onChange={(e) => setFirst(e.target.checked)} className="h-4 w-4 accent-[#c9a45c]" />
        Make the first one her main picture
      </label>
      {done && <span className="w-full text-green-300">{done}</span>}
      {error && <span className="w-full text-red-300">{error}</span>}
    </div>
  )
}
