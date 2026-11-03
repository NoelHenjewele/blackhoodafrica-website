-- Blackhood Africa: academy certificates + parent consent for under-18s. Phase 10.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.

-- Academy certificates. Anyone can check a code (BHA-C-0001) on /verify through the website's server.
create table if not exists public.certificates (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  course      text not null,
  issued_on   date not null default current_date,
  created_at  timestamptz not null default now()
);
alter table public.certificates enable row level security;

-- Parent / guardian consent for an under-18 model, signed on the model's account page.
create table if not exists public.parent_consents (
  profile_id    uuid primary key references public.profiles (id) on delete cascade,
  parent_name   text not null,
  relationship  text not null,
  phone         text not null,
  signed_name   text not null,
  signed_at     timestamptz not null default now()
);
alter table public.parent_consents enable row level security;

drop policy if exists "Models read their consent" on public.parent_consents;
create policy "Models read their consent" on public.parent_consents
  for select using (auth.uid() = profile_id);

drop policy if exists "Models add their consent" on public.parent_consents;
create policy "Models add their consent" on public.parent_consents
  for insert with check (auth.uid() = profile_id);

drop policy if exists "Models update their consent" on public.parent_consents;
create policy "Models update their consent" on public.parent_consents
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
