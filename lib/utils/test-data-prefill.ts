import { WizardFormData } from '@/lib/types/wizard-types'

// Comprehensive test property data templates for debugging and testing
export const testPropertyTemplates = {
  luxuryCondo: {
    // Basic Information
    property_reference: "noble-remix-772-621",
    building_name: "Noble Remix",
    unit_number: "772/621",
    full_address: "772 Sukhumvit Rd, Khlong Tan, Khlong Toei, Bangkok 10110",
    property_type: "luxury_condo",
    square_meters: 68,
    bedrooms: 1,
    bathrooms: 1,
    max_occupancy: 3,
    year_built: "2019",
    year_renovated: "2023",
    description: "Modern one-bedroom luxury condo in the heart of Sukhumvit with city views, high-end furnishings, and full amenities.",
    primary_photo: "/placeholder.svg?height=300&width=400&query=luxury condo interior",
    floor_plan: "/placeholder.svg?height=600&width=800&query=floor plan",

    // Safety & Security
    smoke_detectors: [
      { location: "Living Room", expiry_date: "2025-12-31" },
      { location: "Kitchen", expiry_date: "2025-12-31" },
      { location: "Hallway", expiry_date: "2025-12-31" }
    ],
    fire_extinguisher_location: "Kitchen cabinet under sink",
    fire_extinguisher_expiry: "2026-12-31",
    emergency_exit_plan: true,
    first_aid_location: "Bathroom cabinet",
    door_lock_type: "Digital Smart Lock",
    smart_lock_code: "230597#",
    building_security: "24/7 Security Guards, CCTV, Key Card Access",
    cctv_coverage: ["Building Entrance", "Elevator", "Hallways", "Parking"],
    emergency_contacts: "Building Manager: +66 81 234 5678\nEmergency: 191\nTourist Police: 1155",
    window_security: "Safety locks on all windows",
    balcony_safety: "Glass barriers 1.2m high, no child hazards",
    child_safety_features: ["Socket covers", "Cabinet locks", "No sharp edges"],

    // Kitchen & Dining
    major_appliances: ["refrigerator", "stove", "oven", "microwave", "dishwasher"],
    small_appliances: ["coffee_maker", "kettle", "toaster", "blender", "rice_cooker"],
    cookware_inventory: "Complete set of stainless steel pots and pans (10 pieces), non-stick frying pans, baking sheets, mixing bowls",
    dishware_count: "Service for 4 (16 pieces including plates, bowls, mugs, glasses)",
    dining_capacity: 4,
    water_filtration: "Under-sink 3-stage filtration system",
    coffee_tea_facilities: "Nespresso with starter pods, electric kettle, tea selection",
    special_features: "Marble countertops, ambient lighting, pull-out pantry",
    waste_disposal: "Separate bins for general waste and recycling under sink",
    pantry_staples: ["Salt", "Pepper", "Cooking oil", "Basic spices", "Tea", "Coffee"],
    counter_material: "Premium white marble",
    kitchen_photos: ["/placeholder.svg?height=300&width=400&query=luxury kitchen"],

    // Bedrooms & Bathrooms
    bed_configurations: ["King size (180x200cm)"],
    extra_bedding_location: "Closet top shelf",
    mattress_type: "Luxury pocket spring, medium firm",
    pillow_details: "4 sleeping pillows, 2 decorative pillows",
    closet_details: "Walk-in closet with 10 hangers, 4 drawers, and shoe rack",
    blackout_curtains: "Yes - full blackout curtains in bedroom",
    bedroom_electronics: ["Smart TV", "Bluetooth speaker", "Alarm clock with USB charging"],
    furniture_inventory: "Bed, 2 nightstands, dresser, chair, full-length mirror",
    bedroom_amenities: ["Reading lamp", "Full-length mirror", "Workspace desk"],
    shower_bath_config: "Walk-in rainfall shower",
    towel_details: "4 bath, 4 hand, 2 face (luxury cotton)",
    toiletries_provided: ["Shampoo", "Conditioner", "Body wash", "Soap", "Hand soap", "Lotion"],
    hair_dryer_available: true,
    hair_dryer_details: "1800W professional",
    water_pressure: "Excellent",
    hot_water_system: "Tankless water heater",
    ventilation: "Exhaust fan with humidity sensor",
    bathroom_special_features: ["Heated floors", "Magnifying mirror", "Rain shower head"],
    bathroom_accessibility_features: ["Grab bars", "Non-slip surfaces"],

    // Technology
    wifi_network: "Noble_Remix_772",
    wifi_password: "NR772BKK2023!",
    internet_speed: "1 Gbps fiber optic",
    smart_home_features: ["Google Home Hub", "Smart lighting", "Smart curtains", "Smart AC control"],
    router_location: "Cabinet in living room",
    tv_details: '55" Samsung QLED Smart TV with Netflix, Disney+, YouTube access',
    streaming_services: "Netflix, Disney+, YouTube Premium",
    speaker_systems: "Sonos sound system in living room",
    remote_controls: ["TV remote", "AC remote", "Sonos remote", "Google Home remote"],
    charging_stations: "USB charging ports by bed and in living room",
    backup_solutions: "Portable WiFi hotspot in drawer if main internet fails",

    // Practical Living
    washer_details: "LG Front-load, Quick wash: 30 mins, Normal: 1 hour",
    dryer_details: "LG Heat pump dryer, Eco mode recommended",
    detergent_provided: "Yes - eco-friendly detergent pods provided",
    iron_board_available: true,
    drying_rack_location: "Foldable rack on balcony",
    laundry_basket_available: true,
    building_laundry_info: "N/A - In-unit laundry",
    vacuum_details: "Dyson cordless in utility closet",
    cleaning_supplies: ["All-purpose cleaner", "Glass cleaner", "Disinfectant wipes", "Floor cleaner"],
    cleaning_schedule: "Weekly cleaning service (Mondays 10am)",
    special_instructions: "Marble counters need special cleaner (provided under sink)",
    stain_removal_kit: "Yes - stain removal pen and spray in laundry area",
    ac_units_details: "2 Daikin units (living room, bedroom) with individual remotes",
    heating_system: "AC units with heat function",
    thermostat_instructions: "Nest thermostat with automated schedule",
    ventilation_systems: "Central system plus bathroom fans",
    air_purifiers: "Dyson in bedroom, replacement filters in closet",
    electrical_panel_location: "Behind decorative panel in entryway",

    // Location & Lifestyle
    public_transport: "BTS Thong Lo Station (350m, 5min walk)",
    nearby_locations: ["EmQuartier Mall (1.2km)", "Benjasiri Park (800m)", "Sukhumvit Soi 55 (Thonglor)"],
    walking_score: "92 - Walker's Paradise",
    neighborhood_description: "Upscale expat area with dining, shopping",
    restaurants: ["Soul Food", "Supanniga", "Roast", "Seed"],
    grocery_shopping: "Villa Market (200m), Foodland (500m)",
    tourist_attractions: ["EmQuartier", "Benchakitti Park", "Thonglor nightlife"],
    emergency_services: "Samitivej Hospital (1.2km), Police (800m)",
    local_tips: "Tuesday street food market on Soi 38",
    weather_patterns: "Rainy season May-Oct, peak heat March-April",
    safety_assessment: "Very Safe",

    // Accessibility & Sustainability
    step_free_access: true,
    elevator_accessibility: "1.5m x 1.8m, wheelchair accessible",
    doorway_widths: "All doorways 90cm+ width",
    bathroom_features: ["Roll-in shower", "Grab bars"],
    kitchen_height: "Counter height 85cm, sink accessible",
    visual_features: ["High contrast switches"],
    auditory_features: ["Visual doorbell"],
    energy_rating: "A+ (Highest efficiency)",
    renewable_features: "Building has solar panels for common areas",
    recycling_instructions: "Separate bins for plastic, paper, glass",
    efficient_appliances: ["Energy Star refrigerator", "LED lighting"],
    water_conservation: ["Low-flow fixtures", "Dual-flush toilet"],
    eco_products: ["Organic toiletries", "Eco cleaning supplies"],
    sustainable_materials: "Bamboo flooring, Recycled glass counters",
  } as WizardFormData,

  villa: {
    // Basic Information
    property_reference: "sunset-villa-001",
    building_name: "Sunset Villa Resort",
    unit_number: "Villa 1",
    full_address: "123 Sunset Beach Road, Phuket 83110, Thailand",
    property_type: "villa",
    square_meters: 250,
    bedrooms: 3,
    bathrooms: 3,
    max_occupancy: 8,
    year_built: "2020",
    year_renovated: "2024",
    description: "Stunning beachfront villa with private pool, panoramic ocean views, and luxury amenities for the perfect tropical getaway.",
    primary_photo: "/placeholder.svg?height=300&width=400&query=beachfront villa",
    floor_plan: "/placeholder.svg?height=600&width=800&query=villa floor plan",

    // Safety & Security
    smoke_detectors: [
      { location: "Living Room", expiry_date: "2025-12-31" },
      { location: "Kitchen", expiry_date: "2025-12-31" },
      { location: "Master Bedroom", expiry_date: "2025-12-31" },
      { location: "Guest Bedroom 1", expiry_date: "2025-12-31" },
      { location: "Guest Bedroom 2", expiry_date: "2025-12-31" }
    ],
    fire_extinguisher_location: "Kitchen and pool area",
    fire_extinguisher_expiry: "2026-12-31",
    emergency_exit_plan: true,
    first_aid_location: "Master bathroom cabinet",
    door_lock_type: "Smart keypad locks",
    smart_lock_code: "Beach2024#",
    building_security: "Private security, gated community, CCTV",
    cctv_coverage: ["Main entrance", "Pool area", "Parking", "Beach access"],
    emergency_contacts: "Villa Manager: +66 76 123 4567\nEmergency: 191\nTourist Police: 1155",
    window_security: "Security screens on ground floor",
    balcony_safety: "Glass railings, pool safety fence",
    child_safety_features: ["Pool fence", "Socket covers", "Stair gates"],

    // Kitchen & Dining
    major_appliances: ["refrigerator", "stove", "oven", "microwave", "dishwasher", "freezer"],
    small_appliances: ["coffee_maker", "kettle", "toaster", "blender", "rice_cooker", "juicer"],
    cookware_inventory: "Professional cookware set, wok, BBQ utensils, outdoor cooking equipment",
    dishware_count: "Service for 8 (32 pieces including plates, bowls, mugs, glasses)",
    dining_capacity: 8,
    water_filtration: "Whole-house filtration system",
    coffee_tea_facilities: "Espresso machine, coffee grinder, premium tea selection",
    special_features: "Outdoor kitchen, BBQ area, wine fridge, ice maker",
    waste_disposal: "Separate bins for waste, recycling, and compost",
    pantry_staples: ["Salt", "Pepper", "Cooking oil", "Spices", "Tea", "Coffee", "BBQ sauce"],
    counter_material: "Granite countertops",
    kitchen_photos: ["/placeholder.svg?height=300&width=400&query=villa kitchen"],
  } as WizardFormData,

  apartment: {
    // Basic Information
    property_reference: "city-apt-456",
    building_name: "City Center Apartments",
    unit_number: "12B",
    full_address: "456 Urban Street, Downtown District, Bangkok 10500",
    property_type: "apartment",
    square_meters: 45,
    bedrooms: 1,
    bathrooms: 1,
    max_occupancy: 2,
    year_built: "2018",
    year_renovated: "2022",
    description: "Cozy one-bedroom apartment in the heart of the city, perfect for business travelers and couples.",
    primary_photo: "/placeholder.svg?height=300&width=400&query=modern apartment",
    floor_plan: "/placeholder.svg?height=600&width=800&query=apartment floor plan",

    // Safety & Security
    smoke_detectors: [
      { location: "Living Room", expiry_date: "2025-12-31" },
      { location: "Kitchen", expiry_date: "2025-12-31" }
    ],
    fire_extinguisher_location: "Hallway closet",
    fire_extinguisher_expiry: "2026-12-31",
    emergency_exit_plan: true,
    first_aid_location: "Bathroom cabinet",
    door_lock_type: "Electronic keypad",
    smart_lock_code: "City456#",
    building_security: "24/7 concierge, key card access",
    cctv_coverage: ["Lobby", "Elevators", "Parking garage"],
    emergency_contacts: "Concierge: +66 2 123 4567\nEmergency: 191",
    window_security: "Window locks",
    balcony_safety: "N/A - No balcony",
    child_safety_features: ["Socket covers"],

    // Kitchen & Dining
    major_appliances: ["refrigerator", "stove", "microwave"],
    small_appliances: ["coffee_maker", "kettle", "toaster"],
    cookware_inventory: "Basic cookware set, 2 pots, 1 pan, cooking utensils",
    dishware_count: "Service for 2 (8 pieces)",
    dining_capacity: 2,
    water_filtration: "Countertop filter",
    coffee_tea_facilities: "Drip coffee maker, electric kettle",
    special_features: "Compact design, efficient storage",
    waste_disposal: "Single bin under sink",
    pantry_staples: ["Salt", "Pepper", "Cooking oil"],
    counter_material: "Laminate countertops",
    kitchen_photos: ["/placeholder.svg?height=300&width=400&query=compact kitchen"],
  } as WizardFormData
}

