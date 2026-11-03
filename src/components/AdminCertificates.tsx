import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Download, Loader2, Plus, Trash2 } from 'lucide-react'

// Team-only: issue academy certificates. Each gets a BHA-C-#### code that anyone can check on /verify.
type Cert = { id: string; code: string; name: string; course: string; issued_on: string }

const field = 'w-full border border-white/15 bg-ink px-4 py-3 text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none [color-scheme:dark]'
const DEFAULT_COURSE = 'Professional Modelling Course'

// The CEO's signature is only given to signed-in team members, so it's fetched with the login token.
async function download(c: Cert, token: string) {
  const [{ buildCertificate, certificateFileName }, sig] = await Promise.all([
    import('../utils/certificate'),
    fetch('/api/admin/profiles?signature=1', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json() as Promise<{ png?: string }>)
      .catch(() => ({ png: undefined })),
  ])
  const signature = sig.png ? `data:image/png;base64,${sig.png}` : undefined
  if (!signature) alert('Signature not found. Check Supabase Storage has a private bucket named private-files containing signature.png. This PDF uses the typed name instead.')
  const doc = await buildCertificate({ name: c.name, course: c.course, code: c.code, issuedOn: c.issued_on, signature })
  doc.save(certificateFileName(c.name))
}

export default function AdminCertificates({ token }: { token: string }) {
  const [certs, setCerts] = useState<Cert[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/profiles?certificates=1', { headers: { Authorization: `Bearer ${token}` } })
      const r = (await res.json()) as { ok: boolean; certificates?: Cert[] }
      if (!r.ok) throw new Error()
      setCerts(r.certificates ?? [])
    } catch {
      setError("Couldn't load certificates. Has the certificates SQL been run in Supabase?")
      setCerts([])
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function send(body: Record<string, unknown>) {
    setBusy(true)
    setError('')
    const res = await fetch('/api/admin/profiles?certificates=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    const r = (await res.json().catch(() => ({}))) as { ok?: boolean; certificate?: Cert }
    setBusy(false)
    if (!res.ok) setError('That didn’t save. Please try again.')
    await load()
    return r.certificate
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    const cert = await send({ action: 'create', name: d.get('name'), course: d.get('course'), issued_on: d.get('issued_on') })
    if (cert) {
      form.reset()
      await download(cert, token)
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={onCreate} className="grid gap-3 border border-white/10 bg-ink-soft p-6 sm:grid-cols-2">
        <h2 className="font-display text-3xl sm:col-span-2">Issue a certificate</h2>
        <input name="name" required placeholder="Graduate's full name, as it should print" className={`${field} sm:col-span-2`} />
        <input name="course" required defaultValue={DEFAULT_COURSE} placeholder="Course" className={field} />
        <input name="issued_on" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className={field} />
        <div className="flex items-center gap-4 sm:col-span-2">
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Issue & download PDF
          </button>
          <p className="text-xs text-ivory/50">Check the spelling of the name first: the number can't be reused.</p>
        </div>
      </form>

      {error && <p className="mt-4 text-red-300">{error}</p>}
      {certs === null && <Loader2 className="mt-8 animate-spin text-gold" />}
      {certs?.length === 0 && !error && <p className="mt-8 text-ivory/60">No certificates yet.</p>}

      <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
        {certs?.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-4 py-4">
            <span className="font-mono text-sm text-gold">{c.code}</span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-ivory/55">{c.course} · {new Date(c.issued_on + 'T00:00').toLocaleDateString('en-GB')}</p>
            </div>
            <button type="button" onClick={() => download(c, token)} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold">
              <Download size={14} /> PDF
            </button>
            <button type="button" disabled={busy} onClick={() => confirm(`Delete certificate ${c.code}? Its code will stop verifying.`) && send({ action: 'delete', id: c.id })}
              className="text-red-300 hover:text-red-200 disabled:opacity-50" aria-label="Delete certificate">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
