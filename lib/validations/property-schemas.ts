import { z } from "zod"

// Basic Information Schemas
export const identityLocationSchema = z.object({
  property_reference: z.string().min(1, "Property reference is required"),
  building_name: z.string().min(1, "Building name is required"),
  unit_number: z.string().min(1, "Unit number is required"),
  full_address: z.string().min(10, "Please provide a complete address"),
  property_type: z.string().min(1, "Property type is required"),
})

export const spaceCapacitySchema = z.object({
  square_meters: z
    .number({ invalid_type_error: "Square meters must be a number" })
    .positive("Square meters must be positive")
    .or(z.string().regex(/^\d+$/).transform(Number))
    .optional(),
  bedrooms: z
    .number({ invalid_type_error: "Bedrooms must be a number" })
    .min(0, "Bedrooms cannot be negative")
    .or(z.string().regex(/^\d+$/).transform(Number)),
  bathrooms: z
    .number({ invalid_type_error: "Bathrooms must be a number" })
    .min(0, "Bathrooms cannot be negative")
    .or(z.string().regex(/^\d+$/).transform(Number)),
  max_occupancy: z
    .number({ invalid_type_error: "Maximum occupancy must be a number" })
    .min(1, "Maximum occupancy must be at least 1")
    .or(z.string().regex(/^\d+$/).transform(Number)),
})

export const descriptionStorySchema = z.object({
  year_built: z
    .string()
    .regex(/^\d{4}$/, "Year built must be a 4-digit year")
    .optional(),
  year_renovated: z
    .string()
    .regex(/^\d{4}$/, "Year renovated must be a 4-digit year")
    .optional(),
  description: z
    .string()
    .min(50, "Description should be at least 50 characters")
    .max(2000, "Description should not exceed 2000 characters"),
})

export const visualImpressionSchema = z.object({
  primary_photo: z.string().url("Primary photo must be a valid URL").optional(),
  floor_plan: z.string().url("Floor plan must be a valid URL").optional(),
})

// Safety & Security Schemas
export const smokeDetectorSchema = z.object({
  location: z.string().min(1, "Location is required"),
  expiry_date: z.string().optional(),
})

export const fireEmergencySchema = z.object({
  smoke_detectors: z.array(smokeDetectorSchema).optional(),
  fire_extinguisher_location: z.string().min(1, "Fire extinguisher location is required"),
  fire_extinguisher_expiry: z.string().optional(),
  emergency_exit_plan: z.boolean().optional(),
  first_aid_location: z.string().min(1, "First aid kit location is required"),
})

export const accessSecuritySchema = z.object({
  door_lock_type: z.string().min(1, "Door lock type is required"),
  smart_lock_code: z.string().optional(),
  building_security: z.string().min(1, "Building security information is required"),
  cctv_coverage: z.array(z.string()).optional(),
})

export const safetyFeaturesSchema = z.object({
  emergency_contacts: z.string().min(1, "Emergency contacts are required"),
  window_security: z.string().optional(),
  balcony_safety: z.string().optional(),
  child_safety_features: z.array(z.string()).optional(),
})

// Kitchen & Dining Schemas
export const cookingEssentialsSchema = z.object({
  major_appliances: z.array(z.string()).min(1, "At least one major appliance is required"),
  small_appliances: z.array(z.string()).optional(),
  cookware_inventory: z.string().min(1, "Cookware inventory is required"),
  dishware_count: z.string().min(1, "Dishware count is required"),
  dining_capacity: z
    .number({ invalid_type_error: "Dining capacity must be a number" })
    .min(1, "Dining capacity must be at least 1")
    .or(z.string().regex(/^\d+$/).transform(Number)),
})

export const diningCookwareSchema = z.object({
  water_filtration: z.string().optional(),
  coffee_tea_facilities: z.string().optional(),
  waste_disposal: z.string().optional(),
  pantry_staples: z.array(z.string()).optional(),
})

export const specialKitchenSchema = z.object({
  special_features: z.string().optional(),
  counter_material: z.string().optional(),
  kitchen_photos: z.array(z.string().url("Kitchen photo must be a valid URL")).optional(),
})

// Bedrooms & Bathrooms Schemas
export const roomConfigSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  size: z.string().min(1, "Bed size is required"),
  type: z.string().min(1, "Bed type is required"),
})

