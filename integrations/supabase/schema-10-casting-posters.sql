-- Blackhood Africa: optional poster image on castings.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.
alter table public.castings add column if not exists photo_path text; -- talent-photos bucket, under castings/
