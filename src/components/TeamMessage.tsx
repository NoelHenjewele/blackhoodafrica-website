import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'

// Team-only: send a model a note about her profile ("please replace photo 2…").
// It's saved on her profile (gold box on her account page), emailed, and can be copied for WhatsApp.
type Props = {
  token: string
  profile: { id: string; full_name: string; talent_code: string; photos: string[]; team_note?: string | null; team_note_at?: string | null }
  onSent: () => void
}

export default function TeamMessage({ token, profile, onSent }: Props) {
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const first = profile.full_name.split(' ')[0]

  const addLine = (line: string) => setNote((n) => (n.trim() ? n.trimEnd() + '\n' : '') + line)

  async function send() {
    setBusy(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/profiles?message=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: profile.id, note }),
      })
      const r = (await res.json()) as { ok: boolean; emailed?: boolean; email?: string }
      if (!r.ok) throw new Error()
      setResult({
        ok: true,
        text: r.emailed
          ? `Sent. It's on her account page and emailed to ${r.email}.`
          : 'Saved on her account page, but the email didn’t go out. Use “Copy WhatsApp message”.',
      })
      setNote('')
      onSent()
    } catch {
      setResult({ ok: false, text: 'That didn’t send. Has the team-notes SQL been run in Supabase?' })
    } finally {
      setBusy(false)
    }
  }

  function copy() {
    const text = `Hi ${first}, this is Blackhood Africa about your profile:\n${note || profile.team_note || ''}\nPlease log in at ${window.location.origin}/account${
      /^BHA-T-/.test(profile.talent_code) ? ` (talent code ${profile.talent_code})` : ''
    }, make the change and tap "Save and send for review". Thank you!`
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="mt-5 border border-ivory/10 bg-ink p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ivory/85">Message / request changes</p>
      {profile.team_note && (
        <p className="mt-2 whitespace-pre-line text-sm text-gold">
          Waiting on her{profile.team_note_at ? ` (sent ${new Date(profile.team_note_at).toLocaleDateString('en-GB')})` : ''}: {profile.team_note}
        </p>
      )}
      {profile.photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.photos.map((_, i) => (
            <button key={i} type="button" onClick={() => addLine(`Photo ${i + 1}: please replace it with `)}
              className="rounded-full border border-ivory/20 px-3 py-1 text-xs hover:border-gold hover:text-gold">
              Ask to replace photo {i + 1}
            </button>
          ))}
        </div>
      )}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="e.g. Please add a full-length photo in plain clothes against a plain wall."
        className="mt-3 w-full border border-ivory/15 bg-ink-soft px-3 py-2 text-sm text-ivory placeholder:text-ivory/50 focus:border-gold focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" disabled={busy || !note.trim()} onClick={send}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink hover:bg-ivory disabled:opacity-50">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send to her
        </button>
        <button type="button" disabled={!note.trim() && !profile.team_note} onClick={copy}
          className="rounded-full border border-ivory/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] hover:border-gold disabled:opacity-50">
          {copied ? 'Copied ✓' : 'Copy WhatsApp message'}
        </button>
      </div>
      {result && <p className={`mt-2 text-sm ${result.ok ? 'text-green-300' : 'text-red-300'}`}>{result.text}</p>}
    </div>
  )
}
