-- Migration: Add hospitable_listing_id to properties table
-- Needed for edge function to map Hospitable listing IDs → Supabase property UUIDs

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS hospitable_listing_id TEXT;

-- Unique partial index (only where not null) for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_hospitable_listing
  ON properties(hospitable_listing_id)
  WHERE hospitable_listing_id IS NOT NULL;

-- COMMENT: After running this migration, populate hospitable_listing_id for each property.
-- Find listing IDs in Hospitable: Settings > Properties > each property's listing ID in the URL.
-- Example: https://my.hospitable.com/properties/abc123 → hospitable_listing_id = 'abc123'
