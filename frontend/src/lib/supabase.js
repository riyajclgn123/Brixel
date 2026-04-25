import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vhdskuetklxeonjchagz.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZHNrdWV0a2x4ZW9uamNoYWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjk5MzcsImV4cCI6MjA5MjcwNTkzN30.c8Yvw3RfI_re1P6_ZjMJJOSLgjYxd_sE3mKh8IB-DVI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
