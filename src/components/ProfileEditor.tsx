import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Loader2, Trash2 } from 'lucide-react'
import { supabase } from '../config/supabase'
import { boardLabels, boards } from '../data/talent'
import { useLang, type L } from '../i18n'
import { shrinkPhoto } from '../utils/photo'

const BUCKET = 'talent-photos'
const MAX_PHOTOS = 10

export type ProfileRow = {
  id: string
  full_name: string
  talent_code: string
  email: string
  status: 'draft' | 'pending' | 'approved' | 'hidden'
  board: string | null
  city: string | null
  height_cm: number | null
  bust: string | null
  waist: string | null
  hips: string | null
  shoes: string | null
  hair: string | null
  eyes: string | null
  instagram: string | null
  tiktok: string | null
  bio: string | null
}
type Photo = { id: string; path: string; position: number }

const textFields: { key: keyof ProfileRow; label: L; placeholder: string }[] = [
  { key: 'city', label: { en: 'City', sw: 'Mji' }, placeholder: 'Dar es Salaam' },
  { key: 'bust', label: { en: 'Bust / chest', sw: 'Kifua' }, placeholder: '86 cm' },
  { key: 'waist', label: { en: 'Waist', sw: 'Kiuno' }, placeholder: '62 cm' },
  { key: 'hips', label: { en: 'Hips', sw: 'Nyonga' }, placeholder: '90 cm' },
  { key: 'shoes', label: { en: 'Shoes', sw: 'Viatu' }, placeholder: 'EU 39' },
  { key: 'hair', label: { en: 'Hair', sw: 'Nywele' }, placeholder: 'Black' },
  { key: 'eyes', label: { en: 'Eyes', sw: 'Macho' }, placeholder: 'Brown' },
  { key: 'instagram', label: { en: 'Instagram', sw: 'Instagram' }, placeholder: '@yourname' },
  { key: 'tiktok', label: { en: 'TikTok', sw: 'TikTok' }, placeholder: '@yourname' },
]

const statusText: Record<ProfileRow['status'], L> = {
  draft: { en: 'Not submitted yet', sw: 'Bado haijatumwa' },
  pending: { en: 'Waiting for Blackhood review', sw: 'Inasubiri ukaguzi wa Blackhood' },
  approved: { en: 'Live on the Talent boards', sw: 'Iko hewani kwenye orodha ya vipaji' },
  hidden: { en: 'Hidden by Blackhood', sw: 'Imefichwa na Blackhood' },
}

const field =
  'w-full border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none'
const label = 'mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-ivory/70'

export const photoUrl = (path: string) => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl

