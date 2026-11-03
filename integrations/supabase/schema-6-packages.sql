-- Blackhood Africa: client packages (a private link with a hand-picked set of models). Phase 7.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.

create table if not exists public.packages (
  id          uuid primary key default gen_random_uuid(),
  token       text not null unique,          -- the private part of the link: /p/<token>
  title       text not null,                 -- e.g. "Bank TV ad – women 20–28"
  client      text,                          -- who it's for (team only, not shown to the client)
  note        text,                          -- short message shown at the top of the page
  slugs       text[] not null default '{}',  -- the models, in order
  views       int not null default 0,
  created_at  timestamptz not null default now()
);

-- Only the website's server (secret key) reads and writes packages.
alter table public.packages enable row level security;
