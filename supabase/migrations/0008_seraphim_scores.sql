-- Seraphim Crystal Collector leaderboard: one row per user holding their
-- best-ever score. leaderboard_name is a randomly generated, spiritually
-- themed display name assigned once on a user's first submitted score, so
-- real names/emails are never shown publicly.
create table public.seraphim_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  leaderboard_name text not null,
  score int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.seraphim_scores enable row level security;

-- Every signed-in user can read the whole leaderboard (needed to render top
-- scores and let a user locate their own row), but can only write their own.
create policy "seraphim_scores_select_authenticated" on public.seraphim_scores
  for select using (auth.role() = 'authenticated');

create policy "seraphim_scores_insert_own" on public.seraphim_scores
  for insert with check (auth.uid() = user_id);

create policy "seraphim_scores_update_own" on public.seraphim_scores
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index on public.seraphim_scores (score desc);
