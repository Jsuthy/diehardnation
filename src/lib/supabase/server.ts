import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function getAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export function getPublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}
