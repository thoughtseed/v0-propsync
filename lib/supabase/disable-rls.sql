-- This script can be run to temporarily disable RLS for seeding
-- WARNING: Only use this in development environments!

-- Disable RLS on properties table
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;

-- Disable RLS on related tables
ALTER TABLE property_basic_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_safety DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_kitchen DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_bedrooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_bathrooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_technology DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_practical DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_location DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_accessibility DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_completion DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- After seeding, you should re-enable RLS with:
-- ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
-- (and so on for all tables)
