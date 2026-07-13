-- Nuralume initial schema
-- Run in the Supabase SQL editor, or via `supabase db push` if using the CLI.

-- ============================================================================
-- profiles: 1:1 extension of auth.users, holds birth data for astrology/HD
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  birth_date date,
  birth_time time,
  birth_city text,
  birth_country_code text,
  horoscope_frequency text not null default 'daily' check (horoscope_frequency in ('daily', 'weekly')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Lets saveBirthData's upsert self-heal if the auto-provisioning trigger
-- below never ran for this user (e.g. account created before the trigger
-- existed), instead of depending solely on the trigger for row creation.
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-provision a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- reminders + reminder_completions
-- ============================================================================
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  is_default boolean not null default false,
  -- Category-tagged reminders get a rotating message throughout the day (see
  -- libs/reminderMessages.ts) instead of a fixed title-only checklist item.
  -- Null for freeform custom reminders.
  category text check (category in ('hydration', 'nutrition', 'meditation', 'exercise', 'grounding', 'coping_skills')),
  created_at timestamptz not null default now()
);

create table public.reminder_completions (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null references public.reminders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  completed_date date not null,
  created_at timestamptz not null default now(),
  unique (reminder_id, completed_date)
);

alter table public.reminders enable row level security;
alter table public.reminder_completions enable row level security;

create policy "reminders_all_own" on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reminder_completions_all_own" on public.reminder_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seed the three default reminders for a new user.
create function public.handle_new_user_reminders()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.reminders (user_id, title, sort_order, is_default, category) values
    (new.id, 'Meditate', 0, true, 'meditation'),
    (new.id, 'Drink water', 1, true, 'hydration'),
    (new.id, 'Cook a healthy meal', 2, true, 'nutrition');
  return new;
end;
$$;

create trigger on_auth_user_created_reminders
  after insert on auth.users
  for each row execute procedure public.handle_new_user_reminders();

-- ============================================================================
-- affirmation_favorites
-- ============================================================================
create table public.affirmation_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  affirmation_id text not null,
  affirmation_text text not null,
  created_at timestamptz not null default now(),
  unique (user_id, affirmation_id)
);

alter table public.affirmation_favorites enable row level security;

create policy "affirmation_favorites_all_own" on public.affirmation_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- personality_results (numerology / astrology / human_design)
-- ============================================================================
create table public.personality_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  test_type text not null check (test_type in ('numerology', 'astrology', 'human_design', 'mbti', 'big_five', 'archetype', 'horoscope')),
  result jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, test_type)
);

alter table public.personality_results enable row level security;

create policy "personality_results_all_own" on public.personality_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- tracks: app-managed healing-music library (not user-owned)
-- ============================================================================
create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('brain_waves', 'solfeggio', 'binaural_beats')),
  label text not null,
  storage_path text not null,
  duration_seconds int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.tracks enable row level security;

-- Readable by any signed-in user; managed via the Supabase dashboard
-- (Table Editor + Storage upload), not through app UI, so there is no
-- client-facing insert/update/delete policy.
create policy "tracks_select_authenticated" on public.tracks
  for select using (auth.role() = 'authenticated');

-- ============================================================================
-- indexes
-- ============================================================================
create index on public.reminders (user_id);
create index on public.reminder_completions (user_id, completed_date);
create index on public.affirmation_favorites (user_id);
create index on public.personality_results (user_id);
create index on public.tracks (category, sort_order);

-- ============================================================================
-- storage: healing-music bucket (public read) for uploaded audio files
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('healing-music', 'healing-music', true)
on conflict (id) do nothing;

create policy "healing_music_public_read" on storage.objects
  for select using (bucket_id = 'healing-music');
