import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(
  supabaseUrl || 'https://vaxczhfpubqthhagywlg.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGN6aGZwdWJxdGhoYWd5d2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNjk4ODIsImV4cCI6MjEwMTg0NTg4Mn0.3bhHUhWZe_ZZ6OSFQDzqBVbEbtuZQif73sDanwHQB4s',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'implicit',
    },
  }
);

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  location: string;
  farming_type: string;
  preferred_language: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Diagnosis = {
  id: string;
  user_id: string;
  type: 'crop' | 'livestock';
  image_url: string | null;
  predicted_disease: string | null;
  confidence: number | null;
  remedy_applied: string | null;
  notes: string | null;
  created_at: string;
};

export type ChatSession = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type RecoveryCase = {
  id: string;
  user_id: string;
  diagnosis_id: string | null;
  status: 'active' | 'improved' | 'no_change' | 'worse';
  days_since_diagnosis: number | null;
  follow_up_photo_url: string | null;
  last_checked_at: string | null;
  created_at: string;
};