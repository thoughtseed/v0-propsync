"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient, getUserRole } from "@/lib/supabase/client"
import { canViewSensitiveFields } from "@/lib/security/sensitive-fields"
import type { WizardFormData } from "@/lib/types/wizard-types"

export function usePropertyWizard() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>("readonly")
  const [canViewSensitive, setCanViewSensitive] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole()
      setUserRole(role)
      setCanViewSensitive(canViewSensitiveFields(role))
    }

    fetchUserRole()
  }, [])

  // Save draft property
  const saveDraft = async (formData: WizardFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // First, check if we have a draft ID already
      const draftId = formData.id

      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from("property_drafts")
          .update({
            data: formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", draftId)

        if (error) throw error

        return { success: true, id: draftId }
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from("property_drafts")
          .insert({
            user_id: user.id,
            data: formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select("id")
          .single()

        if (error) throw error

        return { success: true, id: data.id }
      }
    } catch (err) {
      console.error("Error saving draft:", err)
      setError(err instanceof Error ? err.message : "Failed to save draft")
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Submit property (create actual property from draft)
  const submitProperty = async (formData: WizardFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // First, create the main property record
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .insert({
          property_reference: formData.property_reference || "",
          building_name: formData.building_name || "",
          unit_number: formData.unit_number || "",
          property_type: formData.property_type || "",
          square_meters: formData.square_meters || 0,
          bedrooms: formData.bedrooms || 0,
          bathrooms: formData.bathrooms || 0,
          max_occupancy: formData.max_occupancy || 0,
          status: "pending",
          user_id: user.id,
        })
        .select("id")
        .single()

      if (propertyError) throw propertyError

      const propertyId = propertyData.id

      // Now create records in each category table
      // Basic Info
      await supabase.from("property_basic_info").insert({
        property_id: propertyId,
        full_address: formData.full_address || "",
        year_built: formData.year_built || null,
        year_renovated: formData.year_renovated || null,
        description: formData.description || "",
        floor_plan_url: formData.floor_plan || null,
      })

      // Safety & Security
      await supabase.from("property_safety").insert({
        property_id: propertyId,
        smoke_detectors: formData.smoke_detectors || [],
        fire_extinguisher_location: formData.fire_extinguisher_location || null,
        fire_extinguisher_expiry: formData.fire_extinguisher_expiry || null,
        emergency_exit_plan: formData.emergency_exit_plan || null,
        first_aid_location: formData.first_aid_location || null,
        door_lock_type: formData.door_lock_type || null,
        smart_lock_code: formData.smart_lock_code || null,
        building_security: formData.building_security || null,
        cctv_coverage: formData.cctv_coverage || [],
        emergency_contacts: formData.emergency_contacts || null,
        window_security: formData.window_security || null,
        balcony_safety: formData.balcony_safety || null,
        child_safety_features: formData.child_safety_features || [],
      })

      // Kitchen & Dining
      await supabase.from("property_kitchen").insert({
        property_id: propertyId,
        major_appliances: formData.major_appliances || [],
        small_appliances: formData.small_appliances || [],
        cookware_inventory: formData.cookware_inventory || null,
        dishware_count: formData.dishware_count || null,
        dining_capacity: formData.dining_capacity || null,
        water_filtration: formData.water_filtration || null,
        coffee_tea_facilities: formData.coffee_tea_facilities || null,
        special_features: formData.special_features || null,
        waste_disposal: formData.waste_disposal || null,
        pantry_staples: formData.pantry_staples || [],
        counter_material: formData.counter_material || null,
        kitchen_photos: formData.kitchen_photos || [],
      })

      // Technology (with sensitive data)
      await supabase.from("property_technology").insert({
        property_id: propertyId,
        wifi_network: formData.wifi_network || null,
        wifi_password: formData.wifi_password || null,
        internet_speed: formData.internet_speed || null,
        smart_home_features: formData.smart_home_features || [],
        router_location: formData.router_location || null,
        tv_details: formData.tv_details || null,
        streaming_services: formData.streaming_services || null,
        speaker_systems: formData.speaker_systems || null,
        remote_controls: formData.remote_controls || [],
        charging_stations: formData.charging_stations || null,
        backup_solutions: formData.backup_solutions || null,
      })

      // Add primary photo to property_images
      if (formData.primary_photo) {
        await supabase.from("property_images").insert({
          property_id: propertyId,
          url: formData.primary_photo,
          type: "main",
          display_order: 0,
        })
      }

      // Initialize checklist completion
      await supabase.from("checklist_completion").insert({
        property_id: propertyId,
        basic_information: calculateCategoryCompletion(formData, "basic-info"),
        safety_security: calculateCategoryCompletion(formData, "safety-security"),
        kitchen_dining: calculateCategoryCompletion(formData, "kitchen-dining"),
        bedrooms: calculateCategoryCompletion(formData, "bedrooms-bathrooms"),
        bathrooms: calculateCategoryCompletion(formData, "bedrooms-bathrooms"),
        technology: calculateCategoryCompletion(formData, "technology"),
        practical_living: calculateCategoryCompletion(formData, "practical-living"),
        location_lifestyle: calculateCategoryCompletion(formData, "location-lifestyle"),
        accessibility_sustainability: calculateCategoryCompletion(formData, "accessibility-sustainability"),
        overall: calculateOverallCompletion(formData),
      })

      // Delete the draft if it exists
      if (formData.id) {
        await supabase.from("property_drafts").delete().eq("id", formData.id)
      }

      return { success: true, propertyId }
    } catch (err) {
      console.error("Error submitting property:", err)
      setError(err instanceof Error ? err.message : "Failed to submit property")
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Load draft property
  const loadDraft = async (draftId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.from("property_drafts").select("data").eq("id", draftId).single()

      if (error) throw error

      return { success: true, data: data.data as WizardFormData }
    } catch (err) {
      console.error("Error loading draft:", err)
      setError(err instanceof Error ? err.message : "Failed to load draft")
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to calculate category completion percentage
  const calculateCategoryCompletion = (formData: WizardFormData, categoryId: string): number => {
    // Implementation would depend on your specific field requirements
    // This is a simplified example
    return 0 // Replace with actual calculation
  }

  // Helper function to calculate overall completion percentage
  const calculateOverallCompletion = (formData: WizardFormData): number => {
    // Implementation would depend on your specific field requirements
    // This is a simplified example
    return 0 // Replace with actual calculation
  }

  return {
    saveDraft,
    submitProperty,
    loadDraft,
    isLoading,
    error,
    userRole,
    canViewSensitive,
  }
}
