-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table to store user profiles
CREATE TABLE IF NOT EXISTS public.users1 (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'readonly' CHECK (role IN ('admin', 'manager', 'staff', 'readonly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for users table
ALTER TABLE public.users1 ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users1 FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users1 FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.users1 FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users1 WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" 
  ON public.users1 FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users1 WHERE id = auth.uid() AND role = 'admin'
    )
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

-- Set up Row Level Security for properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policies for properties table
CREATE POLICY "Users can view their own properties" 
  ON public.properties FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties" 
  ON public.properties FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
  ON public.properties FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
  ON public.properties FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and managers can view all properties" 
  ON public.properties FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users1 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update all properties" 
  ON public.properties FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users1 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
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

-- Set up Row Level Security for property_basic_info table
ALTER TABLE public.property_basic_info ENABLE ROW LEVEL SECURITY;

-- Policies for property_basic_info table
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
      SELECT 1 FROM public.users1 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
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

-- Set up Row Level Security for property_images table
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Policies for property_images table
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
      SELECT 1 FROM public.users1 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update all property_images" 
  ON public.property_images FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users1 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Create similar tables and policies for other property sections
-- For brevity, I'm not including all tables here, but the pattern is the same

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users1 (id, email, full_name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 'readonly');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users1
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
