"use server"

import { getAdminSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"

// Create a direct admin client that bypasses RLS
const createDirectAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase credentials for direct admin client")
    throw new Error("Required environment variables missing for Supabase admin client")
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

export async function setupDatabase() {
  try {
    console.log("Setting up database tables...")
    const supabase = createDirectAdminClient()
    
    // Make sure extensions are enabled
    await supabase.rpc('create_extension_if_not_exists', { extension_name: 'uuid-ossp' })
    
    // Execute table creation script
    const createPropertiesTable = `
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

      -- Set up Row Level Security for properties table if not already set
      ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
    `
    
    // Create basic info table 
    const createBasicInfoTable = `
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
    `
    
    // Create images table
    const createImagesTable = `
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
    `
    
    // Create safety table
    const createSafetyTable = `
      CREATE TABLE IF NOT EXISTS public.property_safety (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
        smoke_detectors JSONB,
        fire_extinguisher_location TEXT,
        fire_extinguisher_expiry TEXT,
        emergency_exit_plan BOOLEAN,
        first_aid_location TEXT,
        door_lock_type TEXT,
        smart_lock_code TEXT,
        building_security TEXT,
        cctv_coverage JSONB,
        emergency_contacts TEXT,
        window_security TEXT,
        balcony_safety TEXT,
        child_safety_features JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Set up Row Level Security for property_safety table
      ALTER TABLE public.property_safety ENABLE ROW LEVEL SECURITY;
    `
    
    // Create kitchen table
    const createKitchenTable = `
      CREATE TABLE IF NOT EXISTS public.property_kitchen (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
        major_appliances JSONB,
        small_appliances JSONB,
        cookware_inventory TEXT,
        dishware_count TEXT,
        dining_capacity INTEGER,
        water_filtration TEXT,
        coffee_tea_facilities TEXT,
        special_features TEXT,
        waste_disposal TEXT,
        pantry_staples JSONB,
        counter_material TEXT,
        kitchen_photos JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Set up Row Level Security for property_kitchen table
      ALTER TABLE public.property_kitchen ENABLE ROW LEVEL SECURITY;
    `
    
    // Create bedrooms table
    const createBedroomsTable = `
      CREATE TABLE IF NOT EXISTS public.property_bedrooms (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
        bed_configurations JSONB,
        extra_bedding_location TEXT,
        mattress_type TEXT,
        pillow_details TEXT,
        closet_details TEXT,
        blackout_curtains TEXT,
        bedroom_electronics JSONB,
        furniture_inventory TEXT,
        bedroom_amenities JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Set up Row Level Security for property_bedrooms table
      ALTER TABLE public.property_bedrooms ENABLE ROW LEVEL SECURITY;
    `
    
    // Create bathrooms table
    const createBathroomsTable = `
      CREATE TABLE IF NOT EXISTS public.property_bathrooms (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
        shower_bath_config TEXT,
        towel_details TEXT,
        toiletries_provided JSONB,
        hair_dryer_available BOOLEAN,
        hair_dryer_details TEXT,
        water_pressure TEXT,
        hot_water_system TEXT,
        ventilation TEXT,
        bathroom_special_features JSONB,
        bathroom_accessibility_features JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Set up Row Level Security for property_bathrooms table
      ALTER TABLE public.property_bathrooms ENABLE ROW LEVEL SECURITY;
    `
    
    // Create technology table
    const createTechnologyTable = `
      CREATE TABLE IF NOT EXISTS public.property_technology (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
        wifi_network TEXT,
        wifi_password TEXT,
        internet_speed TEXT,
        smart_home_features JSONB,
        router_location TEXT,
        tv_details TEXT,
        streaming_services TEXT,
        speaker_systems TEXT,
        remote_controls JSONB,
        charging_stations TEXT,
        backup_solutions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Set up Row Level Security for property_technology table
      ALTER TABLE public.property_technology ENABLE ROW LEVEL SECURITY;
    `
    
    // Create practical living table
    const createPracticalTable = `
      CREATE TABLE IF NOT EXISTS public.property_practical (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
        washer_details TEXT,
        dryer_details TEXT,
        detergent_provided TEXT,
        iron_board_available BOOLEAN,
        drying_rack_location TEXT,
        laundry_basket_available BOOLEAN,
        building_laundry_info TEXT,
        vacuum_details TEXT,
        cleaning_supplies JSONB,
        cleaning_schedule TEXT,
        special_instructions TEXT,
        stain_removal_kit TEXT,
        ac_units_details TEXT,
        heating_system TEXT,
        thermostat_instructions TEXT,
        ventilation_systems TEXT,
        air_purifiers TEXT,
        electrical_panel_location TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Set up Row Level Security for property_practical table
      ALTER TABLE public.property_practical ENABLE ROW LEVEL SECURITY;
    `
    
    // Create location table
    const createLocationTable = `
      CREATE TABLE IF NOT EXISTS public.property_location (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
        public_transport TEXT,
        nearby_locations JSONB,
        walking_score TEXT,
        neighborhood_description TEXT,
        restaurants JSONB,
        grocery_shopping TEXT,
        tourist_attractions JSONB,
        emergency_services TEXT,
        local_tips TEXT,
        weather_patterns TEXT,
        safety_assessment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Set up Row Level Security for property_location table
      ALTER TABLE public.property_location ENABLE ROW LEVEL SECURITY;
    `
    
    // Create accessibility table
    const createAccessibilityTable = `
      CREATE TABLE IF NOT EXISTS public.property_accessibility (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
        step_free_access BOOLEAN,
        elevator_accessibility TEXT,
        doorway_widths TEXT,
        bathroom_features JSONB,
        kitchen_height TEXT,
        visual_features JSONB,
        auditory_features JSONB,
        energy_rating TEXT,
        renewable_features TEXT,
        recycling_instructions TEXT,
        efficient_appliances JSONB,
        water_conservation JSONB,
        eco_products JSONB,
        sustainable_materials TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Set up Row Level Security for property_accessibility table
      ALTER TABLE public.property_accessibility ENABLE ROW LEVEL SECURITY;
    `
    
    // Create checklist completion table
    const createChecklistTable = `
      CREATE TABLE IF NOT EXISTS public.checklist_completion (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
        basic_information INTEGER DEFAULT 0,
        safety_security INTEGER DEFAULT 0,
        kitchen_dining INTEGER DEFAULT 0,
        bedrooms INTEGER DEFAULT 0,
        bathrooms INTEGER DEFAULT 0,
        technology INTEGER DEFAULT 0,
        practical_living INTEGER DEFAULT 0,
        location_lifestyle INTEGER DEFAULT 0,
        accessibility_sustainability INTEGER DEFAULT 0,
        overall INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Set up Row Level Security for checklist_completion table
      ALTER TABLE public.checklist_completion ENABLE ROW LEVEL SECURITY;
    `
    
    // Execute each script in sequence
    const tables = [
      { name: 'Properties', sql: createPropertiesTable },
      { name: 'Basic Info', sql: createBasicInfoTable },
      { name: 'Images', sql: createImagesTable },
      { name: 'Safety', sql: createSafetyTable },
      { name: 'Kitchen', sql: createKitchenTable },
      { name: 'Bedrooms', sql: createBedroomsTable },
      { name: 'Bathrooms', sql: createBathroomsTable },
      { name: 'Technology', sql: createTechnologyTable },
      { name: 'Practical', sql: createPracticalTable },
      { name: 'Location', sql: createLocationTable },
      { name: 'Accessibility', sql: createAccessibilityTable },
      { name: 'Checklist Completion', sql: createChecklistTable }
    ];
    
    for (const table of tables) {
      console.log(`Creating ${table.name} table...`);
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
      if (error) {
        console.error(`Error creating ${table.name} table:`, error);
        throw error;
      }
      console.log(`${table.name} table created successfully.`);
    }
    
    // Create RLS policies for tables
    const policiesScript = `
      -- Policies for properties table
      DO $$
      BEGIN
        -- Only create policies if they don't exist
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own properties' AND tablename = 'properties') THEN
          CREATE POLICY "Users can view their own properties" 
            ON public.properties FOR SELECT 
            USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own properties' AND tablename = 'properties') THEN
          CREATE POLICY "Users can insert their own properties" 
            ON public.properties FOR INSERT 
            WITH CHECK (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own properties' AND tablename = 'properties') THEN
          CREATE POLICY "Users can update their own properties" 
            ON public.properties FOR UPDATE 
            USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own properties' AND tablename = 'properties') THEN
          CREATE POLICY "Users can delete their own properties" 
            ON public.properties FOR DELETE 
            USING (auth.uid() = user_id);
        END IF;

        -- Create policies for all child tables
        DECLARE
          child_tables text[] := ARRAY['property_basic_info', 'property_images', 'property_safety', 
                                      'property_kitchen', 'property_bedrooms', 'property_bathrooms', 
                                      'property_technology', 'property_practical', 'property_location', 
                                      'property_accessibility', 'checklist_completion'];
          child_table text;
        BEGIN
          FOREACH child_table IN ARRAY child_tables
          LOOP
            -- Select policy
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own ' || child_table AND tablename = child_table) THEN
              EXECUTE format('
                CREATE POLICY "Users can view their own %I" 
                ON public.%I FOR SELECT 
                USING (EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid()));
              ', child_table, child_table);
            END IF;
            
            -- Insert policy
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own ' || child_table AND tablename = child_table) THEN
              EXECUTE format('
                CREATE POLICY "Users can insert their own %I" 
                ON public.%I FOR INSERT 
                WITH CHECK (EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid()));
              ', child_table, child_table);
            END IF;
            
            -- Update policy
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own ' || child_table AND tablename = child_table) THEN
              EXECUTE format('
                CREATE POLICY "Users can update their own %I" 
                ON public.%I FOR UPDATE 
                USING (EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid()));
              ', child_table, child_table);
            END IF;
            
            -- Delete policy
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own ' || child_table AND tablename = child_table) THEN
              EXECUTE format('
                CREATE POLICY "Users can delete their own %I" 
                ON public.%I FOR DELETE 
                USING (EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND user_id = auth.uid()));
              ', child_table, child_table);
            END IF;
          END LOOP;
        END;
      END$$;
    `
    
    console.log("Creating RLS policies...");
    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: policiesScript });
    if (policiesError) {
      console.error("Error creating policies:", policiesError);
      throw policiesError;
    }
    console.log("RLS policies created successfully.");
    
    console.log("Database setup completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Database setup error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to set up database" };
  }
} 