-- ============================================================================
-- profiles: persist email (previously only lived in auth.users, which isn't
-- queryable from the Table Editor / public schema without elevated access)
-- ============================================================================
alter table public.profiles
  add column if not exists email text;

-- Backfill existing users — the trigger below only covers signups/changes
-- going forward.
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and (p.email is null or p.email <> u.email);

-- New signups: populate email at insert time.
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

-- Keep it in sync if a user changes their email later — otherwise
-- profiles.email silently goes stale after the first change.
create or replace function public.handle_user_email_updated()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update on auth.users
  for each row execute procedure public.handle_user_email_updated();