export default function ProfileEditor({ profile, onSaved }: { profile: ProfileRow; onSaved: (p: ProfileRow) => void }) {
  const { t } = useLang()
  const [form, setForm] = useState<ProfileRow>(profile)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    supabase
      .from('photos')
      .select('id, path, position')
      .eq('profile_id', profile.id)
      .order('position')
      .then(({ data }) => setPhotos((data as Photo[]) ?? []))
  }, [profile.id])

  const set = (key: keyof ProfileRow, value: string) => setForm((f) => ({ ...f, [key]: value }))

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const { data, error } = await supabase
      .from('profiles')
      .update({
        board: form.board,
        city: form.city,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        bust: form.bust,
        waist: form.waist,
        hips: form.hips,
        shoes: form.shoes,
        hair: form.hair,
        eyes: form.eyes,
        instagram: form.instagram,
        tiktok: form.tiktok,
        bio: form.bio,
      })
      .eq('id', profile.id)
      .select()
      .single()
    setSaving(false)
    if (error || !data) {
      setMessage({ ok: false, text: t({ en: 'Could not save. Please try again.', sw: 'Imeshindwa kuhifadhi. Tafadhali jaribu tena.' }) })
      return
    }
    onSaved(data as ProfileRow)
    setMessage({
      ok: true,
      text: t({
        en: 'Saved. Blackhood will review your changes before they go live.',
        sw: 'Imehifadhiwa. Blackhood itapitia mabadiliko yako kabla hayajaonekana hadharani.',
      }),
    })
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    setMessage(null)
    try {
      const room = MAX_PHOTOS - photos.length
      const added: Photo[] = []
      for (const file of Array.from(files).slice(0, room)) {
        const { preview } = await shrinkPhoto(file, 1600, 0.85)
        const blob = await (await fetch(preview)).blob()
        const path = `${profile.id}/${crypto.randomUUID()}.jpg`
        const up = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg' })
        if (up.error) throw up.error
        const { data, error } = await supabase
          .from('photos')
          .insert({ profile_id: profile.id, path, position: photos.length + added.length })
          .select('id, path, position')
          .single()
        if (error) throw error
        added.push(data as Photo)
      }
      setPhotos((p) => [...p, ...added])
    } catch {
      setMessage({ ok: false, text: t({ en: 'A photo could not be uploaded. Try a JPG or PNG.', sw: 'Picha haikupakiwa. Jaribu JPG au PNG.' }) })
    } finally {
      setUploading(false)
    }
  }

  async function remove(photo: Photo) {
    await supabase.storage.from(BUCKET).remove([photo.path])
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos((p) => p.filter((x) => x.id !== photo.id))
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...photos]
    const j = index + dir
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    const renumbered = next.map((p, i) => ({ ...p, position: i }))
    setPhotos(renumbered)
    await Promise.all(renumbered.map((p) => supabase.from('photos').update({ position: p.position }).eq('id', p.id)))
  }

  return (
    <div className="mt-10 space-y-12">
      <p className="inline-block border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
        {t(statusText[form.status])}
      </p>

      {/* Photos */}
      <div>
        <h2 className="font-display text-3xl">{t({ en: 'Your photos', sw: 'Picha zako' })}</h2>
        <p className="mt-2 text-sm text-ivory/60">
          {t({
            en: `Up to ${MAX_PHOTOS}. The first photo is your main picture. Use the arrows to change the order.`,
            sw: `Hadi ${MAX_PHOTOS}. Picha ya kwanza ndiyo picha yako kuu. Tumia mishale kubadilisha mpangilio.`,
          })}
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {photos.map((p, i) => (
            <div key={p.id} className={`relative aspect-[3/4] overflow-hidden bg-ink-soft ${i === 0 ? 'ring-2 ring-gold' : ''}`}>
              <img src={photoUrl(p.path)} alt="" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/80 p-1">
                <button type="button" onClick={() => move(i, -1)} aria-label={t({ en: 'Move left', sw: 'Sogeza kushoto' })} className="p-1 hover:text-gold">
                  <ArrowLeft size={14} />
                </button>
                <button type="button" onClick={() => remove(p)} aria-label={t({ en: 'Delete photo', sw: 'Futa picha' })} className="p-1 hover:text-red-300">
                  <Trash2 size={14} />
                </button>
                <button type="button" onClick={() => move(i, 1)} aria-label={t({ en: 'Move right', sw: 'Sogeza kulia' })} className="p-1 hover:text-gold">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="grid aspect-[3/4] cursor-pointer place-items-center border border-dashed border-white/25 bg-ink-soft text-center text-xs hover:border-gold">
              {uploading ? (
                <Loader2 className="animate-spin text-gold" />
              ) : (
                <span>
                  <Camera className="mx-auto mb-1 text-gold" size={22} />
                  {t({ en: 'Add photos', sw: 'Ongeza picha' })}
                </span>
              )}
              <input type="file" accept="image/*" multiple className="sr-only" disabled={uploading} onChange={(e) => upload(e.target.files)} />
            </label>
          )}
        </div>
      </div>

      {/* Details */}
      <form onSubmit={save} className="space-y-6">
        <h2 className="font-display text-3xl">{t({ en: 'Your details', sw: 'Taarifa zako' })}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="pf-board">{t({ en: 'Board', sw: 'Orodha' })}</label>
            <select id="pf-board" value={form.board ?? ''} onChange={(e) => set('board', e.target.value)} className={field}>
              <option value="">{t({ en: 'Choose', sw: 'Chagua' })}</option>
              {boards.map((b) => (
                <option key={b} value={b}>{t(boardLabels[b])}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="pf-height">{t({ en: 'Height (cm)', sw: 'Urefu (sm)' })}</label>
            <input id="pf-height" type="number" min={120} max={220} value={form.height_cm ?? ''} onChange={(e) => set('height_cm', e.target.value)} className={field} />
          </div>
          {textFields.map((f) => (
            <div key={f.key}>
              <label className={label} htmlFor={`pf-${f.key}`}>{t(f.label)}</label>
              <input id={`pf-${f.key}`} placeholder={f.placeholder} value={(form[f.key] as string | null) ?? ''} onChange={(e) => set(f.key, e.target.value)} className={field} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className={label} htmlFor="pf-bio">{t({ en: 'Short bio', sw: 'Wasifu mfupi' })}</label>
            <textarea id="pf-bio" rows={3} maxLength={400} value={form.bio ?? ''} onChange={(e) => set('bio', e.target.value)} className={field} />
          </div>
        </div>

        {message && (
          <p className={`flex items-center gap-2 text-sm ${message.ok ? 'text-green-300' : 'text-red-300'}`}>
            {message.ok && <CheckCircle2 size={16} />} {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-ivory disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {t({ en: 'Save and send for review', sw: 'Hifadhi na tuma kwa ukaguzi' })}
        </button>
      </form>
    </div>
  )
}
