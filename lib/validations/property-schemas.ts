import { z } from "zod"

// Basic Information Schemas
export const identityLocationSchema = z.object({
  property_reference: z.string().optional(),
  building_name: z.string().optional(),
  unit_number: z.string().optional(),
  full_address: z.string().optional(),
  property_type: z.string().optional(),
})

export const spaceCapacitySchema = z.object({
  square_meters: z
    .number()
    .or(z.string().transform(Number))
    .optional(),
  bedrooms: z
    .number()
    .or(z.string().transform(Number))
    .optional(),
  bathrooms: z
    .number()
    .or(z.string().transform(Number))
    .optional(),
  max_occupancy: z
    .number()
    .or(z.string().transform(Number))
    .optional(),
})

export const descriptionStorySchema = z.object({
  year_built: z.string().optional(),
  year_renovated: z.string().optional(),
  description: z.string().optional(),
})

export const visualImpressionSchema = z.object({
  primary_photo: z.string().optional(),
  floor_plan: z.string().optional(),
})

// Safety & Security Schemas
export const smokeDetectorSchema = z.object({
  location: z.string().optional(),
  expiry_date: z.string().optional(),
})

export const fireEmergencySchema = z.object({
  smoke_detectors: z.array(smokeDetectorSchema).optional(),
  fire_extinguisher_location: z.string().optional(),
  fire_extinguisher_expiry: z.string().optional(),
  emergency_exit_plan: z.boolean().optional(),
  first_aid_location: z.string().optional(),
})

export const accessSecuritySchema = z.object({
  door_lock_type: z.string().optional(),
  smart_lock_code: z.string().optional(),
  building_security: z.string().optional(),
  cctv_coverage: z.array(z.string()).optional(),
})

export const safetyFeaturesSchema = z.object({
  emergency_contacts: z.string().optional(),
  window_security: z.string().optional(),
  balcony_safety: z.string().optional(),
  child_safety_features: z.array(z.string()).optional(),
})

// Kitchen & Dining Schemas
export const cookingEssentialsSchema = z.object({
  major_appliances: z.array(z.string()).optional(),
  small_appliances: z.array(z.string()).optional(),
  cookware_inventory: z.string().optional(),
  dishware_count: z.string().optional(),
  dining_capacity: z
    .number()
    .or(z.string().transform(Number))
    .optional(),
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
  kitchen_photos: z.array(z.string()).optional(),
})

// Bedrooms & Bathrooms Schemas
export const roomConfigSchema = z.object({
  name: z.string().optional(),
  size: z.string().optional(),
  type: z.string().optional(),
})

export const sleepSanctuarySchema = z.object({
  bed_configurations: z.array(roomConfigSchema).optional(),
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
  shower_bath_config: z.string().optional(),
  towel_details: z.string().optional(),
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
  wifi_network: z.string().optional(),
  wifi_password: z.string().optional(),
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
  type: z.string().optional(),
  name: z.string().optional(),
  distance: z.union([z.string(), z.number()]).optional(),
  walkTime: z.union([z.string(), z.number()]).optional(),
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
