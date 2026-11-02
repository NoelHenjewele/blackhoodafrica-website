// Tells the header whether the signed-in user is on the team (to show the Admin button).
import { adminClient } from '../_lib/supabaseAdmin.js'
import { requireAdmin } from '../_lib/profiles.js'

export async function GET(request: Request) {
  const db = adminClient()
  if (!db) return Response.json({ admin: false })
  return Response.json({ admin: !!(await requireAdmin(db, request)) })
}
