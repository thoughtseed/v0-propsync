-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table to store user profiles (original)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'readonly' CHECK (role IN ('admin', 'manager', 'staff', 'readonly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create users1 table (as per your request)
CREATE TABLE IF NOT EXISTS public.users1 (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'readonly' CHECK (role IN ('admin', 'manager', 'staff', 'readonly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  property_reference TEXT NOT NULL,
  building_name TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  property_type TEXT NOT NULL,
  square_meters NUMERIC,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  max_occupancy INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'maintenance', 'inactive', 'pending')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create property_basic_info table
CREATE TABLE IF NOT EXISTS public.property_basic_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  full_address TEXT NOT NULL,
  year_built TEXT,
  year_renovated TEXT,
  description TEXT NOT NULL,
  floor_plan_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'main',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_basic_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Policies for public.users
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" 
  ON public.users 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for public.users1 (mirroring users policies)
CREATE POLICY "Users1 can view their own profile" 
  ON public.users1 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users1 can update their own profile" 
  ON public.users1 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles in users1" 
  ON public.users1 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users1 WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles in users1" 
  ON public.users1 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users1 WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for public.properties
CREATE POLICY "All authenticated users can view properties" 
  ON public.properties 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Managers and admins can insert properties" 
  ON public.properties 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Managers and admins can update properties" 
  ON public.properties 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete properties" 
  ON public.properties 
  FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for public.property_basic_info
CREATE POLICY "Users can view their own property_basic_info" 
  ON public.property_basic_info FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own property_basic_info" 
  ON public.property_basic_info FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own property_basic_info" 
  ON public.property_basic_info FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can view all property_basic_info" 
  ON public.property_basic_info FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Policies for public.property_images
CREATE POLICY "Users can view their own property_images" 
  ON public.property_images FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own property_images" 
  ON public.property_images FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own property_images" 
  ON public.property_images FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own property_images" 
  ON public.property_images FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can view all property_images" 
  ON public.property_images FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update all property_images" 
  ON public.property_images FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Function to handle new user signups for public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'readonly'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TABLE public.properties_complete (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  property_reference text NOT NULL,
  building_name text NOT NULL,
  unit_number text NOT NULL,
  property_type text NOT NULL,
  square_meters numeric,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  max_occupancy integer NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['active'::text, 'maintenance'::text, 'inactive'::text, 'pending'::text])),
  user_id uuid NOT NULL,
  full_address text,
  year_built text,
  year_renovated text,
  description text,
  floor_plan_url text,
  primary_photo text,
  smoke_detectors jsonb,
  fire_extinguisher_location text,
  fire_extinguisher_expiry text,
  emergency_exit_plan boolean,
  first_aid_location text,
  door_lock_type text,
  smart_lock_code text,
  building_security text,
  cctv_coverage jsonb,
  emergency_contacts text,
  window_security text,
  balcony_safety text,
  child_safety_features jsonb,
  major_appliances jsonb,
  small_appliances jsonb,
  cookware_inventory text,
  dishware_count text,
  dining_capacity integer,
  water_filtration text,
  coffee_tea_facilities text,
  special_features text,
  waste_disposal text,
  pantry_staples jsonb,
  counter_material text,
  kitchen_photos jsonb,
  bed_configurations jsonb,
  extra_bedding_location text,
  mattress_type text,
  pillow_details text,
  closet_details text,
  blackout_curtains text,
  bedroom_electronics jsonb,
  furniture_inventory text,
  bedroom_amenities jsonb,
  shower_bath_config text,
  towel_details text,
  toiletries_provided jsonb,
  hair_dryer_available boolean,
  hair_dryer_details text,
  water_pressure text,
  hot_water_system text,
  ventilation text,
  bathroom_special_features jsonb,
  bathroom_accessibility_features jsonb,
  wifi_network text,
  wifi_password text,
  internet_speed text,
  smart_home_features jsonb,
  router_location text,
  tv_details text,
  streaming_services text,
  speaker_systems text,
  remote_controls jsonb,
  charging_stations text,
  backup_solutions text,
  washer_details text,
  dryer_details text,
  detergent_provided text,
  iron_board_available boolean,
  drying_rack_location text,
  laundry_basket_available boolean,
  building_laundry_info text,
  vacuum_details text,
  cleaning_supplies jsonb,
  cleaning_schedule text,
  special_instructions text,
  stain_removal_kit text,
  ac_units_details text,
  heating_system text,
  thermostat_instructions text,
  ventilation_systems text,
  air_purifiers text,
  electrical_panel_location text,
  public_transport text,
  nearby_locations jsonb,
  walking_score text,
  neighborhood_description text,
  restaurants jsonb,
  grocery_shopping text,
  tourist_attractions jsonb,
  emergency_services text,
  local_tips text,
  weather_patterns text,
  safety_assessment text,
  step_free_access boolean,
  elevator_accessibility text,
  doorway_widths text,
  bathroom_features jsonb,
  kitchen_height text,
  visual_features jsonb,
  auditory_features jsonb,
  energy_rating text,
  renewable_features text,
  recycling_instructions text,
  efficient_appliances jsonb,
  water_conservation jsonb,
  eco_products jsonb,
  sustainable_materials text,
  basic_information_completion integer DEFAULT 0,
  safety_security_completion integer DEFAULT 0,
  kitchen_dining_completion integer DEFAULT 0,
  bedrooms_completion integer DEFAULT 0,
  bathrooms_completion integer DEFAULT 0,
  technology_completion integer DEFAULT 0,
  practical_living_completion integer DEFAULT 0,
  location_lifestyle_completion integer DEFAULT 0,
  accessibility_sustainability_completion integer DEFAULT 0,
  overall_completion integer DEFAULT 0,
  CONSTRAINT properties_complete_pkey PRIMARY KEY (id),
  CONSTRAINT properties_complete_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);