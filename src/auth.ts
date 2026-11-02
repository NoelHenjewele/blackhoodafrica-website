import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './config/supabase'

// Current login + whether it's a team (admin) account. Used by the header buttons.
export function useAuthStatus() {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return setIsAdmin(false)
    fetch('/api/admin/check', { headers: { Authorization: `Bearer ${session.access_token}` } })
      .then((r) => r.json())
      .then((r: { admin?: boolean }) => setIsAdmin(!!r.admin))
      .catch(() => setIsAdmin(false))
  }, [session])

  return { loggedIn: !!session, isAdmin }
}
