import { Property, User, ChecklistItem, ChecklistCompletion } from "@/lib/types"

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: Property
        Insert: Omit<Property, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Property, "id" | "created_at" | "updated_at">>
      }
      users: {
        Row: User
        Insert: Omit<User, "id">
        Update: Partial<Omit<User, "id">>
      }
      checklist_items: {
        Row: ChecklistItem
        Insert: Omit<ChecklistItem, "id" | "updated_at">
        Update: Partial<Omit<ChecklistItem, "id" | "updated_at">>
      }
      checklist_completion: {
        Row: ChecklistCompletion & { property_id: string }
        Insert: ChecklistCompletion & { property_id: string }
        Update: Partial<ChecklistCompletion>
      }
      property_basic_info: {
        Row: {
          id: string
          property_id: string
          full_address: string
          year_built: string | null
          year_renovated: string | null
          description: string
          floor_plan_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_basic_info"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_basic_info"]["Row"], "id" | "created_at" | "updated_at">>
      }
      property_safety: {
        Row: {
          id: string
          property_id: string
          smoke_detectors: string[]
          fire_extinguisher_location: string | null
          fire_extinguisher_expiry: string | null
          emergency_exit_plan: string | null
          first_aid_location: string | null
          door_lock_type: string | null
          smart_lock_code: string | null
          building_security: string | null
          cctv_coverage: string[]
          emergency_contacts: string | null
          window_security: string | null
          balcony_safety: string | null
          child_safety_features: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_safety"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_safety"]["Row"], "id" | "created_at" | "updated_at">>
      }
      property_kitchen: {
        Row: {
          id: string
          property_id: string
          major_appliances: string[]
          small_appliances: string[]
          cookware_inventory: string | null
          dishware_count: number | null
          dining_capacity: number | null
          water_filtration: string | null
          coffee_tea_facilities: string | null
          special_features: string | null
          waste_disposal: string | null
          pantry_staples: string[]
          counter_material: string | null
          kitchen_photos: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_kitchen"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_kitchen"]["Row"], "id" | "created_at" | "updated_at">>
      }
      property_bedrooms: {
        Row: {
          id: string
          property_id: string
          bed_configurations: string[]
          extra_bedding_location: string | null
          mattress_type: string | null
          pillow_details: string | null
          closet_details: string | null
          blackout_curtains: boolean | null
          bedroom_electronics: string[]
          furniture_inventory: string | null
          bedroom_amenities: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_bedrooms"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_bedrooms"]["Row"], "id" | "created_at" | "updated_at">>
      }
      property_bathrooms: {
        Row: {
          id: string
          property_id: string
          shower_bath_config: string | null
          towel_details: string | null
          toiletries_provided: string[]
          hair_dryer_available: boolean | null
          hair_dryer_details: string | null
          water_pressure: string | null
          hot_water_system: string | null
          ventilation: string | null
          bathroom_special_features: string[]
          bathroom_accessibility_features: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_bathrooms"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_bathrooms"]["Row"], "id" | "created_at" | "updated_at">>
      }
      property_technology: {
        Row: {
          id: string
          property_id: string
          wifi_network: string | null
          wifi_password: string | null
          internet_speed: string | null
          smart_home_features: string[]
          router_location: string | null
          tv_details: string | null
          streaming_services: string | null
          speaker_systems: string | null
          remote_controls: string[]
          charging_stations: string | null
          backup_solutions: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_technology"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_technology"]["Row"], "id" | "created_at" | "updated_at">>
      }
      property_practical: {
        Row: {
          id: string
          property_id: string
          washer_details: string | null
          dryer_details: string | null
          detergent_provided: boolean | null
          iron_board_available: boolean | null
          drying_rack_location: string | null
          laundry_basket_available: boolean | null
          building_laundry_info: string | null
          vacuum_details: string | null
          cleaning_supplies: string[]
          cleaning_schedule: string | null
          special_instructions: string | null
          stain_removal_kit: boolean | null
          ac_units_details: string | null
          heating_system: string | null
          thermostat_instructions: string | null
          ventilation_systems: string | null
          air_purifiers: string | null
          electrical_panel_location: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_practical"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_practical"]["Row"], "id" | "created_at" | "updated_at">>
      }
      property_location: {
        Row: {
          id: string
          property_id: string
          neighborhood_info: string | null
          public_transport: string | null
          parking_info: string | null
          nearby_amenities: string[]
          local_attractions: string[]
          emergency_services: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_location"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_location"]["Row"], "id" | "created_at" | "updated_at">>
      }
      property_accessibility: {
        Row: {
          id: string
          property_id: string
          wheelchair_accessible: boolean | null
          step_free_access: boolean | null
          accessible_bathroom: boolean | null
          grab_rails: boolean | null
          wide_doorways: boolean | null
          accessible_parking: boolean | null
          elevator_access: boolean | null
          accessibility_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_accessibility"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_accessibility"]["Row"], "id" | "created_at" | "updated_at">>
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          type: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["property_images"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Database["public"]["Tables"]["property_images"]["Row"], "id" | "created_at" | "updated_at">>
      }
    }
  }
}