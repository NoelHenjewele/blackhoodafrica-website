import { createClient } from '@supabase/supabase-js'

// Public values: safe in the browser. Row-level security in the database decides what each visitor can read.
export const SUPABASE_URL = 'https://okhbffslttanrqljubdv.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Fz-q-rlYoouHx9hra6SizQ_FOETUuL8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
