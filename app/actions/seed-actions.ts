"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import { sampleProperty } from "@/lib/seed-data/sample-property"
import type { Database } from "@/lib/types/supabase"

export async function seedSampleProperty() {
  try {
    // Create a direct client with service role key to bypass RLS
    // This is the key difference - we're using createClient directly with the service role key
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Create a test user if needed
    const testUserId = "00000000-0000-0000-0000-000000000000"

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin.from("users").select("id").eq("id", testUserId).single()

    if (!existingUser) {
      // Insert test user
      await supabaseAdmin.from("users").insert({
        id: testUserId,
        email: "test@example.com",
        role: "admin",
        full_name: "Test User",
      })
    }

    // First, create the main property record
    const { data: propertyData, error: propertyError } = await supabaseAdmin
      .from("properties")
      .insert({
        property_reference: sampleProperty.property_reference,
        building_name: sampleProperty.building_name,
        unit_number: sampleProperty.unit_number,
        property_type: sampleProperty.property_type,
        square_meters: sampleProperty.square_meters,
        bedrooms: sampleProperty.bedrooms,
        bathrooms: sampleProperty.bathrooms,
        max_occupancy: sampleProperty.max_occupancy,
        status: "active",
        user_id: testUserId,
      })
      .select("id")
      .single()

    if (propertyError) throw propertyError

    const propertyId = propertyData.id

    // Now create records in each category table
    // Basic Info
    await supabaseAdmin.from("property_basic_info").insert({
      property_id: propertyId,
      full_address: sampleProperty.full_address,
      year_built: sampleProperty.year_built,
      year_renovated: sampleProperty.year_renovated,
      description: sampleProperty.description,
      floor_plan_url: sampleProperty.floor_plan,
    })

    // Safety & Security
    await supabaseAdmin.from("property_safety").insert({
      property_id: propertyId,
      smoke_detectors: sampleProperty.smoke_detectors,
      fire_extinguisher_location: sampleProperty.fire_extinguisher_location,
      fire_extinguisher_expiry: sampleProperty.fire_extinguisher_expiry,
      emergency_exit_plan: sampleProperty.emergency_exit_plan,
      first_aid_location: sampleProperty.first_aid_location,
      door_lock_type: sampleProperty.door_lock_type,
      smart_lock_code: sampleProperty.smart_lock_code,
      building_security: sampleProperty.building_security,
      cctv_coverage: sampleProperty.cctv_coverage,
      emergency_contacts: sampleProperty.emergency_contacts,
      window_security: sampleProperty.window_security,
      balcony_safety: sampleProperty.balcony_safety,
      child_safety_features: sampleProperty.child_safety_features,
    })

    // Kitchen & Dining
    await supabaseAdmin.from("property_kitchen").insert({
      property_id: propertyId,
      major_appliances: sampleProperty.major_appliances,
      small_appliances: sampleProperty.small_appliances,
      cookware_inventory: sampleProperty.cookware_inventory,
      dishware_count: sampleProperty.dishware_count,
      dining_capacity: sampleProperty.dining_capacity,
      water_filtration: sampleProperty.water_filtration,
      coffee_tea_facilities: sampleProperty.coffee_tea_facilities,
      special_features: sampleProperty.special_features,
      waste_disposal: sampleProperty.waste_disposal,
      pantry_staples: sampleProperty.pantry_staples,
      counter_material: sampleProperty.counter_material,
      kitchen_photos: sampleProperty.kitchen_photos,
    })

    // Bedrooms
    await supabaseAdmin.from("property_bedrooms").insert({
      property_id: propertyId,
      bed_configurations: sampleProperty.bed_configurations,
      extra_bedding_location: sampleProperty.extra_bedding_location,
      mattress_type: sampleProperty.mattress_type,
      pillow_details: sampleProperty.pillow_details,
      closet_details: sampleProperty.closet_details,
      blackout_curtains: sampleProperty.blackout_curtains,
      bedroom_electronics: sampleProperty.bedroom_electronics,
      furniture_inventory: sampleProperty.furniture_inventory,
      bedroom_amenities: sampleProperty.bedroom_amenities,
    })

    // Bathrooms
    await supabaseAdmin.from("property_bathrooms").insert({
      property_id: propertyId,
      shower_bath_config: sampleProperty.shower_bath_config,
      towel_details: sampleProperty.towel_details,
      toiletries_provided: sampleProperty.toiletries_provided,
      hair_dryer_available: sampleProperty.hair_dryer_available,
      hair_dryer_details: sampleProperty.hair_dryer_details,
      water_pressure: sampleProperty.water_pressure,
      hot_water_system: sampleProperty.hot_water_system,
      ventilation: sampleProperty.ventilation,
      bathroom_special_features: sampleProperty.bathroom_special_features,
      bathroom_accessibility_features: sampleProperty.bathroom_accessibility_features,
    })

    // Technology
    await supabaseAdmin.from("property_technology").insert({
      property_id: propertyId,
      wifi_network: sampleProperty.wifi_network,
      wifi_password: sampleProperty.wifi_password,
      internet_speed: sampleProperty.internet_speed,
      smart_home_features: sampleProperty.smart_home_features,
      router_location: sampleProperty.router_location,
      tv_details: sampleProperty.tv_details,
      streaming_services: sampleProperty.streaming_services,
      speaker_systems: sampleProperty.speaker_systems,
      remote_controls: sampleProperty.remote_controls,
      charging_stations: sampleProperty.charging_stations,
      backup_solutions: sampleProperty.backup_solutions,
    })

    // Practical Living
    await supabaseAdmin.from("property_practical").insert({
      property_id: propertyId,
      washer_details: sampleProperty.washer_details,
      dryer_details: sampleProperty.dryer_details,
      detergent_provided: sampleProperty.detergent_provided,
      iron_board_available: sampleProperty.iron_board_available,
      drying_rack_location: sampleProperty.drying_rack_location,
      laundry_basket_available: sampleProperty.laundry_basket_available,
      building_laundry_info: sampleProperty.building_laundry_info,
      vacuum_details: sampleProperty.vacuum_details,
      cleaning_supplies: sampleProperty.cleaning_supplies,
      cleaning_schedule: sampleProperty.cleaning_schedule,
      special_instructions: sampleProperty.special_instructions,
      stain_removal_kit: sampleProperty.stain_removal_kit,
      ac_units_details: sampleProperty.ac_units_details,
      heating_system: sampleProperty.heating_system,
      thermostat_instructions: sampleProperty.thermostat_instructions,
      ventilation_systems: sampleProperty.ventilation_systems,
      air_purifiers: sampleProperty.air_purifiers,
      electrical_panel_location: sampleProperty.electrical_panel_location,
    })

    // Location & Lifestyle
    await supabaseAdmin.from("property_location").insert({
      property_id: propertyId,
      public_transport: sampleProperty.public_transport,
      nearby_locations: sampleProperty.nearby_locations,
      walking_score: sampleProperty.walking_score,
      neighborhood_description: sampleProperty.neighborhood_description,
      restaurants: sampleProperty.restaurants,
      grocery_shopping: sampleProperty.grocery_shopping,
      tourist_attractions: sampleProperty.tourist_attractions,
      emergency_services: sampleProperty.emergency_services,
      local_tips: sampleProperty.local_tips,
      weather_patterns: sampleProperty.weather_patterns,
      safety_assessment: sampleProperty.safety_assessment,
    })

    // Accessibility & Sustainability
    await supabaseAdmin.from("property_accessibility").insert({
      property_id: propertyId,
      step_free_access: sampleProperty.step_free_access,
      elevator_accessibility: sampleProperty.elevator_accessibility,
      doorway_widths: sampleProperty.doorway_widths,
      bathroom_features: sampleProperty.bathroom_features,
      kitchen_height: sampleProperty.kitchen_height,
      visual_features: sampleProperty.visual_features,
      auditory_features: sampleProperty.auditory_features,
      energy_rating: sampleProperty.energy_rating,
      renewable_features: sampleProperty.renewable_features,
      recycling_instructions: sampleProperty.recycling_instructions,
      efficient_appliances: sampleProperty.efficient_appliances,
      water_conservation: sampleProperty.water_conservation,
      eco_products: sampleProperty.eco_products,
      sustainable_materials: sampleProperty.sustainable_materials,
    })

    // Add primary photo to property_images
    if (sampleProperty.primary_photo) {
      await supabaseAdmin.from("property_images").insert({
        property_id: propertyId,
        url: sampleProperty.primary_photo,
        type: "main",
        display_order: 0,
      })
    }

    // Initialize checklist completion
    await supabaseAdmin.from("checklist_completion").insert({
      property_id: propertyId,
      basic_information: 100,
      safety_security: 100,
      kitchen_dining: 100,
      bedrooms: 100,
      bathrooms: 100,
      technology: 100,
      practical_living: 100,
      location_lifestyle: 100,
      accessibility_sustainability: 100,
      overall: 100,
    })

    // Revalidate the properties page
    revalidatePath("/properties")

    return { success: true, propertyId }
  } catch (error) {
    console.error("Error seeding sample property:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to seed sample property" }
  }
}