export const sleepSanctuarySchema = z.object({
  bed_configurations: z.array(roomConfigSchema).min(1, "At least one bed configuration is required"),
  extra_bedding_location: z.string().optional(),
  mattress_type: z.string().optional(),
  pillow_details: z.string().optional(),
  closet_details: z.string().optional(),
})

export const bedroomComfortSchema = z.object({
  blackout_curtains: z.boolean().optional(),
  bedroom_electronics: z.array(z.string()).optional(),
  furniture_inventory: z.string().optional(),
  bedroom_amenities: z.array(z.string()).optional(),
})

export const bathroomBlissSchema = z.object({
  shower_bath_config: z.string().min(1, "Shower/bath configuration is required"),
  towel_details: z.string().min(1, "Towel details are required"),
  toiletries_provided: z.array(z.string()).optional(),
  hair_dryer_available: z.boolean().optional(),
  hair_dryer_details: z.string().optional(),
})

export const bathroomFeaturesSchema = z.object({
  water_pressure: z.string().optional(),
  hot_water_system: z.string().optional(),
  ventilation: z.string().optional(),
  bathroom_special_features: z.array(z.string()).optional(),
  bathroom_accessibility_features: z.array(z.string()).optional(),
})

// Technology Schemas
export const connectedLivingSchema = z.object({
  wifi_network: z.string().min(1, "WiFi network name is required"),
  wifi_password: z.string().min(1, "WiFi password is required"),
  internet_speed: z.string().optional(),
  smart_home_features: z.array(z.string()).optional(),
  router_location: z.string().optional(),
})

export const entertainmentHubSchema = z.object({
  tv_details: z.string().optional(),
  streaming_services: z.string().optional(),
  speaker_systems: z.string().optional(),
  remote_controls: z.array(z.string()).optional(),
  charging_stations: z.string().optional(),
  backup_solutions: z.string().optional(),
})

// Practical Living Schemas
export const laundrySolutionsSchema = z.object({
  washer_details: z.string().optional(),
  dryer_details: z.string().optional(),
  detergent_provided: z.boolean().optional(),
  iron_board_available: z.boolean().optional(),
  drying_rack_location: z.string().optional(),
  laundry_basket_available: z.boolean().optional(),
  building_laundry_info: z.string().optional(),
})

export const cleaningMaintenanceSchema = z.object({
  vacuum_details: z.string().optional(),
  cleaning_supplies: z.array(z.string()).optional(),
  cleaning_schedule: z.string().optional(),
  special_instructions: z.string().optional(),
  stain_removal_kit: z.boolean().optional(),
})

export const climateControlSchema = z.object({
  ac_units_details: z.string().optional(),
  heating_system: z.string().optional(),
  thermostat_instructions: z.string().optional(),
  ventilation_systems: z.string().optional(),
  air_purifiers: z.string().optional(),
  electrical_panel_location: z.string().optional(),
})

// Location & Lifestyle Schemas
export const locationDistanceSchema = z.object({
  type: z.string().min(1, "Location type is required"),
  name: z.string().min(1, "Location name is required"),
  distance: z.string().min(1, "Distance is required"),
  walkTime: z.string().optional(),
})

export const gettingAroundSchema = z.object({
  public_transport: z.string().optional(),
  nearby_locations: z.array(locationDistanceSchema).optional(),
  walking_score: z.string().optional(),
  neighborhood_description: z.string().optional(),
})

export const localGemsSchema = z.object({
  restaurants: z.array(z.string()).optional(),
  grocery_shopping: z.string().optional(),
  tourist_attractions: z.array(z.string()).optional(),
  emergency_services: z.string().optional(),
  local_tips: z.string().optional(),
  weather_patterns: z.string().optional(),
  safety_assessment: z.string().optional(),
})

// Accessibility & Sustainability Schemas
export const inclusiveDesignSchema = z.object({
  step_free_access: z.string().optional(),
  elevator_accessibility: z.string().optional(),
  doorway_widths: z.string().optional(),
  bathroom_features: z.array(z.string()).optional(),
  kitchen_height: z.string().optional(),
  visual_features: z.array(z.string()).optional(),
  auditory_features: z.array(z.string()).optional(),
})

export const greenLivingSchema = z.object({
  energy_rating: z.string().optional(),
  renewable_features: z.string().optional(),
  recycling_instructions: z.string().optional(),
  efficient_appliances: z.array(z.string()).optional(),
  water_conservation: z.array(z.string()).optional(),
  eco_products: z.array(z.string()).optional(),
  sustainable_materials: z.string().optional(),
})

