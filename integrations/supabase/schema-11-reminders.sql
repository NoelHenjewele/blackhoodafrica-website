-- Blackhood Africa: automatic "finish your profile" reminders.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.
alter table public.profiles
  add column if not exists reminder_count   int not null default 0,
  add column if not exists last_reminded_at timestamptz;
