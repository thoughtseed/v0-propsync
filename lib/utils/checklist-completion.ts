import type { WizardFormData } from "@/lib/types/wizard-types"

// Define required fields for each category
const requiredFields = {
  "basic-info": [
    "property_reference",
    "building_name",
    "unit_number",
    "full_address",
    "property_type",
    "bedrooms",
    "bathrooms",
    "max_occupancy",
    "description",
  ],
  "safety-security": [
    "fire_extinguisher_location",
    "first_aid_location",
    "door_lock_type",
    "building_security",
    "emergency_contacts",
  ],
  "kitchen-dining": ["major_appliances", "cookware_inventory", "dishware_count", "dining_capacity"],
  "bedrooms-bathrooms": ["bed_configurations", "shower_bath_config", "towel_details"],
  technology: ["wifi_network", "wifi_password"],
  "practical-living": ["washer_details", "dryer_details", "vacuum_details", "ac_units_details", "heating_system"],
  "location-lifestyle": ["public_transport", "neighborhood_description", "grocery_shopping", "emergency_services"],
  "accessibility-sustainability": ["step_free_access", "recycling_instructions"],
}

// Define optional fields for each category
const optionalFields = {
  "basic-info": ["square_meters", "year_built", "year_renovated", "primary_photo", "floor_plan"],
  "safety-security": [
    "smoke_detectors",
    "fire_extinguisher_expiry",
    "emergency_exit_plan",
    "smart_lock_code",
    "cctv_coverage",
    "window_security",
    "balcony_safety",
    "child_safety_features",
  ],
  // ... and so on for other categories
}

// Calculate completion percentage for a category
export function calculateCategoryCompletion(formData: WizardFormData, categoryId: string): number {
  const required = requiredFields[categoryId as keyof typeof requiredFields] || []
  const optional = optionalFields[categoryId as keyof typeof optionalFields] || []

  // Count required fields that are filled
  const requiredFilled = required.filter((field) => {
    const value = formData[field as keyof WizardFormData]
    return value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)
  }).length

  // Count optional fields that are filled
  const optionalFilled = optional.filter((field) => {
    const value = formData[field as keyof WizardFormData]
    return value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)
  }).length

  // Calculate weighted completion percentage
  // Required fields count more toward completion
  const requiredWeight = 0.7
  const optionalWeight = 0.3

  const requiredCompletion = required.length > 0 ? (requiredFilled / required.length) * requiredWeight : 0

  const optionalCompletion = optional.length > 0 ? (optionalFilled / optional.length) * optionalWeight : 0

  return Math.round((requiredCompletion + optionalCompletion) * 100)
}

// Calculate overall completion percentage
export function calculateOverallCompletion(formData: WizardFormData): number {
  const categories = [
    "basic-info",
    "safety-security",
    "kitchen-dining",
    "bedrooms-bathrooms",
    "technology",
    "practical-living",
    "location-lifestyle",
    "accessibility-sustainability",
  ]

  const completionValues = categories.map((category) => calculateCategoryCompletion(formData, category))

  // Average of all category completion percentages
  const sum = completionValues.reduce((acc, val) => acc + val, 0)
  return Math.round(sum / categories.length)
}
