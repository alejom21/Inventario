import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnzjfygqzyijhnyuccsm.supabase.co';
const supabaseKey = 'sb_publishable_dXPkpx5lHjK2miV_plMUxQ_A2sUbEi6';

export const supabase = createClient(supabaseUrl, supabaseKey);