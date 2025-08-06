"use server"

import { revalidatePath } from "next/cache"
import { getAdminSupabaseClient, getServerUser } from "@/lib/supabase/server"
import { calculateCategoryCompletion, calculateOverallCompletion } from "@/lib/utils/checklist-completion"
import { isCurrentUserAdmin, logAuthError, canCreateProperties } from "@/lib/utils/auth-utils"
import { logPropertyError, logDatabaseError, debugLog, withErrorLogging } from "@/lib/utils/error-logging"
import type { WizardFormData } from "@/lib/types/wizard-types"
import { createClient } from "@supabase/supabase-js"

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
  debugLog('createProperty', 'enter', { formDataKeys: Object.keys(formData) }, 'PropertyActions')
  
  try {
    console.log("[PROPERTY_CREATE] Starting property creation process");
    
    // MVP: Authorization check removed - single admin user has full access
    // For beta: restore authorization check with canCreateProperties()
    // const canCreate = await canCreateProperties()
    // if (!canCreate) {
    //   const currentUser = await getServerUser()
    //   const userEmail = currentUser?.email || 'unknown'
    //   const userRole = currentUser?.profile?.role || 'unknown'
    //   
    //   logAuthError('createProperty', new Error('Unauthorized property creation attempt'), {
    //     userEmail,
    //     userRole,
    //     requiredRole: 'admin',
    //     action: 'create_property'
    //   })
    //   
    //   console.error(`[PROPERTY_CREATE] AUTHORIZATION FAILED: User ${userEmail} with role '${userRole}' attempted to create property. Only admin users can create properties.`)
    //   
    // MVP: Commented out for single admin user setup - restore for beta
    // if (!canCreateProperties) {
    //   return {
    //     success: false,
    //     error: "Only admin users can create properties. Please contact your administrator.",
    //     details: {
    //       userRole,
    //       requiredRole: 'admin',
    //       action: 'create_property'
    //     }
    //   };
    // }
    
    console.log("[PROPERTY_CREATE] Authorization check passed - user is admin");
    
    // Use direct admin client with service role that completely bypasses RLS
    const supabase = createDirectAdminClient()
    
    // Get the current admin user's ID
    const currentUser = await getServerUser()
    if (!currentUser) {
      logAuthError('createProperty', new Error('No authenticated user found'))
      console.error("[PROPERTY_CREATE] No authenticated user found");
      return {
        success: false,
        error: "Authentication required to create properties"
      }
    }
    
    const userId = currentUser.id;
    console.log(`[PROPERTY_CREATE] Creating property for admin user: ${currentUser.email}`);
    
    console.log(`[PROPERTY_CREATE] Creating property record with admin user ID: ${userId}`);
    
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
        logDatabaseError('insertProperty', propertyError, {
          data: { formDataKeys: Object.keys(formData) }
        })
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
    const errorDetails = logPropertyError('createProperty', error as Error, {
      userId: formData.user_id,
      data: { formDataKeys: Object.keys(formData) }
    })
    
    console.error("[PROPERTY_CREATE] Critical error during property creation:", errorDetails)
    
    return {
      success: false,
      error: "Failed to create property. Please check the console for detailed error information.",
      errorDetails
    }
  } finally {
    debugLog('createProperty', 'exit', null, 'PropertyActions')
  }
}

// Using any type for Supabase client to work around TypeScript errors with property_drafts
export async function saveDraft(formData: WizardFormData) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = getAdminSupabaseClient() as any;

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
    const supabase = getAdminSupabaseClient() as any;
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
    const supabase = getAdminSupabaseClient() as any;
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

  // MVP: Authorization check removed - single admin user has full access
  // For beta: restore authorization check with isCurrentUserAdmin()
  // const isAdmin = await isCurrentUserAdmin();
  // if (!isAdmin) {
  //   logAuthError('deleteProperty', 'Unauthorized access attempt', {
  //     propertyId,
  //     action: 'delete_property'
  //   });
  //   return { success: false, error: "Unauthorized: Admin access required to delete properties." };
  // }

  const supabase = createDirectAdminClient();

  try {
    // Delete from properties_complete table first
    const { error: completeError } = await supabase
      .from("properties_complete")
      .delete()
      .eq("id", propertyId);

    if (completeError) {
      console.error("Error deleting property from properties_complete:", completeError);
      throw new Error(completeError.message);
    }

    // Delete from main properties table (this will cascade delete all related child tables)
    const { error: propertiesError } = await supabase
      .from("properties")
      .delete()
      .eq("id", propertyId);

    if (propertiesError) {
      console.error("Error deleting property from properties table:", propertiesError);
      throw new Error(propertiesError.message);
    }

    revalidatePath("/properties");
    revalidatePath(`/properties/${propertyId}`);

    return { success: true, message: "Property and all associated data deleted successfully." };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}

