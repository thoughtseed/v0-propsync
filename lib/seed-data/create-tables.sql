-- This SQL function checks if the necessary tables exist and creates them if they don't
CREATE OR REPLACE FUNCTION check_and_create_tables()
RETURNS void AS $$
BEGIN
  -- Check if properties table exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'properties') THEN
    -- Create properties table
    CREATE TABLE properties (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      property_reference TEXT NOT NULL,
      building_name TEXT NOT NULL,
      unit_number TEXT NOT NULL,
      full_address TEXT NOT NULL,
      property_type TEXT NOT NULL,
      square_meters INTEGER NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      max_occupancy INTEGER NOT NULL,
      primary_photo TEXT,
      year_built TEXT,
      description TEXT,
      status TEXT DEFAULT 'draft',
      occupancy_rate INTEGER,
      avg_rating DECIMAL(3,1),
      revenue_band TEXT,
      
      -- JSON columns for each section
      safety_security JSONB,
      kitchen_dining JSONB,
      bedrooms JSONB,
      bathrooms JSONB,
      technology JSONB,
      laundry_cleaning JSONB,
      outdoor_spaces JSONB,
      building_amenities JSONB,
      hvac_utilities JSONB,
      local_information JSONB,
      luxury_amenities JSONB,
      accessibility JSONB,
      sustainability JSONB,
      maintenance JSONB,
      administrative JSONB,
      checklist_completion JSONB,
      
      -- User reference
      user_id UUID REFERENCES auth.users(id)
    );
    
    -- Create RLS policies
    ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
    
    -- Policy for selecting properties
    CREATE POLICY "Users can view their own properties"
      ON properties FOR SELECT
      USING (auth.uid() = user_id);
    
    -- Policy for inserting properties
    CREATE POLICY "Users can insert their own properties"
      ON properties FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    
    -- Policy for updating properties
    CREATE POLICY "Users can update their own properties"
      ON properties FOR UPDATE
      USING (auth.uid() = user_id);
    
    -- Policy for deleting properties
    CREATE POLICY "Users can delete their own properties"
      ON properties FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
  
  -- Additional tables could be created here if needed
  -- For example, tables for property images, documents, etc.
END;
$$ LANGUAGE plpgsql;