// Combined schemas by category
export const basicInfoSchema = z.object({
  ...identityLocationSchema.shape,
  ...spaceCapacitySchema.shape,
  ...descriptionStorySchema.shape,
  ...visualImpressionSchema.shape,
})

export const safetySecuritySchema = z.object({
  ...fireEmergencySchema.shape,
  ...accessSecuritySchema.shape,
  ...safetyFeaturesSchema.shape,
})

export const kitchenDiningSchema = z.object({
  ...cookingEssentialsSchema.shape,
  ...diningCookwareSchema.shape,
  ...specialKitchenSchema.shape,
})

export const bedroomsBathroomsSchema = z.object({
  ...sleepSanctuarySchema.shape,
  ...bedroomComfortSchema.shape,
  ...bathroomBlissSchema.shape,
  ...bathroomFeaturesSchema.shape,
})

export const technologySchema = z.object({
  ...connectedLivingSchema.shape,
  ...entertainmentHubSchema.shape,
})

export const practicalLivingSchema = z.object({
  ...laundrySolutionsSchema.shape,
  ...cleaningMaintenanceSchema.shape,
  ...climateControlSchema.shape,
})

export const locationLifestyleSchema = z.object({
  ...gettingAroundSchema.shape,
  ...localGemsSchema.shape,
})

export const accessibilitySustainabilitySchema = z.object({
  ...inclusiveDesignSchema.shape,
  ...greenLivingSchema.shape,
})

// Complete property schema
export const propertySchema = z.object({
  ...basicInfoSchema.shape,
  ...safetySecuritySchema.shape,
  ...kitchenDiningSchema.shape,
  ...bedroomsBathroomsSchema.shape,
  ...technologySchema.shape,
  ...practicalLivingSchema.shape,
  ...locationLifestyleSchema.shape,
  ...accessibilitySustainabilitySchema.shape,
  status: z.enum(["active", "maintenance", "inactive", "pending"]).optional(),
  revenue_band: z.enum(["budget", "mid-range", "luxury", "ultra-luxury"]).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// Helper function to get the schema for a specific step
export function getStepSchema(stepId: string) {
  switch (stepId) {
    // Basic Information
    case "identity-location":
      return identityLocationSchema
    case "space-capacity":
      return spaceCapacitySchema
    case "description-story":
      return descriptionStorySchema
    case "visual-impression":
      return visualImpressionSchema

    // Safety & Security
    case "fire-emergency":
      return fireEmergencySchema
    case "access-security":
      return accessSecuritySchema
    case "safety-features":
      return safetyFeaturesSchema

    // Kitchen & Dining
    case "cooking-essentials":
      return cookingEssentialsSchema
    case "dining-cookware":
      return diningCookwareSchema
    case "special-kitchen":
      return specialKitchenSchema

    // Bedrooms & Bathrooms
    case "sleep-sanctuary":
      return sleepSanctuarySchema
    case "bedroom-comfort":
      return bedroomComfortSchema
    case "bathroom-bliss":
      return bathroomBlissSchema
    case "bathroom-features":
      return bathroomFeaturesSchema

    // Technology
    case "connected-living":
      return connectedLivingSchema
    case "entertainment-hub":
      return entertainmentHubSchema

    // Practical Living
    case "laundry-solutions":
      return laundrySolutionsSchema
    case "cleaning-maintenance":
      return cleaningMaintenanceSchema
    case "climate-control":
      return climateControlSchema

    // Location & Lifestyle
    case "getting-around":
      return gettingAroundSchema
    case "local-gems":
      return localGemsSchema

    // Accessibility & Sustainability
    case "inclusive-design":
      return inclusiveDesignSchema
    case "green-living":
      return greenLivingSchema

    default:
      return z.object({})
  }
}

// Helper function to get the schema for a specific category
export function getCategorySchema(categoryId: string) {
  switch (categoryId) {
    case "basic-info":
      return basicInfoSchema
    case "safety-security":
      return safetySecuritySchema
    case "kitchen-dining":
      return kitchenDiningSchema
    case "bedrooms-bathrooms":
      return bedroomsBathroomsSchema
    case "technology":
      return technologySchema
    case "practical-living":
      return practicalLivingSchema
    case "location-lifestyle":
      return locationLifestyleSchema
    case "accessibility-sustainability":
      return accessibilitySustainabilitySchema
    default:
      return z.object({})
  }
}
