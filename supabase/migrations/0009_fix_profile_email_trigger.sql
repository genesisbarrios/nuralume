-- ============================================================================
-- Re-apply the profiles.email auto-provisioning fix.
--
-- Diagnosis: 0007_profiles_email.sql backfilled existing rows and redefined
-- handle_new_user() to insert email at signup time. Live data shows the
-- one-time backfill took effect (profiles created before 2026-07-14 15:32
-- UTC have email populated), but every profile created after that point has
-- a null email — meaning the "create or replace function" half of 0007 never
-- actually took effect on this database (most likely only the backfill
-- statement was run against it, e.g. pasted/executed separately). The
-- on_auth_user_created trigger (from 0001_init.sql) has therefore been
-- calling the OLD id-only version of handle_new_user() for every signup
-- since, silently leaving email null.
--
-- This migration is idempotent and safe to re-run.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

-- Re-run the backfill for anyone who signed up while the old trigger version
-- was active.
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and (p.email is null or p.email <> u.email);
