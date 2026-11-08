-- Blackhood Africa: messages from the team to a model ("please replace photo 2…"), shown on her account page.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.
alter table public.profiles
  add column if not exists team_note    text,
  add column if not exists team_note_at timestamptz;
