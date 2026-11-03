import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

// Current login + whether it's a team (admin) account. Used by the header buttons.
// Supabase is loaded after the page shows, to keep the first download small.
export function useAuthStatus() {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let unsubscribe = () => {}
    let cancelled = false
    import('./config/supabase').then(({ supabase }) => {
      if (cancelled) return
      supabase.auth.getSession().then(({ data }) => setSession(data.session))
      const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
      unsubscribe = () => data.subscription.unsubscribe()
    })
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session) return setIsAdmin(false)
    fetch('/api/admin/profiles?check=1', { headers: { Authorization: `Bearer ${session.access_token}` } })
      .then((r) => r.json())
      .then((r: { admin?: boolean }) => setIsAdmin(!!r.admin))
      .catch(() => setIsAdmin(false))
  }, [session])

  return { loggedIn: !!session, isAdmin }
}
