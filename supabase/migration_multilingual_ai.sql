-- ==============================================================================
-- PASHU SHIELD — Multilingual, AI Assistant & Exclusive USPs Database Migration
-- Safe & Non-Destructive: Preserves all existing tables (cases, animals, animal_health_records)
-- Run this in Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create table for Preventive Care & Vaccination Compliance (USP 4)
create table if not exists public.compliance_schedules (
  id text primary key,                               -- e.g. 'SCH-001'
  animal_id text not null references public.animals(id) on delete cascade,
  livestock_id text,                                 -- 12-digit Yellow Tag ID
  protocol text not null,                            -- Vaccine or preventive care name
  due_date date not null,
  status text not null check (status in ('upcoming', 'overdue', 'completed')),
  type text not null check (type in ('vaccination', 'preventive', 'followup')),
  source text not null,                              -- e.g. 'NADCP', 'DAHD Guidelines'
  notes text,
  completed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists compliance_animal_id_idx on public.compliance_schedules (animal_id);
create index if not exists compliance_due_date_idx on public.compliance_schedules (due_date);
create index if not exists compliance_status_idx on public.compliance_schedules (status);

-- 2. Create table for Lab Referral & Cold Chain Tracking (Feature 6)
create table if not exists public.lab_referrals (
  case_id text primary key references public.cases(case_id) on delete cascade,
  animal_id text references public.animals(id) on delete set null,
  livestock_id text,
  priority text not null check (priority in ('Standard', 'High', 'Urgent')),
  assigned_vet text not null,
  stage text not null check (stage in ('requested', 'collection_pending', 'in_transit', 'analyzing', 'results_available')),
  sample_type text not null,
  lab_name text not null,
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lab_referrals_stage_idx on public.lab_referrals (stage);
create index if not exists lab_referrals_priority_idx on public.lab_referrals (priority);

-- 3. Create table for Record Inaccuracy Corrections (Feature 8)
create table if not exists public.record_corrections (
  id text primary key default ('CORR-' || substr(md5(random()::text), 1, 8)),
  livestock_id text,
  requester_contact text not null,
  issue_description text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'resolved')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create index if not exists record_corrections_status_idx on public.record_corrections (status);

-- 4. Enable Row Level Security (RLS) on new tables
alter table public.compliance_schedules enable row level security;
alter table public.lab_referrals enable row level security;
alter table public.record_corrections enable row level security;

-- Demo stage policies granting authenticated & anon read/write permissions
grant select, insert, update on table public.compliance_schedules to anon, authenticated;
grant select, insert, update on table public.lab_referrals to anon, authenticated;
grant select, insert, update on table public.record_corrections to anon, authenticated;

-- Policies for public.compliance_schedules
drop policy if exists "demo can read compliance schedules" on public.compliance_schedules;
create policy "demo can read compliance schedules"
on public.compliance_schedules for select to anon, authenticated
using (true);

drop policy if exists "demo can insert compliance schedules" on public.compliance_schedules;
create policy "demo can insert compliance schedules"
on public.compliance_schedules for insert to anon, authenticated
with check (true);

drop policy if exists "demo can update compliance schedules" on public.compliance_schedules;
create policy "demo can update compliance schedules"
on public.compliance_schedules for update to anon, authenticated
using (true) with check (true);

-- Policies for public.lab_referrals
drop policy if exists "demo can read lab referrals" on public.lab_referrals;
create policy "demo can read lab referrals"
on public.lab_referrals for select to anon, authenticated
using (true);

drop policy if exists "demo can insert lab referrals" on public.lab_referrals;
create policy "demo can insert lab referrals"
on public.lab_referrals for insert to anon, authenticated
with check (true);

drop policy if exists "demo can update lab referrals" on public.lab_referrals;
create policy "demo can update lab referrals"
on public.lab_referrals for update to anon, authenticated
using (true) with check (true);

-- Policies for public.record_corrections
drop policy if exists "demo can read record corrections" on public.record_corrections;
create policy "demo can read record corrections"
on public.record_corrections for select to anon, authenticated
using (true);

drop policy if exists "demo can insert record corrections" on public.record_corrections;
create policy "demo can insert record corrections"
on public.record_corrections for insert to anon, authenticated
with check (true);

-- 5. Seed initial compliance schedules matching prototype animals
insert into public.compliance_schedules (id, animal_id, livestock_id, protocol, due_date, status, type, source, notes)
values
  ('SCH-001', 'ANM-1001', '100234567891', 'FMD Booster Immunization (Round 5)', current_date + 15, 'upcoming', 'vaccination', 'National Animal Disease Control Programme (NADCP)', 'Bi-annual Foot and Mouth Disease mandatory booster.'),
  ('SCH-002', 'ANM-1002', '100234567892', 'Hemorrhagic Septicemia (HS) Annual Dose', current_date - 10, 'overdue', 'vaccination', 'DAHD Pre-monsoon Schedule', 'Delayed booster; high priority for monsoon belt.'),
  ('SCH-003', 'ANM-1001', '100234567891', 'Quarterly Broad-Spectrum Deworming', current_date + 5, 'upcoming', 'preventive', 'Veterinary Officer Clinical Recommendation', 'Administer prescribed albendazole bolus with feed.'),
  ('SCH-004', 'ANM-1003', '100234567893', 'Post-Treatment Clinical Re-examination', current_date + 2, 'upcoming', 'followup', 'Dr. Sharma (VO) Follow-up', 'Verify lung auscultation and recovery from cough.')
on conflict (id) do nothing;