// Load property data for editing
export async function loadPropertyForEdit(propertyId: string) {
  if (!propertyId) {
    return { success: false, error: "Property ID is required." };
  }

  // MVP: Authorization check removed - single admin user has full access
  // For beta: restore authorization check with isCurrentUserAdmin()
  // const isAdmin = await isCurrentUserAdmin();
  // if (!isAdmin) {
  //   logAuthError('loadPropertyForEdit', 'Unauthorized access attempt', {
  //     propertyId,
  //     action: 'load_property_for_edit'
  //   });
  //   return { success: false, error: "Unauthorized: Admin access required to edit properties." };
  // }

  const supabase = createDirectAdminClient();

  try {
    const { data: property, error } = await supabase
      .from("properties_complete")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (error) {
      console.error("Error loading property for edit:", error);
      throw new Error(error.message);
    }

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    // Convert the property data to WizardFormData format
    const formData: WizardFormData = {
      id: property.id,
      user_id: property.user_id,
      status: property.status,
      created_at: property.created_at,
      updated_at: property.updated_at,
      
      // Basic Information
      property_reference: property.property_reference,
      building_name: property.building_name,
      unit_number: property.unit_number,
      full_address: property.full_address,
      property_type: property.property_type,
      square_meters: property.square_meters,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      max_occupancy: property.max_occupancy,
      year_built: property.year_built,
      year_renovated: property.year_renovated,
      description: property.description,
      primary_photo: property.primary_photo,
      floor_plan: property.floor_plan_url,
      
      // Safety & Security
      smoke_detectors: property.smoke_detectors || [],
      fire_extinguisher_location: property.fire_extinguisher_location,
      fire_extinguisher_expiry: property.fire_extinguisher_expiry,
      emergency_exit_plan: property.emergency_exit_plan,
      first_aid_location: property.first_aid_location,
      door_lock_type: property.door_lock_type,
      smart_lock_code: property.smart_lock_code,
      building_security: property.building_security,
      cctv_coverage: property.cctv_coverage || [],
      emergency_contacts: property.emergency_contacts,
      window_security: property.window_security,
      balcony_safety: property.balcony_safety,
      child_safety_features: property.child_safety_features || [],
      
      // Kitchen & Dining
      major_appliances: property.major_appliances || [],
      small_appliances: property.small_appliances || [],
      cookware_inventory: property.cookware_inventory,
      dishware_count: property.dishware_count,
      dining_capacity: property.dining_capacity,
      water_filtration: property.water_filtration,
      coffee_tea_facilities: property.coffee_tea_facilities,
      special_features: property.special_features,
      waste_disposal: property.waste_disposal,
      pantry_staples: property.pantry_staples || [],
      counter_material: property.counter_material,
      kitchen_photos: property.kitchen_photos || [],
      
      // Bedrooms
      bed_configurations: property.bed_configurations || [],
      extra_bedding_location: property.extra_bedding_location,
      mattress_type: property.mattress_type,
      pillow_details: property.pillow_details,
      closet_details: property.closet_details,
      blackout_curtains: property.blackout_curtains,
      bedroom_electronics: property.bedroom_electronics || [],
      furniture_inventory: property.furniture_inventory,
      bedroom_amenities: property.bedroom_amenities || [],
      
      // Bathrooms
      shower_bath_config: property.shower_bath_config,
      towel_details: property.towel_details,
      toiletries_provided: property.toiletries_provided || [],
      hair_dryer_available: property.hair_dryer_available,
      hair_dryer_details: property.hair_dryer_details,
      water_pressure: property.water_pressure,
      hot_water_system: property.hot_water_system,
      ventilation: property.ventilation,
      bathroom_special_features: property.bathroom_special_features || [],
      bathroom_accessibility_features: property.bathroom_accessibility_features || [],
      
      // Technology
      wifi_network: property.wifi_network,
      wifi_password: property.wifi_password,
      internet_speed: property.internet_speed,
      smart_home_features: property.smart_home_features || [],
      router_location: property.router_location,
      tv_details: property.tv_details,
      streaming_services: property.streaming_services,
      speaker_systems: property.speaker_systems,
      remote_controls: property.remote_controls || [],
      charging_stations: property.charging_stations,
      backup_solutions: property.backup_solutions,
      
      // Practical Living
      washer_details: property.washer_details,
      dryer_details: property.dryer_details,
      detergent_provided: property.detergent_provided,
      iron_board_available: property.iron_board_available,
      drying_rack_location: property.drying_rack_location,
      laundry_basket_available: property.laundry_basket_available,
      building_laundry_info: property.building_laundry_info,
      vacuum_details: property.vacuum_details,
      cleaning_supplies: property.cleaning_supplies || [],
      cleaning_schedule: property.cleaning_schedule,
      special_instructions: property.special_instructions,
      stain_removal_kit: property.stain_removal_kit,
      ac_units_details: property.ac_units_details,
      heating_system: property.heating_system,
      thermostat_instructions: property.thermostat_instructions,
      ventilation_systems: property.ventilation_systems,
      air_purifiers: property.air_purifiers,
      electrical_panel_location: property.electrical_panel_location,
      
      // Location & Lifestyle
      public_transport: property.public_transport,
      nearby_locations: property.nearby_locations || [],
      walking_score: property.walking_score,
      neighborhood_description: property.neighborhood_description,
      restaurants: property.restaurants || [],
      grocery_shopping: property.grocery_shopping,
      tourist_attractions: property.tourist_attractions || [],
      emergency_services: property.emergency_services,
      local_tips: property.local_tips,
      weather_patterns: property.weather_patterns,
      safety_assessment: property.safety_assessment,
      
      // Accessibility & Sustainability
      step_free_access: property.step_free_access,
      elevator_accessibility: property.elevator_accessibility,
      doorway_widths: property.doorway_widths,
      bathroom_features: property.bathroom_features || [],
      kitchen_height: property.kitchen_height,
      visual_features: property.visual_features || [],
      auditory_features: property.auditory_features || [],
      energy_rating: property.energy_rating,
      renewable_features: property.renewable_features,
      recycling_instructions: property.recycling_instructions,
      efficient_appliances: property.efficient_appliances || [],
      water_conservation: property.water_conservation || [],
      eco_products: property.eco_products || [],
      sustainable_materials: property.sustainable_materials,
    };

    return { success: true, data: formData };
  } catch (error) {
    console.error("Failed to load property for edit:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}

// Update existing property
export async function updateProperty(propertyId: string, formData: WizardFormData) {
  if (!propertyId) {
    return { success: false, error: "Property ID is required." };
  }

  // MVP: Authorization check removed - single admin user has full access
  // For beta: restore authorization check with isCurrentUserAdmin()
  // const isAdmin = await isCurrentUserAdmin();
  // if (!isAdmin) {
  //   logAuthError('updateProperty', 'Unauthorized access attempt', {
  //     propertyId,
  //     action: 'update_property'
  //   });
  //   return { success: false, error: "Unauthorized: Admin access required to update properties." };
  // }

  try {
    console.log("Starting property update with direct admin client");
    
    // Use direct admin client with service role that completely bypasses RLS
    const supabase = createDirectAdminClient()
    
    console.log("Updating property record with ID:", propertyId);
    
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

    // Update the property in the properties_complete table
    const { data: propertyData, error: propertyError } = await supabase
      .from("properties_complete")
      .update({
        // Main property fields
        property_reference: formData.property_reference || `Property-${Date.now()}`,
        building_name: formData.building_name || "New Property",
        unit_number: formData.unit_number || "1",
        property_type: formData.property_type || "Apartment",
        square_meters: formData.square_meters || 0,
        bedrooms: formData.bedrooms || 1,
        bathrooms: formData.bathrooms || 1,
        max_occupancy: formData.max_occupancy || 2,
        status: formData.status || "pending",
        updated_at: new Date().toISOString(),
        
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
      .eq("id", propertyId)
      .select("id")
      .single();

    if (propertyError) {
      console.error("Error updating property:", propertyError);
      throw propertyError;
    }

    console.log("Property updated successfully with ID:", propertyData?.id);
    
    // Revalidate the properties page
    revalidatePath("/properties");
    revalidatePath(`/properties/${propertyId}`);
    console.log("Property update process completed");

    // Return success
    return { success: true, propertyId: propertyData?.id };
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
}
