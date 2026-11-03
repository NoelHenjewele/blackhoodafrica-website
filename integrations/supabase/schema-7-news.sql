-- Blackhood Africa: News & events posts (written by the team on /admin). Phase 8.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.

create table if not exists public.news (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  photo_path  text,          -- in the talent-photos bucket, under news/
  created_at  timestamptz not null default now()
);

-- Only the website's server (secret key) reads and writes posts.
alter table public.news enable row level security;
