-- Blackhood Africa: reviews sent through the website's /review form. Phase 9.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  quote       text not null,
  name        text not null,
  role        text,            -- e.g. "Marketing lead, Azam" or "Parent, Kinondoni"
  kind        text,            -- client / model / parent / other
  contact     text,            -- phone or email, team only, to confirm it's genuine
  status      text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at  timestamptz not null default now()
);

-- Only the website's server (secret key) reads and writes reviews. Nothing shows until the team approves it.
alter table public.reviews enable row level security;