// Helper function to create tables if they don't exist
async function createTablesIfNeeded(supabase: any) {
  // This is a simplified version - in a real app, you'd use migrations
  const tables = [
    "properties",
    "property_basic_info",
    "property_safety",
    "property_kitchen",
    "property_bedrooms",
    "property_bathrooms",
    "property_technology",
    "property_practical",
    "property_location",
    "property_accessibility",
    "property_images",
    "checklist_completion",
    "users",
  ]

  // Check if tables exist
  for (const table of tables) {
    const { error } = await supabase.from(table).select("*").limit(1)

    if (error && error.code === "PGRST116") {
      // Table doesn't exist, create it
      console.log(`Table ${table} doesn't exist, would create it here`)
      // In a real app, you'd execute SQL to create the table
      // For this example, we'll assume the tables are created in the Supabase dashboard
    }
  }
}

// Helper function to ensure a test user exists
async function ensureTestUser(supabase: any) {
  // Check if we're already authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return user.id
  }

  // Check if test user exists in users table
  const { data: existingUser } = await supabase.from("users").select("id").eq("email", "test@example.com").single()

  if (existingUser) {
    return existingUser.id
  }

  // For this example, we'll use a hardcoded user ID
  // In a real app, you'd create a user through auth
  const testUserId = "00000000-0000-0000-0000-000000000000"

  // Insert test user into users table
  await supabase.from("users").insert({
    id: testUserId,
    email: "test@example.com",
    role: "admin",
    full_name: "Test User",
  })

  return testUserId
}
