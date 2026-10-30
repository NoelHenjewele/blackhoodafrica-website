-- Blackhood Africa: model profiles and photos (phase 2).
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.

-- Profile details the model can edit.
alter table public.profiles
  add column if not exists board      text,
  add column if not exists city       text,
  add column if not exists height_cm  int,
  add column if not exists bust       text,
  add column if not exists waist      text,
  add column if not exists hips       text,
  add column if not exists shoes      text,
  add column if not exists hair       text,
  add column if not exists eyes       text,
  add column if not exists instagram  text,
  add column if not exists tiktok     text,
  add column if not exists bio        text,
  add column if not exists is_minor   boolean not null default false,
  -- draft = never submitted · pending = waiting for Blackhood review · approved = live · hidden = taken down
  add column if not exists status     text not null default 'draft'
    check (status in ('draft', 'pending', 'approved', 'hidden'));

-- Models may update their own row; a trigger keeps identity fields fixed and sends every edit back to review.
drop policy if exists "Models update their own profile" on public.profiles;
create policy "Models update their own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.profile_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    new.talent_code := old.talent_code;
    new.email       := old.email;
    new.full_name   := old.full_name;
    new.is_minor    := old.is_minor;
    new.status      := 'pending';
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profile_guard on public.profiles;
create trigger profile_guard before update on public.profiles
  for each row execute function public.profile_guard();

-- Photos: one row per image, in display order.
create table if not exists public.photos (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  path       text not null,
  position   int  not null default 0,
  created_at timestamptz not null default now()
);

alter table public.photos enable row level security;

drop policy if exists "Models manage their own photos" on public.photos;
create policy "Models manage their own photos" on public.photos
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Photo storage: JPEGs up to 2 MB, each model writes only inside their own folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('talent-photos', 'talent-photos', true, 2097152, array['image/jpeg'])
on conflict (id) do nothing;

drop policy if exists "Models upload to their folder" on storage.objects;
create policy "Models upload to their folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'talent-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Models delete from their folder" on storage.objects;
create policy "Models delete from their folder" on storage.objects
  for delete to authenticated
  using (bucket_id = 'talent-photos' and (storage.foldername(name))[1] = auth.uid()::text);
