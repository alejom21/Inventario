import { createClient } from '@supabase/supabase-js';

/* const supabaseUrl = 'https://tnzjfygqzyijhnyuccsm.supabase.co';
const supabaseKey = 'sb_publishable_dXPkpx5lHjK2miV_plMUxQ_A2sUbEi6'; */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);