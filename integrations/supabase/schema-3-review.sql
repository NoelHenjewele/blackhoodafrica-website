-- Blackhood Africa: team review + public boards (phase 3).
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.

-- People allowed into the review page (/admin). Add or remove emails here.
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;  -- no policies: only the website server reads it

-- Web address for each model's public page, e.g. /talent/eladia-edwin
alter table public.profiles add column if not exists slug text unique;

-- Adding, removing or reordering photos also sends the profile back for review.
create or replace function public.photos_need_review() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    update public.profiles set status = 'pending'
    where id = coalesce(new.profile_id, old.profile_id) and status <> 'pending';
  end if;
  return coalesce(new, old);
end $$;

drop trigger if exists photos_need_review on public.photos;
create trigger photos_need_review after insert or update or delete on public.photos
  for each row execute function public.photos_need_review();

-- >>> Replace with your team's emails, one line each, then Run <<<
insert into public.admins (email) values
  ('noel.henje@gmail.com'),
  ('bengodigito@gmail.com'),  -- Godfrey Myinga
  ('emersonpkiondo@gmail.com')
on conflict do nothing;
