"use server"

import { revalidatePath } from "next/cache"
import { getServerSupabaseClient } from "@/lib/supabase/server"
import { calculateCategoryCompletion, calculateOverallCompletion } from "@/lib/utils/checklist-completion"
import type { WizardFormData } from "@/lib/types/wizard-types"

export async function createProperty(formData: WizardFormData) {
  try {
    const supabase = await getServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // First, create the main property record
    const { data: propertyData, error: propertyError } = await supabase
      .from("properties")
      .insert({
        property_reference: formData.property_reference || "",
        building_name: formData.building_name || "",
        unit_number: formData.unit_number || "",
        property_type: formData.property_type || "",
        square_meters: formData.square_meters || 0,
        bedrooms: formData.bedrooms || 0,
        bathrooms: formData.bathrooms || 0,
        max_occupancy: formData.max_occupancy || 0,
        status: "pending",
        user_id: user.id,
      })
      .select("id")
      .single()

    if (propertyError) throw propertyError

    const propertyId = propertyData.id

    // Now create records in each category table
    // Basic Info
    await supabase.from("property_basic_info").insert({
      property_id: propertyId,
      full_address: formData.full_address || "",
      year_built: formData.year_built || null,
      year_renovated: formData.year_renovated || null,
      description: formData.description || "",
      floor_plan_url: formData.floor_plan || null,
    })

    // Safety & Security
    await supabase.from("property_safety").insert({
      property_id: propertyId,
      smoke_detectors: formData.smoke_detectors || [],
      fire_extinguisher_location: formData.fire_extinguisher_location || null,
      fire_extinguisher_expiry: formData.fire_extinguisher_expiry || null,
      emergency_exit_plan: formData.emergency_exit_plan || null,
      first_aid_location: formData.first_aid_location || null,
      door_lock_type: formData.door_lock_type || null,
      smart_lock_code: formData.smart_lock_code || null,
      building_security: formData.building_security || null,
      cctv_coverage: formData.cctv_coverage || [],
      emergency_contacts: formData.emergency_contacts || null,
      window_security: formData.window_security || null,
      balcony_safety: formData.balcony_safety || null,
      child_safety_features: formData.child_safety_features || [],
    })

    // Kitchen & Dining
    await supabase.from("property_kitchen").insert({
      property_id: propertyId,
      major_appliances: formData.major_appliances || [],
      small_appliances: formData.small_appliances || [],
      cookware_inventory: formData.cookware_inventory || null,
      dishware_count: formData.dishware_count || null,
      dining_capacity: formData.dining_capacity || null,
      water_filtration: formData.water_filtration || null,
      coffee_tea_facilities: formData.coffee_tea_facilities || null,
      special_features: formData.special_features || null,
      waste_disposal: formData.waste_disposal || null,
      pantry_staples: formData.pantry_staples || [],
      counter_material: formData.counter_material || null,
      kitchen_photos: formData.kitchen_photos || [],
    })

    // Bedrooms
    await supabase.from("property_bedrooms").insert({
      property_id: propertyId,
      bed_configurations: formData.bed_configurations || [],
      extra_bedding_location: formData.extra_bedding_location || null,
      mattress_type: formData.mattress_type || null,
      pillow_details: formData.pillow_details || null,
      closet_details: formData.closet_details || null,
      blackout_curtains: formData.blackout_curtains || null,
      bedroom_electronics: formData.bedroom_electronics || [],
      furniture_inventory: formData.furniture_inventory || null,
      bedroom_amenities: formData.bedroom_amenities || [],
    })

    // Bathrooms
    await supabase.from("property_bathrooms").insert({
      property_id: propertyId,
      shower_bath_config: formData.shower_bath_config || null,
      towel_details: formData.towel_details || null,
      toiletries_provided: formData.toiletries_provided || [],
      hair_dryer_available: formData.hair_dryer_available || null,
      hair_dryer_details: formData.hair_dryer_details || null,
      water_pressure: formData.water_pressure || null,
      hot_water_system: formData.hot_water_system || null,
      ventilation: formData.ventilation || null,
      bathroom_special_features: formData.bathroom_special_features || [],
      bathroom_accessibility_features: formData.bathroom_accessibility_features || [],
    })

    // Technology (with sensitive data)
    await supabase.from("property_technology").insert({
      property_id: propertyId,
      wifi_network: formData.wifi_network || null,
      wifi_password: formData.wifi_password || null,
      internet_speed: formData.internet_speed || null,
      smart_home_features: formData.smart_home_features || [],
      router_location: formData.router_location || null,
      tv_details: formData.tv_details || null,
      streaming_services: formData.streaming_services || null,
      speaker_systems: formData.speaker_systems || null,
      remote_controls: formData.remote_controls || [],
      charging_stations: formData.charging_stations || null,
      backup_solutions: formData.backup_solutions || null,
    })

    // Practical Living
    await supabase.from("property_practical").insert({
      property_id: propertyId,
      washer_details: formData.washer_details || null,
      dryer_details: formData.dryer_details || null,
      detergent_provided: formData.detergent_provided || null,
      iron_board_available: formData.iron_board_available || null,
      drying_rack_location: formData.drying_rack_location || null,
      laundry_basket_available: formData.laundry_basket_available || null,
      building_laundry_info: formData.building_laundry_info || null,
      vacuum_details: formData.vacuum_details || null,
      cleaning_supplies: formData.cleaning_supplies || [],
      cleaning_schedule: formData.cleaning_schedule || null,
      special_instructions: formData.special_instructions || null,
      stain_removal_kit: formData.stain_removal_kit || null,
      ac_units_details: formData.ac_units_details || null,
      heating_system: formData.heating_system || null,
      thermostat_instructions: formData.thermostat_instructions || null,
      ventilation_systems: formData.ventilation_systems || null,
      air_purifiers: formData.air_purifiers || null,
      electrical_panel_location: formData.electrical_panel_location || null,
    })

    // Location & Lifestyle
    await supabase.from("property_location").insert({
      property_id: propertyId,
      public_transport: formData.public_transport || null,
      nearby_locations: formData.nearby_locations || [],
      walking_score: formData.walking_score || null,
      neighborhood_description: formData.neighborhood_description || null,
      restaurants: formData.restaurants || [],
      grocery_shopping: formData.grocery_shopping || null,
      tourist_attractions: formData.tourist_attractions || [],
      emergency_services: formData.emergency_services || null,
      local_tips: formData.local_tips || null,
      weather_patterns: formData.weather_patterns || null,
      safety_assessment: formData.safety_assessment || null,
    })

    // Accessibility & Sustainability
    await supabase.from("property_accessibility").insert({
      property_id: propertyId,
      step_free_access: formData.step_free_access || null,
      elevator_accessibility: formData.elevator_accessibility || null,
      doorway_widths: formData.doorway_widths || null,
      bathroom_features: formData.bathroom_features || [],
      kitchen_height: formData.kitchen_height || null,
      visual_features: formData.visual_features || [],
      auditory_features: formData.auditory_features || [],
      energy_rating: formData.energy_rating || null,
      renewable_features: formData.renewable_features || null,
      recycling_instructions: formData.recycling_instructions || null,
      efficient_appliances: formData.efficient_appliances || [],
      water_conservation: formData.water_conservation || [],
      eco_products: formData.eco_products || [],
      sustainable_materials: formData.sustainable_materials || null,
    })

    // Add primary photo to property_images
    if (formData.primary_photo) {
      await supabase.from("property_images").insert({
        property_id: propertyId,
        url: formData.primary_photo,
        type: "main",
        display_order: 0,
      })
    }

    // Initialize checklist completion
    await supabase.from("checklist_completion").insert({
      property_id: propertyId,
      basic_information: calculateCategoryCompletion(formData, "basic-info"),
      safety_security: calculateCategoryCompletion(formData, "safety-security"),
      kitchen_dining: calculateCategoryCompletion(formData, "kitchen-dining"),
      bedrooms: calculateCategoryCompletion(formData, "bedrooms-bathrooms"),
      bathrooms: calculateCategoryCompletion(formData, "bedrooms-bathrooms"),
      technology: calculateCategoryCompletion(formData, "technology"),
      practical_living: calculateCategoryCompletion(formData, "practical-living"),
      location_lifestyle: calculateCategoryCompletion(formData, "location-lifestyle"),
      accessibility_sustainability: calculateCategoryCompletion(formData, "accessibility-sustainability"),
      overall: calculateOverallCompletion(formData),
    })

    // Delete the draft if it exists
    if (formData.id) {
      await supabase.from("property_drafts").delete().eq("id", formData.id)
    }

    // Revalidate the properties page
    revalidatePath("/properties")

    return { success: true, propertyId }
  } catch (error) {
    console.error("Error creating property:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create property" }
  }
}

export async function saveDraft(formData: WizardFormData) {
  try {
    const supabase = await getServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // First, check if we have a draft ID already
    const draftId = formData.id

    if (draftId) {
      // Update existing draft
      const { error } = await supabase
        .from("property_drafts")
        .update({
          data: formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", draftId)

      if (error) throw error

      return { success: true, id: draftId }
    } else {
      // Create new draft
      const { data, error } = await supabase
        .from("property_drafts")
        .insert({
          user_id: user.id,
          data: formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single()

      if (error) throw error

      return { success: true, id: data.id }
    }
  } catch (error) {
    console.error("Error saving draft:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to save draft" }
  }
}

export async function loadDraft(draftId: string) {
  try {
    const supabase = await getServerSupabaseClient()
    const { data, error } = await supabase.from("property_drafts").select("data").eq("id", draftId).single()

    if (error) throw error

    return { success: true, data: data.data as WizardFormData }
  } catch (error) {
    console.error("Error loading draft:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to load draft" }
  }
}

export async function deleteDraft(draftId: string) {
  try {
    const supabase = await getServerSupabaseClient()
    const { error } = await supabase.from("property_drafts").delete().eq("id", draftId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error deleting draft:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete draft" }
  }
}
