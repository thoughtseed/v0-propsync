"use server"

import { revalidatePath } from "next/cache"
import { getAdminSupabaseClient } from "@/lib/supabase/server"
import { calculateCategoryCompletion, calculateOverallCompletion } from "@/lib/utils/checklist-completion"
import type { WizardFormData } from "@/lib/types/wizard-types"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/supabase"

// Create a direct admin client that completely bypasses Next.js cookies and RLS
// Using any type to avoid TypeScript errors with direct client
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

// Helper function to calculate completion percentage for a category based on filled fields
function calculateCategoryCompletionPercentage(formData: any, fields: string[]): number {
  if (!fields || fields.length === 0) return 0;
  
  const filledFields = fields.filter(field => {
    const value = formData[field];
    return value !== undefined && value !== null && value !== '' && 
           (typeof value !== 'object' || Object.keys(value).length > 0);
  });
  
  return Math.round((filledFields.length / fields.length) * 100);
}

// Helper function to safely convert values to JSONB for Supabase
function safeJsonbValue(value: any) {
  if (value === undefined || value === null) {
    return [];
  }
  
  if (Array.isArray(value)) {
    return value;
  }
  
  if (typeof value === 'object') {
    return value;
  }
  
  // If it's a primitive value that needs to be an array, wrap it
  return [];
}

