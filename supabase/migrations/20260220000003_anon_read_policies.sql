-- Migration: Add RLS SELECT policies for anon role
-- Required for Apps Script (DOR Dashboard v2) which uses the Supabase anon key.
-- These are READ-ONLY policies — anon can only SELECT, not INSERT/UPDATE/DELETE.

-- Reservations: anon can read all (for DOR check-ins/check-outs)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon read reservations' AND tablename = 'reservations') THEN
    CREATE POLICY "Allow anon read reservations" ON reservations FOR SELECT USING (true);
  END IF;
END $$;

-- Cleaning Jobs: anon can read all (for DOR cleaning tasks)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon read cleaning_jobs' AND tablename = 'cleaning_jobs') THEN
    CREATE POLICY "Allow anon read cleaning_jobs" ON cleaning_jobs FOR SELECT USING (true);
  END IF;
END $$;

-- Tasks: anon can read all (for DOR general tasks)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon read tasks' AND tablename = 'tasks') THEN
    CREATE POLICY "Allow anon read tasks" ON tasks FOR SELECT USING (true);
  END IF;
END $$;

-- Properties: anon can read all (for property name resolution in DOR)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon read properties' AND tablename = 'properties') THEN
    CREATE POLICY "Allow anon read properties" ON properties FOR SELECT USING (true);
  END IF;
END $$;
