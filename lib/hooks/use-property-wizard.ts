"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { WizardFormData } from "@/lib/types/wizard-types"
import type { Database } from "@/lib/types/supabase"

export function usePropertyWizard() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  // Save draft property
  const saveDraft = async (formData: WizardFormData) => {
    setIsLoading(true)
    setError(null)

    try {
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
      // First, create the main property record
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .insert({
          property_reference: formData.property_reference,
          building_name: formData.building_name,
          unit_number: formData.unit_number,
          property_type: formData.property_type,
          square_meters: formData.square_meters,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          max_occupancy: formData.max_occupancy,
          status: "pending",
        })
        .select("id")
        .single()

      if (propertyError) throw propertyError

      const propertyId = propertyData.id

      // Now create records in each category table
      // Basic Info
      await supabase.from("property_basic_info").insert({
        property_id: propertyId,
        full_address: formData.full_address,
        year_built: formData.year_built,
        year_renovated: formData.year_renovated,
        description: formData.description,
        floor_plan_url: formData.floor_plan,
      })

      // Safety & Security
      await supabase.from("property_safety").insert({
        property_id: propertyId,
        smoke_detectors: formData.smoke_detectors || [],
        fire_extinguisher_location: formData.fire_extinguisher_location,
        fire_extinguisher_expiry: formData.fire_extinguisher_expiry,
        emergency_exit_plan: formData.emergency_exit_plan,
        first_aid_location: formData.first_aid_location,
        door_lock_type: formData.door_lock_type,
        smart_lock_code: formData.smart_lock_code,
        building_security: formData.building_security,
        cctv_coverage: formData.cctv_coverage || [],
        emergency_contacts: formData.emergency_contacts,
        window_security: formData.window_security,
        balcony_safety: formData.balcony_safety,
        child_safety_features: formData.child_safety_features || [],
      })

      // Kitchen & Dining
      await supabase.from("property_kitchen").insert({
        property_id: propertyId,
        major_appliances: formData.major_appliances || [],
        small_appliances: formData.small_appliances || [],
        cookware_inventory: formData.cookware_inventory,
        dishware_count: formData.dishware_count,
        dining_capacity: formData.dining_capacity,
        water_filtration: formData.water_filtration,
        coffee_tea_facilities: formData.coffee_tea_facilities,
        special_features: formData.special_features,
        waste_disposal: formData.waste_disposal,
        pantry_staples: formData.pantry_staples || [],
        counter_material: formData.counter_material,
        kitchen_photos: formData.kitchen_photos || [],
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

  return {
    saveDraft,
    submitProperty,
    loadDraft,
    isLoading,
    error,
  }
}
