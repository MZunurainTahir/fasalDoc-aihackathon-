-- ============================================================================
-- FasalDoc — Supabase schema
--
-- This was referenced throughout the frontend (src/lib/supabase.ts,
-- AuthContext, HomeScreen, CaptureScreen, AssistantScreen, HistoryScreen)
-- but never actually existed in the project — the app worked only in local
-- IndexedDB/demo mode. Run this once in your Supabase project's SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run) before deploying.
-- ============================================================================

-- ── profiles ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  location text not null default '',
  farming_type text not null default 'crop', -- 'crop' | 'livestock' | 'both'
  preferred_language text not null default 'en', -- 'en' | 'ur'
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── diagnoses ─────────────────────────────────────────────────────────────
create table if not exists public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('crop', 'livestock')),
  image_url text,
  predicted_disease text,
  confidence numeric,
  remedy_applied text,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists diagnoses_user_id_idx on public.diagnoses(user_id);
create index if not exists diagnoses_created_at_idx on public.diagnoses(created_at desc);

-- ── chat_sessions ─────────────────────────────────────────────────────────
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists chat_sessions_user_id_idx on public.chat_sessions(user_id);

-- ── chat_messages ─────────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_session_id_idx on public.chat_messages(session_id);

-- ── recovery_cases ────────────────────────────────────────────────────────
create table if not exists public.recovery_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  diagnosis_id uuid references public.diagnoses(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'improved', 'no_change', 'worse')),
  days_since_diagnosis int,
  follow_up_photo_url text,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists recovery_cases_user_id_idx on public.recovery_cases(user_id);
create index if not exists recovery_cases_status_idx on public.recovery_cases(status);

-- ============================================================================
-- Row Level Security — required since the app uses the public anon key.
-- Every table is locked to "only the owning user can read/write their rows".
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.diagnoses enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.recovery_cases enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "diagnoses_all_own" on public.diagnoses;
create policy "diagnoses_all_own" on public.diagnoses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "chat_sessions_all_own" on public.chat_sessions;
create policy "chat_sessions_all_own" on public.chat_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "chat_messages_all_own" on public.chat_messages;
create policy "chat_messages_all_own" on public.chat_messages for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "recovery_cases_all_own" on public.recovery_cases;
create policy "recovery_cases_all_own" on public.recovery_cases for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- Auto-create a profile row whenever a new auth user signs up.
-- Mirrors what AuthContext.signUp() sends as user_metadata.full_name.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, location, farming_type, preferred_language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    '',
    'both',
    'en'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
