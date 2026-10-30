-- Blackhood Africa: model accounts (phase 1).
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.

-- One profile per approved model, linked to their login.
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  talent_code text not null unique,
  full_name   text not null,
  email       text not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A logged-in model can read only their own profile. Creating profiles is done by the website server only.
drop policy if exists "Models read their own profile" on public.profiles;
create policy "Models read their own profile" on public.profiles
  for select using (auth.uid() = id);

-- Short-lived 6-digit login codes (stored hashed). Only the website server can touch this table.
create table if not exists public.login_codes (
  email      text primary key,
  code_hash  text not null,
  expires_at timestamptz not null,
  attempts   int not null default 0
);

alter table public.login_codes enable row level security;