// Property creation function that gets a real user ID first
export async function createProperty(formData: WizardFormData) {
  try {
    console.log("Starting property creation with direct admin client");
    
    // Use direct admin client with service role that completely bypasses RLS
    const supabase = createDirectAdminClient()
    
    // First get a valid user ID from the database
    console.log("Fetching valid users from database...");
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      console.error("No users found in the database:", userError);
      throw new Error("No valid users found in the database. Please ensure at least one user exists.");
    }
    
    // Use the first user's ID if form data doesn't specify a user_id
    const userId = formData.user_id || users[0].id;
    
    console.log("Creating property record with user ID:", userId);
    
    // Calculate completion percentages for each category
    const basicInfoFields = ['property_reference', 'building_name', 'unit_number', 'full_address', 
                            'property_type', 'square_meters', 'bedrooms', 'bathrooms', 'max_occupancy', 
                            'year_built', 'year_renovated', 'description', 'primary_photo', 'floor_plan'];
                            
    const safetyFields = ['smoke_detectors', 'fire_extinguisher_location', 'fire_extinguisher_expiry', 
                          'emergency_exit_plan', 'first_aid_location', 'door_lock_type', 'smart_lock_code', 
                          'building_security', 'cctv_coverage', 'emergency_contacts', 'window_security', 
                          'balcony_safety', 'child_safety_features'];
                          
    const kitchenFields = ['major_appliances', 'small_appliances', 'cookware_inventory', 'dishware_count',
                          'dining_capacity', 'water_filtration', 'coffee_tea_facilities', 'special_features',
                          'waste_disposal', 'pantry_staples', 'counter_material', 'kitchen_photos'];
                          
    const bedroomsFields = ['bed_configurations', 'extra_bedding_location', 'mattress_type', 'pillow_details',
                           'closet_details', 'blackout_curtains', 'bedroom_electronics', 'furniture_inventory', 
                           'bedroom_amenities'];
                           
    const bathroomsFields = ['shower_bath_config', 'towel_details', 'toiletries_provided', 'hair_dryer_available',
                            'hair_dryer_details', 'water_pressure', 'hot_water_system', 'ventilation',
                            'bathroom_special_features', 'bathroom_accessibility_features'];
                            
    const technologyFields = ['wifi_network', 'wifi_password', 'internet_speed', 'smart_home_features',
                             'router_location', 'tv_details', 'streaming_services', 'speaker_systems', 
                             'remote_controls', 'charging_stations', 'backup_solutions'];
                             
    const practicalFields = ['washer_details', 'dryer_details', 'detergent_provided', 'iron_board_available',
                             'drying_rack_location', 'laundry_basket_available', 'building_laundry_info', 
                             'vacuum_details', 'cleaning_supplies', 'cleaning_schedule', 'special_instructions',
                             'stain_removal_kit', 'ac_units_details', 'heating_system', 'thermostat_instructions',
                             'ventilation_systems', 'air_purifiers', 'electrical_panel_location'];
                             
    const locationFields = ['public_transport', 'nearby_locations', 'walking_score', 'neighborhood_description',
                           'restaurants', 'grocery_shopping', 'tourist_attractions', 'emergency_services',
                           'local_tips', 'weather_patterns', 'safety_assessment'];
                           
    const accessibilityFields = ['step_free_access', 'elevator_accessibility', 'doorway_widths', 'bathroom_features',
                                'kitchen_height', 'visual_features', 'auditory_features', 'energy_rating', 
                                'renewable_features', 'recycling_instructions', 'efficient_appliances', 
                                'water_conservation', 'eco_products', 'sustainable_materials'];
    
    // Calculate completion percentages
    const basicInfoCompletion = calculateCategoryCompletionPercentage(formData, basicInfoFields);
    const safetyCompletion = calculateCategoryCompletionPercentage(formData, safetyFields);
    const kitchenCompletion = calculateCategoryCompletionPercentage(formData, kitchenFields);
    const bedroomsCompletion = calculateCategoryCompletionPercentage(formData, bedroomsFields);
    const bathroomsCompletion = calculateCategoryCompletionPercentage(formData, bathroomsFields);
    const technologyCompletion = calculateCategoryCompletionPercentage(formData, technologyFields);
    const practicalCompletion = calculateCategoryCompletionPercentage(formData, practicalFields);
    const locationCompletion = calculateCategoryCompletionPercentage(formData, locationFields);
    const accessibilityCompletion = calculateCategoryCompletionPercentage(formData, accessibilityFields);
    
    // Calculate overall completion (average of all categories)
    const allCategories = [basicInfoCompletion, safetyCompletion, kitchenCompletion, bedroomsCompletion,
                          bathroomsCompletion, technologyCompletion, practicalCompletion, locationCompletion, 
                          accessibilityCompletion];
    const overallCompletion = Math.round(allCategories.reduce((sum, value) => sum + value, 0) / allCategories.length);

    // Create the property in the single properties_complete table
    try {
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties_complete")
        .insert({
          // Main property fields
          property_reference: formData.property_reference || `Property-${Date.now()}`,
          building_name: formData.building_name || "New Property",
          unit_number: formData.unit_number || "1",
          property_type: formData.property_type || "Apartment",
          square_meters: formData.square_meters || 0,
          bedrooms: formData.bedrooms || 1,
          bathrooms: formData.bathrooms || 1,
          max_occupancy: formData.max_occupancy || 2,
          status: "pending",
          user_id: userId,
          
          // Basic info fields
          full_address: formData.full_address || "123 Main Street",
          year_built: formData.year_built || null,
          year_renovated: formData.year_renovated || null,
          description: formData.description || "A great property in a prime location",
          floor_plan_url: formData.floor_plan || null,
          primary_photo: formData.primary_photo || null,
          
          // Safety fields
          smoke_detectors: safeJsonbValue(formData.smoke_detectors),
          fire_extinguisher_location: formData.fire_extinguisher_location || null,
          fire_extinguisher_expiry: formData.fire_extinguisher_expiry || null,
          emergency_exit_plan: formData.emergency_exit_plan || false,
          first_aid_location: formData.first_aid_location || null,
          door_lock_type: formData.door_lock_type || null,
          smart_lock_code: formData.smart_lock_code || null,
          building_security: formData.building_security || null,
          cctv_coverage: safeJsonbValue(formData.cctv_coverage),
          emergency_contacts: formData.emergency_contacts || null,
          window_security: formData.window_security || null,
          balcony_safety: formData.balcony_safety || null,
          child_safety_features: safeJsonbValue(formData.child_safety_features),
          
          // Kitchen fields
          major_appliances: safeJsonbValue(formData.major_appliances),
          small_appliances: safeJsonbValue(formData.small_appliances),
          cookware_inventory: formData.cookware_inventory || null,
          dishware_count: formData.dishware_count || null,
          dining_capacity: formData.dining_capacity || null,
          water_filtration: formData.water_filtration || null,
          coffee_tea_facilities: formData.coffee_tea_facilities || null,
          special_features: formData.special_features || null,
          waste_disposal: formData.waste_disposal || null,
          pantry_staples: safeJsonbValue(formData.pantry_staples),
          counter_material: formData.counter_material || null,
          kitchen_photos: safeJsonbValue(formData.kitchen_photos),
          
          // Bedroom fields
          bed_configurations: safeJsonbValue(formData.bed_configurations),
          extra_bedding_location: formData.extra_bedding_location || null,
          mattress_type: formData.mattress_type || null,
          pillow_details: formData.pillow_details || null,
          closet_details: formData.closet_details || null,
          blackout_curtains: formData.blackout_curtains || null,
          bedroom_electronics: safeJsonbValue(formData.bedroom_electronics),
          furniture_inventory: formData.furniture_inventory || null,
          bedroom_amenities: safeJsonbValue(formData.bedroom_amenities),
          
          // Bathroom fields
          shower_bath_config: formData.shower_bath_config || null,
          towel_details: formData.towel_details || null,
          toiletries_provided: safeJsonbValue(formData.toiletries_provided),
          hair_dryer_available: formData.hair_dryer_available || false,
          hair_dryer_details: formData.hair_dryer_details || null,
          water_pressure: formData.water_pressure || null,
          hot_water_system: formData.hot_water_system || null,
          ventilation: formData.ventilation || null,
          bathroom_special_features: safeJsonbValue(formData.bathroom_special_features),
          bathroom_accessibility_features: safeJsonbValue(formData.bathroom_accessibility_features),
          
          // Technology fields
          wifi_network: formData.wifi_network || null,
          wifi_password: formData.wifi_password || null,
          internet_speed: formData.internet_speed || null,
          smart_home_features: safeJsonbValue(formData.smart_home_features),
          router_location: formData.router_location || null,
          tv_details: formData.tv_details || null,
          streaming_services: formData.streaming_services || null,
          speaker_systems: formData.speaker_systems || null,
          remote_controls: safeJsonbValue(formData.remote_controls),
          charging_stations: formData.charging_stations || null,
          backup_solutions: formData.backup_solutions || null,
          
          // Practical living fields
          washer_details: formData.washer_details || null,
          dryer_details: formData.dryer_details || null,
          detergent_provided: formData.detergent_provided || null,
          iron_board_available: formData.iron_board_available || false,
          drying_rack_location: formData.drying_rack_location || null,
          laundry_basket_available: formData.laundry_basket_available || false,
          building_laundry_info: formData.building_laundry_info || null,
          vacuum_details: formData.vacuum_details || null,
          cleaning_supplies: safeJsonbValue(formData.cleaning_supplies),
          cleaning_schedule: formData.cleaning_schedule || null,
          special_instructions: formData.special_instructions || null,
          stain_removal_kit: formData.stain_removal_kit || null,
          ac_units_details: formData.ac_units_details || null,
          heating_system: formData.heating_system || null,
          thermostat_instructions: formData.thermostat_instructions || null,
          ventilation_systems: formData.ventilation_systems || null,
          air_purifiers: formData.air_purifiers || null,
          electrical_panel_location: formData.electrical_panel_location || null,
          
          // Location fields
          public_transport: formData.public_transport || null,
          nearby_locations: safeJsonbValue(formData.nearby_locations),
          walking_score: formData.walking_score || null,
          neighborhood_description: formData.neighborhood_description || null,
          restaurants: safeJsonbValue(formData.restaurants),
          grocery_shopping: formData.grocery_shopping || null,
          tourist_attractions: safeJsonbValue(formData.tourist_attractions),
          emergency_services: formData.emergency_services || null,
          local_tips: formData.local_tips || null,
          weather_patterns: formData.weather_patterns || null,
          safety_assessment: formData.safety_assessment || null,
          
          // Accessibility fields
          step_free_access: formData.step_free_access || false,
          elevator_accessibility: formData.elevator_accessibility || null,
          doorway_widths: formData.doorway_widths || null,
          bathroom_features: safeJsonbValue(formData.bathroom_features),
          kitchen_height: formData.kitchen_height || null,
          visual_features: safeJsonbValue(formData.visual_features),
          auditory_features: safeJsonbValue(formData.auditory_features),
          energy_rating: formData.energy_rating || null,
          renewable_features: formData.renewable_features || null,
          recycling_instructions: formData.recycling_instructions || null,
          efficient_appliances: safeJsonbValue(formData.efficient_appliances),
          water_conservation: safeJsonbValue(formData.water_conservation),
          eco_products: safeJsonbValue(formData.eco_products),
          sustainable_materials: formData.sustainable_materials || null,
          
          // Completion percentages
          basic_information_completion: basicInfoCompletion,
          safety_security_completion: safetyCompletion,
          kitchen_dining_completion: kitchenCompletion,
          bedrooms_completion: bedroomsCompletion,
          bathrooms_completion: bathroomsCompletion,
          technology_completion: technologyCompletion,
          practical_living_completion: practicalCompletion,
          location_lifestyle_completion: locationCompletion,
          accessibility_sustainability_completion: accessibilityCompletion,
          overall_completion: overallCompletion,
        })
        .select("id")
        .single();

      if (propertyError) {
        console.error("Error creating property:", propertyError);
        throw propertyError;
      }

      console.log("Property created successfully with ID:", propertyData?.id);
      
      // Revalidate the properties page
      revalidatePath("/properties");
      console.log("Property creation process completed");

      // Return success
      return { success: true, propertyId: propertyData?.id };
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in property creation process:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create property",
      details: JSON.stringify(error)
    };
  }
}

