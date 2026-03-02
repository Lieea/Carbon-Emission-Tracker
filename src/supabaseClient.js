import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhqbdwkxgzslrkydeahm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocWJkd2t4Z3pzbHJreWRlYWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjA3OTAsImV4cCI6MjA4NzgzNjc5MH0.oAOhwkYNB-9xv-802ZWqeFqarnUDJVY3_sZFfuBUsQE';

export const supabase = createClient(supabaseUrl, supabaseKey);
