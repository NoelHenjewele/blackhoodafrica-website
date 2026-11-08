-- Blackhood Africa: history of everything the team sent a model (notes, manual and automatic reminders).
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.
create table if not exists public.model_messages (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  kind        text not null,          -- message / reminder / auto-reminder
  body        text not null,
  sent_by     text,                   -- team email, or 'system' for automatic reminders
  emailed     boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists model_messages_profile on public.model_messages (profile_id, created_at desc);

-- Only the website's server (secret key) reads and writes the log.
alter table public.model_messages enable row level security;
