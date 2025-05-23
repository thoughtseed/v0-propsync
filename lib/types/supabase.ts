export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          property_reference: string
          building_name: string
          unit_number: string
          property_type: string
          square_meters: number
          bedrooms: number
          bathrooms: number
          max_occupancy: number
          status: "active" | "maintenance" | "inactive" | "pending"
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          property_reference: string
          building_name: string
          unit_number: string
          property_type: string
          square_meters?: number
          bedrooms: number
          bathrooms: number
          max_occupancy: number
          status?: "active" | "maintenance" | "inactive" | "pending"
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          property_reference?: string
          building_name?: string
          unit_number?: string
          property_type?: string
          square_meters?: number
          bedrooms?: number
          bathrooms?: number
          max_occupancy?: number
          status?: "active" | "maintenance" | "inactive" | "pending"
          user_id?: string
        }
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
        Insert: {
          id?: string
          property_id: string
          full_address: string
          year_built?: string | null
          year_renovated?: string | null
          description: string
          floor_plan_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          full_address?: string
          year_built?: string | null
          year_renovated?: string | null
          description?: string
          floor_plan_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_safety: {
        Row: {
          id: string
          property_id: string
          smoke_detectors: Json[]
          fire_extinguisher_location: string | null
          fire_extinguisher_expiry: string | null
          emergency_exit_plan: boolean | null
          first_aid_location: string | null
          door_lock_type: string | null
          smart_lock_code: string | null
          building_security: string | null
          cctv_coverage: string[] | null
          emergency_contacts: string | null
          window_security: string | null
          balcony_safety: string | null
          child_safety_features: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          smoke_detectors?: Json[]
          fire_extinguisher_location?: string | null
          fire_extinguisher_expiry?: string | null
          emergency_exit_plan?: boolean | null
          first_aid_location?: string | null
          door_lock_type?: string | null
          smart_lock_code?: string | null
          building_security?: string | null
          cctv_coverage?: string[] | null
          emergency_contacts?: string | null
          window_security?: string | null
          balcony_safety?: string | null
          child_safety_features?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          smoke_detectors?: Json[]
          fire_extinguisher_location?: string | null
          fire_extinguisher_expiry?: string | null
          emergency_exit_plan?: boolean | null
          first_aid_location?: string | null
          door_lock_type?: string | null
          smart_lock_code?: string | null
          building_security?: string | null
          cctv_coverage?: string[] | null
          emergency_contacts?: string | null
          window_security?: string | null
          balcony_safety?: string | null
          child_safety_features?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      property_kitchen: {
        Row: {
          id: string
          property_id: string
          major_appliances: string[] | null
          small_appliances: string[] | null
          cookware_inventory: string | null
          dishware_count: string | null
          dining_capacity: number | null
          water_filtration: string | null
          coffee_tea_facilities: string | null
          special_features: string | null
          waste_disposal: string | null
          pantry_staples: string[] | null
          counter_material: string | null
          kitchen_photos: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          major_appliances?: string[] | null
          small_appliances?: string[] | null
          cookware_inventory?: string | null
          dishware_count?: string | null
          dining_capacity?: number | null
          water_filtration?: string | null
          coffee_tea_facilities?: string | null
          special_features?: string | null
          waste_disposal?: string | null
          pantry_staples?: string[] | null
          counter_material?: string | null
          kitchen_photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          major_appliances?: string[] | null
          small_appliances?: string[] | null
          cookware_inventory?: string | null
          dishware_count?: string | null
          dining_capacity?: number | null
          water_filtration?: string | null
          coffee_tea_facilities?: string | null
          special_features?: string | null
          waste_disposal?: string | null
          pantry_staples?: string[] | null
          counter_material?: string | null
          kitchen_photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      property_bedrooms: {
        Row: {
          id: string
          property_id: string
          bed_configurations: Json[]
          extra_bedding_location: string | null
          mattress_type: string | null
          pillow_details: string | null
          closet_details: string | null
          blackout_curtains: boolean | null
          bedroom_electronics: string[] | null
          furniture_inventory: string | null
          bedroom_amenities: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          bed_configurations?: Json[]
          extra_bedding_location?: string | null
          mattress_type?: string | null
          pillow_details?: string | null
          closet_details?: string | null
          blackout_curtains?: boolean | null
          bedroom_electronics?: string[] | null
          furniture_inventory?: string | null
          bedroom_amenities?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          bed_configurations?: Json[]
          extra_bedding_location?: string | null
          mattress_type?: string | null
          pillow_details?: string | null
          closet_details?: string | null
          blackout_curtains?: boolean | null
          bedroom_electronics?: string[] | null
          furniture_inventory?: string | null
          bedroom_amenities?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      property_bathrooms: {
        Row: {
          id: string
          property_id: string
          shower_bath_config: string | null
          towel_details: string | null
          toiletries_provided: string[] | null
          hair_dryer_available: boolean | null
          hair_dryer_details: string | null
          water_pressure: string | null
          hot_water_system: string | null
          ventilation: string | null
          bathroom_special_features: string[] | null
          bathroom_accessibility_features: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          shower_bath_config?: string | null
          towel_details?: string | null
          toiletries_provided?: string[] | null
          hair_dryer_available?: boolean | null
          hair_dryer_details?: string | null
          water_pressure?: string | null
          hot_water_system?: string | null
          ventilation?: string | null
          bathroom_special_features?: string[] | null
          bathroom_accessibility_features?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          shower_bath_config?: string | null
          towel_details?: string | null
          toiletries_provided?: string[] | null
          hair_dryer_available?: boolean | null
          hair_dryer_details?: string | null
          water_pressure?: string | null
          hot_water_system?: string | null
          ventilation?: string | null
          bathroom_special_features?: string[] | null
          bathroom_accessibility_features?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      property_technology: {
        Row: {
          id: string
          property_id: string
          wifi_network: string | null
          wifi_password: string | null
          internet_speed: string | null
          smart_home_features: string[] | null
          router_location: string | null
          tv_details: string | null
          streaming_services: string | null
          speaker_systems: string | null
          remote_controls: string[] | null
          charging_stations: string | null
          backup_solutions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          wifi_network?: string | null
          wifi_password?: string | null
          internet_speed?: string | null
          smart_home_features?: string[] | null
          router_location?: string | null
          tv_details?: string | null
          streaming_services?: string | null
          speaker_systems?: string | null
          remote_controls?: string[] | null
          charging_stations?: string | null
          backup_solutions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          wifi_network?: string | null
          wifi_password?: string | null
          internet_speed?: string | null
          smart_home_features?: string[] | null
          router_location?: string | null
          tv_details?: string | null
          streaming_services?: string | null
          speaker_systems?: string | null
          remote_controls?: string[] | null
          charging_stations?: string | null
          backup_solutions?: string | null
          created_at?: string
          updated_at?: string
        }
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
          cleaning_supplies: string[] | null
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
        Insert: {
          id?: string
          property_id: string
          washer_details?: string | null
          dryer_details?: string | null
          detergent_provided?: boolean | null
          iron_board_available?: boolean | null
          drying_rack_location?: string | null
          laundry_basket_available?: boolean | null
          building_laundry_info?: string | null
          vacuum_details?: string | null
          cleaning_supplies?: string[] | null
          cleaning_schedule?: string | null
          special_instructions?: string | null
          stain_removal_kit?: boolean | null
          ac_units_details?: string | null
          heating_system?: string | null
          thermostat_instructions?: string | null
          ventilation_systems?: string | null
          air_purifiers?: string | null
          electrical_panel_location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          washer_details?: string | null
          dryer_details?: string | null
          detergent_provided?: boolean | null
          iron_board_available?: boolean | null
          drying_rack_location?: string | null
          laundry_basket_available?: boolean | null
          building_laundry_info?: string | null
          vacuum_details?: string | null
          cleaning_supplies?: string[] | null
          cleaning_schedule?: string | null
          special_instructions?: string | null
          stain_removal_kit?: boolean | null
          ac_units_details?: string | null
          heating_system?: string | null
          thermostat_instructions?: string | null
          ventilation_systems?: string | null
          air_purifiers?: string | null
          electrical_panel_location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_location: {
        Row: {
          id: string
          property_id: string
          public_transport: string | null
          nearby_locations: Json[] | null
          walking_score: string | null
          neighborhood_description: string | null
          restaurants: string[] | null
          grocery_shopping: string | null
          tourist_attractions: string[] | null
          emergency_services: string | null
          local_tips: string | null
          weather_patterns: string | null
          safety_assessment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          public_transport?: string | null
          nearby_locations?: Json[] | null
          walking_score?: string | null
          neighborhood_description?: string | null
          restaurants?: string[] | null
          grocery_shopping?: string | null
          tourist_attractions?: string[] | null
          emergency_services?: string | null
          local_tips?: string | null
          weather_patterns?: string | null
          safety_assessment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          public_transport?: string | null
          nearby_locations?: Json[] | null
          walking_score?: string | null
          neighborhood_description?: string | null
          restaurants?: string[] | null
          grocery_shopping?: string | null
          tourist_attractions?: string[] | null
          emergency_services?: string | null
          local_tips?: string | null
          weather_patterns?: string | null
          safety_assessment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_accessibility: {
        Row: {
          id: string
          property_id: string
          step_free_access: string | null
          elevator_accessibility: string | null
          doorway_widths: string | null
          bathroom_features: string[] | null
          kitchen_height: string | null
          visual_features: string[] | null
          auditory_features: string[] | null
          energy_rating: string | null
          renewable_features: string | null
          recycling_instructions: string | null
          efficient_appliances: string[] | null
          water_conservation: string[] | null
          eco_products: string[] | null
          sustainable_materials: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          step_free_access?: string | null
          elevator_accessibility?: string | null
          doorway_widths?: string | null
          bathroom_features?: string[] | null
          kitchen_height?: string | null
          visual_features?: string[] | null
          auditory_features?: string[] | null
          energy_rating?: string | null
          renewable_features?: string | null
          recycling_instructions?: string | null
          efficient_appliances?: string[] | null
          water_conservation?: string[] | null
          eco_products?: string[] | null
          sustainable_materials?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          step_free_access?: string | null
          elevator_accessibility?: string | null
          doorway_widths?: string | null
          bathroom_features?: string[] | null
          kitchen_height?: string | null
          visual_features?: string[] | null
          auditory_features?: string[] | null
          energy_rating?: string | null
          renewable_features?: string | null
          recycling_instructions?: string | null
          efficient_appliances?: string[] | null
          water_conservation?: string[] | null
          eco_products?: string[] | null
          sustainable_materials?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          type: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          type?: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          type?: string
          display_order?: number
          created_at?: string
        }
      }
      property_drafts: {
        Row: {
          id: string
          user_id: string
          data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      checklist_completion: {
        Row: {
          id: string
          property_id: string
          basic_information: number
          safety_security: number
          kitchen_dining: number
          bedrooms: number
          bathrooms: number
          technology: number
          practical_living: number
          location_lifestyle: number
          accessibility_sustainability: number
          overall: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          basic_information?: number
          safety_security?: number
          kitchen_dining?: number
          bedrooms?: number
          bathrooms?: number
          technology?: number
          practical_living?: number
          location_lifestyle?: number
          accessibility_sustainability?: number
          overall?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          basic_information?: number
          safety_security?: number
          kitchen_dining?: number
          bedrooms?: number
          bathrooms?: number
          technology?: number
          practical_living?: number
          location_lifestyle?: number
          accessibility_sustainability?: number
          overall?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: "admin" | "manager" | "staff" | "readonly"
          full_name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: "admin" | "manager" | "staff" | "readonly"
          full_name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "manager" | "staff" | "readonly"
          full_name?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
