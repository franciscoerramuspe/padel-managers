import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_PUBLIC_KEY


if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  throw new Error('Missing Supabase environment variables!')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

console.log('✅ Supabase client successfully initialized')

export { supabase, supabaseAdmin }