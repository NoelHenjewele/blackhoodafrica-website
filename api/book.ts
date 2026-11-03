// Vercel Function: receives a booking request from /clients and forwards it to the Google Sheet script
// (same script and settings as /api/apply: APPLY_SCRIPT_URL and APPLY_SECRET).
// ?admin=1 is the team's Bookings tab on /admin (one file because Vercel's free plan allows 12 functions).
import { adminClient, callSheet } from './_lib/supabaseAdmin.js'
import { requireAdmin } from './_lib/profiles.js'

type Body = {
  name?: string
  company?: string
  phone?: string
  email?: string
  jobType?: string
  dates?: string
  location?: string
  talent?: string
  budget?: string
  usage?: string
  notes?: string
  lang?: string
  website?: string // honeypot
}

export async function POST(request: Request) {
  if (isAdmin(request)) return adminPOST(request)
  const url = process.env.APPLY_SCRIPT_URL
  const secret = process.env.APPLY_SECRET
  if (!url || !secret) return Response.json({ ok: false, error: 'not configured' }, { status: 503 })

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return Response.json({ ok: false, error: 'bad request' }, { status: 400 })
  }

  if (body.website) return Response.json({ ok: true, ref: 'BKG-OK' })

  const missing = !body.name?.trim() || !body.email?.trim() || !body.phone?.trim() || !body.jobType?.trim() || !body.dates?.trim()
  if (missing) return Response.json({ ok: false, error: 'missing fields' }, { status: 400 })

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...body, type: 'booking', secret }),
      redirect: 'follow',
    })
    const result = (await res.json()) as { ok: boolean; ref?: string }
    if (!result.ok) return Response.json({ ok: false, error: 'save failed' }, { status: 502 })
    return Response.json({ ok: true, ref: result.ref })
  } catch {
    return Response.json({ ok: false, error: 'save failed' }, { status: 502 })
  }
}

const isAdmin = (request: Request) => new URL(request.url).searchParams.has('admin')

async function teamOnly(request: Request) {
  const db = adminClient()
  return !!db && !!(await requireAdmin(db, request))
}

// Team: list booking requests from the Sheet.
export async function GET(request: Request) {
  if (!isAdmin(request) || !(await teamOnly(request))) return Response.json({ ok: false }, { status: 403 })
  const result = await callSheet<{ ok: boolean; bookings?: unknown[]; statuses?: string[] }>({ type: 'list-bookings' })
  if (!result?.ok) return Response.json({ ok: false, error: 'sheet' }, { status: 502 })
  return Response.json(result, { headers: { 'Cache-Control': 'private, no-store' } })
}

// Team: change a booking's status or notes.
async function adminPOST(request: Request) {
  if (!(await teamOnly(request))) return Response.json({ ok: false }, { status: 403 })
  let body: { ref?: string; status?: string; notes?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (!body.ref) return Response.json({ ok: false }, { status: 400 })
  const result = await callSheet<{ ok: boolean }>({ type: 'booking-status', ref: body.ref, status: body.status, notes: body.notes })
  return Response.json({ ok: !!result?.ok }, { status: result?.ok ? 200 : 502 })
}