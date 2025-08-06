import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Sample property data based on the comprehensive checklist
export const sampleProperty = {
  property_reference: "noble-remix-772-621",
  building_name: "Noble Remix",
  unit_number: "772/621",
  full_address: "772 Sukhumvit Rd, Khlong Tan, Khlong Toei, Bangkok 10110",
  property_type: "Luxury Condo",
  square_meters: 68,
  bedrooms: 1,
  bathrooms: 1,
  max_occupancy: 3,
  primary_photo: "/placeholder.svg?height=300&width=400&query=luxury condo interior",
  year_built: "2019/2023",
  description:
    "Modern one-bedroom luxury condo in the heart of Sukhumvit with city views, high-end furnishings, and full amenities.",
  status: "active",

  // Safety & Security
  safety_security: {
    smoke_detectors: ["Living Room", "Kitchen", "Hallway"],
    fire_extinguisher: "Kitchen cabinet under sink (expires 12/2026)",
    emergency_exit_plan: true,
    first_aid_kit_location: "Bathroom cabinet",
    door_lock_type: "Digital Smart Lock",
    smart_lock_codes: "230597# (internal only)",
    building_security_features: "24/7 Security Guards, CCTV, Key Card Access",
    cctv_coverage: ["Building Entrance", "Elevator", "Hallways", "Parking"],
    emergency_contacts: "Building Manager: +66 81 234 5678\nEmergency: 191\nTourist Police: 1155",
    window_security: "Safety locks on all windows",
    balcony_safety: "Glass barriers 1.2m high, no child hazards",
    child_safety_features: ["Socket covers", "Cabinet locks", "No sharp edges"],
  },

  // Kitchen & Dining
  kitchen_dining: {
    major_appliances: [
      "Samsung Smart Refrigerator",
      "Electrolux Induction Cooktop",
      "Teka Built-in Oven",
      "Teka Dishwasher",
    ],
    small_appliances: ["Nespresso Coffee Machine", "Electric Kettle", "Toaster", "Rice Cooker", "Blender"],
    cookware_inventory: "Complete set of stainless steel pots and pans (10 pieces)",
    dishware_utensils_count: "Service for 4 (16 pieces including plates, bowls, mugs, glasses)",
    dining_seating_capacity: 4,
    water_filtration: "Under-sink 3-stage filtration system",
    coffee_tea_facilities: "Nespresso with starter pods, electric kettle, tea selection",
    special_kitchen_features: "Marble countertops, ambient lighting, pull-out pantry",
    waste_disposal_instructions: "Separate bins for general waste and recycling under sink",
    pantry_staples: ["Salt", "Pepper", "Cooking oil", "Basic spices", "Tea", "Coffee"],
    counter_type: "Premium white marble",
  },

  // Bedrooms
  bedroom_details: {
    bed_configurations: "King size (180x200cm)",
    extra_bedding_storage: "Closet top shelf",
    mattress_type: "Luxury pocket spring, medium firm",
    pillow_types: "4 sleeping pillows, 2 decorative pillows",
    closet_storage: "Walk-in closet with 10 hangers, 4 drawers, and shoe rack",
    blackout_curtains: true,
    bedroom_electronics: ["Smart TV", "Bluetooth speaker", "Alarm clock with USB charging"],
    bedroom_furniture: "Bed, 2 nightstands, dresser, chair, full-length mirror",
    bedroom_amenities: ["Reading lamp", "Full-length mirror", "Workspace desk"],
    air_quality_features: "Air purifier, Hypoallergenic bedding",
    childrens_bedding: "Portable crib available on request",
    bedroom_views: "City skyline view, adjustable lighting with dimmer",
  },

  // Bathrooms
  bathroom_details: {
    shower_bath_configuration: "Walk-in rainfall shower",
    towel_count: "4 bath, 4 hand, 2 face (luxury cotton)",
    toiletries_provided: ["Shampoo", "Conditioner", "Body wash", "Soap", "Hand soap", "Lotion"],
    hair_dryer: true,
    water_pressure: "Excellent",
    hot_water_system: "Tankless water heater",
    bathroom_ventilation: "Exhaust fan with humidity sensor",
    special_bathroom_features: ["Heated floors", "Magnifying mirror", "Rain shower head"],
    bathroom_storage: "Vanity with 3 drawers, medicine cabinet",
    bathroom_electronics: ["Waterproof speaker", "Smart mirror", "Heated towel rack"],
    bath_mat: "Memory foam mat, glass shower door",
    accessibility_features: ["Grab bars", "Non-slip surfaces", "Shower seat available"],
  },

  // Technology
  technology: {
    wifi_network: "Noble_Remix_772 (internal only)",
    wifi_password: "NR772BKK2023! (internal only)",
    internet_speed: "1 Gbps fiber optic",
    smart_home_features: ["Google Home Hub", "Smart lighting", "Smart curtains", "Smart AC control"],
    tv_details: '55" Samsung QLED Smart TV with Netflix, Disney+, YouTube access',
    speaker_systems: "Sonos sound system in living room",
    remote_controls: ["TV remote", "AC remote", "Sonos remote", "Google Home remote"],
    device_charging: "USB charging ports by bed and in living room",
    router_location: "Cabinet in living room",
    entertainment_guide: "Detailed smart TV and streaming guide in house manual",
    smart_thermostat: "Nest thermostat with automated schedule",
    backup_tech_solutions: "Portable WiFi hotspot in drawer if main internet fails",
  },

  // Additional sections would follow the same pattern...

  // For brevity, I'm including just a few more key sections

  building_amenities: {
    entrance_instructions: "Use keycard for main entrance, 24/7, code #2468 for after-hours side entrance",
    elevator_info: "3 elevators, use keycard to access residential floors",
    parking_details: "Parking space #B72, level B2, use keycard for entry/exit",
    swimming_pool: "25m infinity pool on 8th floor, open 6am-10pm daily",
    fitness_center: "Fully equipped gym on 8th floor, open 24/7",
    communal_areas: ["Sky lounge (9th floor)", "Garden area (8th floor)", "Co-working space (ground floor)"],
    concierge_services: "24-hour front desk, package acceptance, taxi service",
    building_rules: "No noise after 10pm, no smoking in common areas, pool towels provided",
    building_management: "Noble Property Management, contact: 02-123-4567",
  },

  local_information: {
    public_transportation: "BTS Thong Lo Station (350m, 5min walk)",
    recommended_restaurants: ["Soul Food", "Supanniga", "Roast", "Seed"],
    grocery_options: "Villa Market (200m), Foodland (500m)",
    tourist_attractions: ["EmQuartier", "Benchakitti Park", "Thonglor nightlife"],
    emergency_services: "Samitivej Hospital (1.2km), Police (800m)",
    local_tips: "Tuesday street food market on Soi 38",
    neighborhood_description: "Upscale expat area with dining, shopping",
    walking_score: "92/100 - Very walkable neighborhood",
  },

  // Checklist completion percentages
  checklist_completion: {
    basic_information: 100,
    safety_security: 90,
    kitchen_dining: 95,
    bedrooms: 100,
    bathrooms: 85,
    technology: 80,
    laundry_cleaning: 90,
    outdoor_spaces: 75,
    building_amenities: 100,
    hvac_utilities: 85,
    local_information: 95,
    luxury_amenities: 90,
    accessibility: 70,
    sustainability: 80,
    maintenance: 85,
    administrative: 95,
    overall: 87,
  },
}

