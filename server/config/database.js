import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const db = createClient(supabaseUrl, supabaseKey);

// Test the connection
try {
  const { data, error } = await db.from('tournaments').select('count').single();
  if (error) throw error;
  console.log('✅ Database connected');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
}

export default db; 