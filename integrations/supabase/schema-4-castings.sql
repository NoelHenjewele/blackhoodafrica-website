-- Blackhood Africa: castings board (phase 5).
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.

create table if not exists public.castings (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  type        text,                 -- e.g. TV ad, Runway, Photoshoot
  date_text   text,                 -- free text: "15 Nov 2026" or "Every Saturday"
  place       text,
  details     text,                 -- who you're looking for, pay, what to bring
  status      text not null default 'open' check (status in ('open', 'closed')),
  created_at  timestamptz not null default now()
);

-- One row per model who tapped "I'm interested".
create table if not exists public.casting_interest (
  casting_id  uuid not null references public.castings (id) on delete cascade,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (casting_id, profile_id)
);

-- Only the website's server (secret key) reads and writes these. No browser access.
alter table public.castings enable row level security;
alter table public.casting_interest enable row level security;