// Using any type for Supabase client to work around TypeScript errors with property_drafts
export async function saveDraft(formData: WizardFormData) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = await getAdminSupabaseClient() as any;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // First, check if we have a draft ID already
    const draftId = formData.id;

    if (draftId) {
      // Update existing draft - using any to bypass type issues
      const { error } = await supabase
        .from("property_drafts")
        .update({
          data: formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", draftId);

      if (error) throw error;

      return { success: true, id: draftId };
    } else {
      // Create new draft - using any to bypass type issues
      const { data, error } = await supabase
        .from("property_drafts")
        .insert({
          user_id: user.id,
          data: formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (error) throw error;

      // Safely access data
      const resultId = data?.id || null;
      return { success: true, id: resultId };
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to save draft" };
  }
}

export async function loadDraft(draftId: string) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = await getAdminSupabaseClient() as any;
    const { data, error } = await supabase
      .from("property_drafts")
      .select("data")
      .eq("id", draftId)
      .single();

    if (error) throw error;

    // Safely access data
    const draftData = data?.data || null;
    return { success: true, data: draftData as WizardFormData };
  } catch (error) {
    console.error("Error loading draft:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to load draft" };
  }
}

export async function deleteDraft(draftId: string) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = await getAdminSupabaseClient() as any;
    const { error } = await supabase
      .from("property_drafts")
      .delete()
      .eq("id", draftId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting draft:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete draft" };
  }
}

export async function deleteProperty(propertyId: string) {
  if (!propertyId) {
    return { success: false, error: "Property ID is required." };
  }

  const supabase = createDirectAdminClient();

  try {
    // Delete the property from the properties_complete table
    const { error } = await supabase.from("properties_complete").delete().eq("id", propertyId);

    if (error) {
      console.error("Error deleting property from database:", error);
      throw new Error(error.message);
    }

    revalidatePath("/properties");
    revalidatePath(`/properties/${propertyId}`);

    return { success: true, message: "Property deleted successfully." };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}
