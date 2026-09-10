-- PASHU SHIELD database schema
-- Run this in Supabase Dashboard -> SQL Editor.

create table if not exists public.cases (
  case_id text primary key,
  village text not null,
  species text not null,
  affected integer not null check (affected >= 0),
  mortality integer not null default 0 check (mortality >= 0),
  score integer not null check (score between 0 and 100),
  status text not null check (status in ('High','Medium','Low')),
  symptoms text[] not null default '{}',
  reported_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists cases_village_idx on public.cases (village);
create index if not exists cases_status_idx on public.cases (status);
create index if not exists cases_created_at_idx on public.cases (created_at desc);

-- Demo-stage browser access. For production, add Supabase Auth and tighter RLS policies.
alter table public.cases enable row level security;

revoke all on table public.cases from anon, authenticated;
grant select, insert, update on table public.cases to anon, authenticated;

drop policy if exists "demo can read cases" on public.cases;
create policy "demo can read cases"
on public.cases for select to anon, authenticated
using (true);

drop policy if exists "demo can insert cases" on public.cases;
create policy "demo can insert cases"
on public.cases for insert to anon, authenticated
with check (true);

drop policy if exists "demo can update cases" on public.cases;
create policy "demo can update cases"
on public.cases for update to anon, authenticated
using (true)
with check (true);

-- Seed the three cases already shown in the prototype.
insert into public.cases (case_id, village, species, affected, mortality, score, status, symptoms, reported_date)
values
  ('PS-1024','Village A','Cattle',5,1,82,'High',array['Fever','Nasal discharge','Reduced appetite'],current_date),
  ('PS-1021','Village C','Cattle',3,0,76,'High',array['Fever','Cough'],current_date),
  ('PS-1019','Village B','Buffalo',7,0,54,'Medium',array['Reduced appetite','Lethargy'],current_date - 1)
on conflict (case_id) do nothing;
