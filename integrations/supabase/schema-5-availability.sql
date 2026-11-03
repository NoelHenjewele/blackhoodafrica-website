-- Blackhood Africa: model availability (busy days). Phase 6.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.

-- One row per day a model is NOT available. Kept separate from profiles so marking a busy day
-- doesn't send the profile back to review.
create table if not exists public.busy_days (
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  day         date not null,
  primary key (profile_id, day)
);

alter table public.busy_days enable row level security;

-- Models manage only their own days. The team reads everyone's through the website's server.
drop policy if exists "Models read their busy days" on public.busy_days;
create policy "Models read their busy days" on public.busy_days
  for select using (auth.uid() = profile_id);

drop policy if exists "Models add their busy days" on public.busy_days;
create policy "Models add their busy days" on public.busy_days
  for insert with check (auth.uid() = profile_id);

drop policy if exists "Models remove their busy days" on public.busy_days;
create policy "Models remove their busy days" on public.busy_days
  for delete using (auth.uid() = profile_id);
