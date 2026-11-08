import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

// Team-only: bring older applications (Sheet only) into /admin as Pending profiles with their photos.
export default function ImportFromSheet({ token, onDone }: { token: string; onDone: () => void }) {
  const [busy, setBusy] = useState('')
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  const call = (body: object) =>
    fetch('/api/admin/profiles?import=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }).then((r) => r.json())

  async function run() {
    setResult(null)
    setBusy('Checking the Sheet…')
    try {
      const list = (await call({ step: 'list' })) as { ok: boolean; todo?: { ref: string; name: string; email: string }[] }
      if (!list.ok) throw new Error()
      const todo = list.todo ?? []
      if (!todo.length) {
        setResult({ ok: true, text: 'Everyone in the Sheet is already on /admin with photos.' })
        return
      }
      let added = 0
      let failed = 0
      for (const [i, row] of todo.entries()) {
        setBusy(`Importing ${i + 1} of ${todo.length}: ${row.name}`)
        const r = (await call({ step: 'one', ref: row.ref, email: row.email }).catch(() => ({ ok: false }))) as { ok: boolean; created?: boolean; reason?: string }
        if (r.ok && (r.created || r.reason === 'photos added')) added++
        else failed++
      }
      setResult({
        ok: failed === 0,
        text: `${added} imported into Pending.${failed ? ` ${failed} couldn’t be imported (check their email in the Sheet).` : ''}`,
      })
      onDone()
    } catch {
      setResult({ ok: false, text: 'Couldn’t reach the Sheet. Please try again.' })
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 border border-ivory/10 bg-ink-soft p-4 text-sm">
      <span className="text-ivory/85">Applied before 8 Nov and not listed here?</span>
      <button type="button" disabled={!!busy} onClick={run}
        className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-ink disabled:opacity-60">
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} {busy || 'Import from Sheet'}
      </button>
      {result && <span className={`w-full ${result.ok ? 'text-green-300' : 'text-red-300'}`}>{result.text}</span>}
    </div>
  )
}
