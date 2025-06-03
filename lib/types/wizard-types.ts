export type WizardStep = {
  id: string
  title: string
  subtitle?: string
  emoji?: string
  category: string
  isCompleted?: boolean
  isActive?: boolean
  fields?: number
}

export type WizardCategory = {
  id: string
  title: string
  emoji: string
  steps: WizardStep[]
  isCompleted?: boolean
  isActive?: boolean
}

export type WizardFormData = {
  // Metadata
  id?: string
  user_id?: string
  status?: "active" | "maintenance" | "inactive" | "pending"
  revenue_band?: "budget" | "mid-range" | "luxury" | "ultra-luxury"
  created_at?: string
  updated_at?: string
  
  // Basic Information
  property_reference?: string
  building_name?: string
  unit_number?: string
  full_address?: string
  property_type?: string
  square_meters?: number
  bedrooms?: number
  bathrooms?: number
  max_occupancy?: number
  year_built?: string
  year_renovated?: string
  description?: string
  primary_photo?: string
  floor_plan?: string

  // Safety & Security
  smoke_detectors?: { location: string; expiry_date?: string }[]
  fire_extinguisher_location?: string
  fire_extinguisher_expiry?: string
  emergency_exit_plan?: boolean
  first_aid_location?: string
  door_lock_type?: string
  smart_lock_code?: string
  building_security?: string
  cctv_coverage?: string[]
  emergency_contacts?: string
  window_security?: string
  balcony_safety?: string
  child_safety_features?: string[]

  // Kitchen & Dining
  major_appliances?: string[]
  small_appliances?: string[]
  cookware_inventory?: string
  dishware_count?: string
  dining_capacity?: number
  water_filtration?: string
  coffee_tea_facilities?: string
  special_features?: string
  waste_disposal?: string
  pantry_staples?: string[]
  counter_material?: string
  kitchen_photos?: string[]

  // Add all the other properties for categorywise fields here
  // Extended properties for forms - needed for TypeScript validation
  bed_configurations?: any[]
  extra_bedding_location?: string
  mattress_type?: string
  pillow_details?: string
  closet_details?: string
  blackout_curtains?: string
  bedroom_electronics?: any[]
  furniture_inventory?: string
  bedroom_amenities?: any[]
  
  shower_bath_config?: string
  towel_details?: string
  toiletries_provided?: any[]
  hair_dryer_available?: boolean
  hair_dryer_details?: string
  water_pressure?: string
  hot_water_system?: string
  ventilation?: string
  bathroom_special_features?: any[]
  bathroom_accessibility_features?: any[]
  
  wifi_network?: string
  wifi_password?: string
  internet_speed?: string
  smart_home_features?: any[]
  router_location?: string
  tv_details?: string
  streaming_services?: string
  speaker_systems?: string
  remote_controls?: any[]
  charging_stations?: string
  backup_solutions?: string
  
  washer_details?: string
  dryer_details?: string
  detergent_provided?: string
  iron_board_available?: boolean
  drying_rack_location?: string
  laundry_basket_available?: boolean
  building_laundry_info?: string
  vacuum_details?: string
  cleaning_supplies?: any[]
  cleaning_schedule?: string
  special_instructions?: string
  stain_removal_kit?: string
  ac_units_details?: string
  heating_system?: string
  thermostat_instructions?: string
  ventilation_systems?: string
  air_purifiers?: string
  electrical_panel_location?: string
  
  public_transport?: string
  nearby_locations?: any[]
  walking_score?: string
  neighborhood_description?: string
  restaurants?: any[]
  grocery_shopping?: string
  tourist_attractions?: any[]
  emergency_services?: string
  local_tips?: string
  weather_patterns?: string
  safety_assessment?: string
  
  step_free_access?: boolean
  elevator_accessibility?: string
  doorway_widths?: string
  bathroom_features?: any[]
  kitchen_height?: string
  visual_features?: any[]
  auditory_features?: any[]
  energy_rating?: string
  renewable_features?: string
  recycling_instructions?: string
  efficient_appliances?: any[]
  water_conservation?: any[]
  eco_products?: any[]
  sustainable_materials?: string
}

export type WizardContextType = {
  formData: WizardFormData
  updateFormData: (data: Partial<WizardFormData>) => void
  categories: WizardCategory[]
  currentCategory: WizardCategory
  currentStep: WizardStep
  setCurrentStep: (stepId: string) => void
  nextStep: () => void
  prevStep: () => void
  isFirstStep: boolean
  isLastStep: boolean
  saveProgress: () => Promise<{ success: boolean; error?: unknown }>
  finishProperty: () => Promise<{ success: boolean; propertyId?: string; error?: unknown }>
  isLoading: boolean
  progress: number
  validateStep: (data: any) => boolean
  getFieldError: (fieldName: string) => string | undefined
  errors: Record<string, string>
  enableValidation: () => void
  validationEnabled: boolean
}
