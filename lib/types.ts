export interface Property {
  id: string
  created_at: string
  updated_at: string

  // Basic Information
  property_reference: string
  building_name: string
  unit_number: string
  full_address: string
  property_type: string
  square_meters: number
  bedrooms: number
  bathrooms: number
  max_occupancy: number
  primary_photo: string
  floor_plan?: string
  year_built: string
  description: string

  // Status and Performance
  status: "active" | "maintenance" | "inactive"
  occupancy_rate: number
  avg_rating: number
  revenue_band: "budget" | "mid-range" | "luxury" | "ultra-luxury"

  // Checklist completion tracking
  checklist_completion: ChecklistCompletion
}

export interface ChecklistCompletion {
  basic_information: number
  safety_security: number
  kitchen_dining: number
  bedrooms: number
  bathrooms: number
  technology: number
  laundry_cleaning: number
  outdoor_spaces: number
  building_amenities: number
  hvac_utilities: number
  local_information: number
  luxury_amenities: number
  accessibility: number
  sustainability: number
  maintenance: number
  administrative: number
  overall: number
}

export interface ChecklistItem {
  id: string
  property_id: string
  category: string
  field_name: string
  field_type: "text" | "textarea" | "number" | "select" | "multiselect" | "checkbox" | "file"
  value: any
  is_completed: boolean
  is_required: boolean
  notes?: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  role: "admin" | "manager" | "staff" | "readonly"
  full_name: string
}
