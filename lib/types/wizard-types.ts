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

  // And so on for other categories...

  // Metadata
  status?: "active" | "maintenance" | "inactive" | "pending"
  revenue_band?: "budget" | "mid-range" | "luxury" | "ultra-luxury"
  created_at?: string
  updated_at?: string
  id?: string
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
  saveProgress: () => Promise<void>
  isLoading: boolean
  progress: number
  validateStep: (data: any) => boolean
  getFieldError: (fieldName: string) => string | undefined
  errors: Record<string, string>
  enableValidation: () => void
  validationEnabled: boolean
}