// Utility function to get a test template by type
export function getTestPropertyTemplate(type: keyof typeof testPropertyTemplates): WizardFormData {
  return { ...testPropertyTemplates[type] }
}

// Function to get all available template types
export function getAvailableTemplateTypes(): string[] {
  return Object.keys(testPropertyTemplates)
}

// Function to create a randomized test property based on a template
export function createRandomizedTestProperty(baseType: keyof typeof testPropertyTemplates): WizardFormData {
  const template = getTestPropertyTemplate(baseType)
  const randomSuffix = Math.floor(Math.random() * 1000)
  
  return {
    ...template,
    property_reference: `${template.property_reference}-${randomSuffix}`,
    building_name: `${template.building_name} ${randomSuffix}`,
    unit_number: `${template.unit_number}-${randomSuffix}`
  }
}

// Function to pre-fill form data for testing
export function prefillFormData(template: WizardFormData, updateFormData: (data: Partial<WizardFormData>) => void) {
  // Update form data with template
  updateFormData(template)
  
  // Log for debugging
  console.log('[TEST_PREFILL] Form data pre-filled with template:', template.property_reference)
  
  return template
}

// Debug function to validate all required fields are present
export function validateTestData(data: WizardFormData): { isValid: boolean; missingFields: string[] } {
  const requiredFields = [
    'property_reference',
    'building_name', 
    'unit_number',
    'full_address',
    'property_type',
    'bedrooms',
    'bathrooms'
  ]
  
  const missingFields = requiredFields.filter(field => !data[field as keyof WizardFormData])
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}