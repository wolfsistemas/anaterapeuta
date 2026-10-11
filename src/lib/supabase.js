import { createClient } from '@supabase/supabase-js'
import { HAS_SUPABASE, SUPABASE_ANON, SUPABASE_URL } from './config'

export const supabase = HAS_SUPABASE ? createClient(SUPABASE_URL, SUPABASE_ANON) : null
