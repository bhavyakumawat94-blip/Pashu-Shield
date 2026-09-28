-- ==============================================================================
-- PASHU SHIELD — SIH Round 3 Upgrade Migration
-- Run this in Supabase Dashboard -> SQL Editor
-- Non-destructive: preserves existing cases, users, and tables.
-- ==============================================================================

-- 1. Create Animals table for Individual Animal Health Records (USP 1 & USP 2)
create table if not exists public.animals (
  id text primary key,                               -- e.g. 'ANM-1001'
  livestock_id text unique check (livestock_id is null or livestock_id ~ '^\d{12}$'), -- 12-digit Yellow Card ID
  name_tag text not null,                           -- Name or ear-tag label
  species text not null,                            -- Cattle, Buffalo, Goat, Sheep, etc.
  breed text,
  age_years numeric check (age_years >= 0),
  sex text check (sex in ('Female', 'Male')),
  owner_name text not null,
  village text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists animals_village_idx on public.animals (village);
create index if not exists animals_species_idx on public.animals (species);
create index if not exists animals_livestock_id_idx on public.animals (livestock_id);
create index if not exists animals_owner_idx on public.animals (owner_name);

-- 2. Create Animal Health Records table for vaccinations, treatments, and checkups (USP 1)
create table if not exists public.animal_health_records (
  id text primary key,                               -- e.g. 'REC-2001'
  animal_id text not null references public.animals(id) on delete cascade,
  record_type text not null check (record_type in ('vaccination', 'treatment', 'checkup', 'lab_test', 'case')),
  title text not null,
  details text,
  administered_by text,
  record_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists health_records_animal_id_idx on public.animal_health_records (animal_id);
create index if not exists health_records_date_idx on public.animal_health_records (record_date desc);

-- 3. Extend Cases table with Animal reference, 12-digit Livestock ID, Voice attributes, and Risk breakdown (USPs 1-5)
alter table public.cases add column if not exists animal_id text references public.animals(id) on delete set null;
alter table public.cases add column if not exists livestock_id text;
alter table public.cases add column if not exists voice_lang text default 'en-IN';
alter table public.cases add column if not exists transcription text;
alter table public.cases add column if not exists risk_breakdown jsonb default '[]'::jsonb;
alter table public.cases add column if not exists sync_client_id text unique;

create index if not exists cases_animal_id_idx on public.cases (animal_id);
create index if not exists cases_livestock_id_idx on public.cases (livestock_id);

-- 4. Enable Row Level Security (RLS) on new tables
alter table public.animals enable row level security;
alter table public.animal_health_records enable row level security;

-- Grant browser permissions for demo stage (matching existing cases table setup)
grant select, insert, update on table public.animals to anon, authenticated;
grant select, insert, update on table public.animal_health_records to anon, authenticated;

-- Policies for public.animals
drop policy if exists "demo can read animals" on public.animals;
create policy "demo can read animals"
on public.animals for select to anon, authenticated
using (true);

drop policy if exists "demo can insert animals" on public.animals;
create policy "demo can insert animals"
on public.animals for insert to anon, authenticated
with check (true);

drop policy if exists "demo can update animals" on public.animals;
create policy "demo can update animals"
on public.animals for update to anon, authenticated
using (true) with check (true);

-- Policies for public.animal_health_records
drop policy if exists "demo can read health records" on public.animal_health_records;
create policy "demo can read health records"
on public.animal_health_records for select to anon, authenticated
using (true);

drop policy if exists "demo can insert health records" on public.animal_health_records;
create policy "demo can insert health records"
on public.animal_health_records for insert to anon, authenticated
with check (true);

drop policy if exists "demo can update health records" on public.animal_health_records;
create policy "demo can update health records"
on public.animal_health_records for update to anon, authenticated
using (true) with check (true);

-- 5. Seed Initial Animal Digital Profiles matching existing prototype cases
insert into public.animals (id, livestock_id, name_tag, species, breed, age_years, sex, owner_name, village)
values
  ('ANM-1001', '100234567891', 'Gauri (Tag #42)', 'Cattle', 'Sahiwal', 4.5, 'Female', 'Ramesh Patel', 'Village A'),
  ('ANM-1002', '100234567892', 'Bhima (Tag #18)', 'Buffalo', 'Murrah', 5.0, 'Male', 'Suresh Deshmukh', 'Village B'),
  ('ANM-1003', '100234567893', 'Kaveri (Tag #77)', 'Cattle', 'Gir Cross', 3.0, 'Female', 'Anand Kulkarni', 'Village C'),
  ('ANM-1004', null,           'Rani (Tag #09)',  'Goat',   'Jamnapari', 2.0, 'Female', 'Ramesh Patel', 'Village A')
on conflict (id) do nothing;

-- 6. Seed Animal Health History (Vaccinations & Treatments)
insert into public.animal_health_records (id, animal_id, record_type, title, details, administered_by, record_date)
values
  ('REC-2001', 'ANM-1001', 'vaccination', 'FMD Vaccination (Round 4)', 'Administered Foot & Mouth Disease bivalent vaccine', 'Dr. Sharma (VO)', current_date - 45),
  ('REC-2002', 'ANM-1001', 'vaccination', 'Brucellosis Strain 19', 'Standard heifer immunisation dose', 'Dr. Sharma (VO)', current_date - 180),
  ('REC-2003', 'ANM-1001', 'checkup',     'Routine Herd Surveillance', 'Normal vitals, clean rumination', 'Field Officer Varma', current_date - 15),
  ('REC-2004', 'ANM-1002', 'vaccination', 'HS + BQ Combined Vaccine', 'Pre-monsoon booster administered', 'Dr. Sharma (VO)', current_date - 60),
  ('REC-2005', 'ANM-1002', 'treatment',   'Mild Indigestion Treatment', 'Administered liver tonic & oral probiotics', 'Dr. Sharma (VO)', current_date - 20),
  ('REC-2006', 'ANM-1003', 'vaccination', 'FMD Vaccination (Round 4)', 'Scheduled vaccination completed', 'Dr. Sharma (VO)', current_date - 40)
on conflict (id) do nothing;

-- 7. Link existing prototype cases to the seeded animals
update public.cases set animal_id = 'ANM-1001', livestock_id = '100234567891' where case_id = 'PS-1024';
update public.cases set animal_id = 'ANM-1003', livestock_id = '100234567893' where case_id = 'PS-1021';
update public.cases set animal_id = 'ANM-1002', livestock_id = '100234567892' where case_id = 'PS-1019';