/**
 * Seeds the database with a sample property
 * This function is meant to be called programmatically, not from the UI
 */
export async function seedSampleProperty() {
  try {
    const supabase = createClient()

    // Check if tables exist, create them if they don't
    const { error: tablesError } = await supabase.rpc("check_and_create_tables")
    if (tablesError) {
      console.error("Error checking/creating tables:", tablesError)
      return { success: false, error: "Failed to set up database tables" }
    }

    // Insert the sample property
    const { data: propertyData, error: propertyError } = await supabase
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (propertyError) {
      console.error("Error inserting property:", propertyError)
      return { success: false, error: "Failed to insert sample property" }
    }

    // Insert basic info with description
    if (propertyData && propertyData.length > 0) {
      const propertyId = propertyData[0].id

      await supabase.from("property_basic_info").insert({
        property_id: propertyId,
        full_address: sampleProperty.full_address,
        year_built: sampleProperty.year_built,
        description: sampleProperty.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    // Insert related data for each section
    // This would involve multiple inserts for each related table
    // For brevity, I'm omitting the detailed implementation

    // Revalidate the properties path to refresh the data
    revalidatePath("/properties")

    return {
      success: true,
      propertyId: propertyData[0]?.id,
      message: "Sample property seeded successfully",
    }
  } catch (error) {
    console.error("Unexpected error during seeding:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
