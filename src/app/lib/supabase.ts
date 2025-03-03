import { createClient } from '@supabase/supabase-js';

// Supabase URL ve anahtarı ortam değişkenlerinden al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pqkpmnydmiwpdjqakyyd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxa3BtbnlkbWl3cGRqcWFreXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjI5OTMsImV4cCI6MjA1NjU5ODk5M30.Iad1HLOWrIBG4zj2UvxABSNnbqjbZdUJU73hLWKM_-E';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anon Key çevre değişkenleri tanımlanmalıdır.');
}

// Supabase istemcisini oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey);