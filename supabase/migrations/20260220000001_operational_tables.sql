-- Migration: Create operational tables for DOR Dashboard v2
-- These tables may already exist in the live database (created via dashboard).
-- Using IF NOT EXISTS for idempotency.

-- ═══════════════════════════════════════════════════════════════
-- RESERVATIONS — Check-ins and check-outs from Hospitable
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,

  -- Guest details
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,

  -- Booking dates
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  check_in_time TIME,
  check_out_time TIME,

  -- Booking info
  status TEXT NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,

  -- Platform / source
  source TEXT DEFAULT 'direct'
    CHECK (source IN ('hospitable', 'airbnb', 'booking', 'direct', 'agoda', 'vrbo')),
  external_id TEXT,                  -- Hospitable reservation ID (for dedup)
  platform_reservation_id TEXT,      -- Airbnb/Booking confirmation number

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- CLEANING_JOBS — Cleaning/turnover tasks
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.cleaning_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,

  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  assigned_to_name TEXT,             -- Denormalized for display

  -- Schedule
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,

  -- Job details
  job_type TEXT DEFAULT 'turnover'
    CHECK (job_type IN ('turnover', 'deep_clean', 'mid_stay', 'inspection')),
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'issue')),
  checklist_completed BOOLEAN DEFAULT false,

  -- Tracking
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  turno_job_id TEXT,                 -- External Turno ID if synced

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- TASKS — General operational tasks
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,

  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  assigned_to_name TEXT,
  created_by UUID REFERENCES auth.users(id),

  -- Task details
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,

  -- Tracking
  completed_at TIMESTAMPTZ,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_reservations_property ON reservations(property_id);
CREATE INDEX IF NOT EXISTS idx_reservations_checkin ON reservations(check_in_date);
CREATE INDEX IF NOT EXISTS idx_reservations_checkout ON reservations(check_out_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reservations_external ON reservations(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cleaning_jobs_property ON cleaning_jobs(property_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_jobs_date ON cleaning_jobs(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_tasks_property ON tasks(property_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do everything (MVP — tighten later)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for authenticated' AND tablename = 'reservations') THEN
    CREATE POLICY "Allow all for authenticated" ON reservations FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for authenticated' AND tablename = 'cleaning_jobs') THEN
    CREATE POLICY "Allow all for authenticated" ON cleaning_jobs FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for authenticated' AND tablename = 'tasks') THEN
    CREATE POLICY "Allow all for authenticated" ON tasks FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- AUTO-CREATE CLEANING JOB ON NEW RESERVATION
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.create_cleaning_job_for_reservation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cleaning_jobs (property_id, reservation_id, scheduled_date, job_type, status)
  VALUES (NEW.property_id, NEW.id, NEW.check_out_date, 'turnover', 'scheduled');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_cleaning_job ON reservations;
CREATE TRIGGER trigger_create_cleaning_job
  AFTER INSERT ON reservations
  FOR EACH ROW
  WHEN (NEW.status != 'cancelled')
  EXECUTE FUNCTION public.create_cleaning_job_for_reservation();

-- ═══════════════════════════════════════════════════════════════
-- UPDATED_AT TRIGGER (shared function)
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_reservations_updated ON reservations;
CREATE TRIGGER set_reservations_updated
  BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_cleaning_updated ON cleaning_jobs;
CREATE TRIGGER set_cleaning_updated
  BEFORE UPDATE ON cleaning_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_tasks_updated ON tasks;
CREATE TRIGGER set_tasks_updated
  BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
