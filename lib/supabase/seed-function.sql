-- Function to insert a sample property and bypass RLS
CREATE OR REPLACE FUNCTION insert_sample_property(
  p_reference TEXT,
  p_building TEXT,
  p_unit TEXT,
  p_type TEXT,
  p_sqm NUMERIC,
  p_beds INTEGER,
  p_baths INTEGER,
  p_occupancy INTEGER,
  p_user_id UUID,
  p_description TEXT,
  p_address TEXT
) RETURNS UUID AS $$
DECLARE
  property_id UUID;
BEGIN
  -- Insert the property
  INSERT INTO properties (
    property_reference,
    building_name,
    unit_number,
    property_type,
    square_meters,
    bedrooms,
    bathrooms,
    max_occupancy,
    status,
    user_id
  ) VALUES (
    p_reference,
    p_building,
    p_unit,
    p_type,
    p_sqm,
    p_beds,
    p_baths,
    p_occupancy,
    'active',
    p_user_id
  ) RETURNING id INTO property_id;
  
  -- Insert basic info
  INSERT INTO property_basic_info (
    property_id,
    full_address,
    description
  ) VALUES (
    property_id,
    p_address,
    p_description
  );
  
  RETURN property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
