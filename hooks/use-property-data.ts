"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient, getUserRole } from "@/lib/supabase/client"
import { sanitizePropertyData } from "@/lib/security/sensitive-fields"
import type { Database } from "@/lib/types/supabase"

type Property = Database["public"]["Tables"]["properties"]["Row"]
type PropertyWithDetails = Property & {
  basic_info?: Database["public"]["Tables"]["property_basic_info"]["Row"] | null
  safety?: Database["public"]["Tables"]["property_safety"]["Row"] | null
  kitchen?: Database["public"]["Tables"]["property_kitchen"]["Row"] | null
  bedrooms?: Database["public"]["Tables"]["property_bedrooms"]["Row"] | null
  bathrooms?: Database["public"]["Tables"]["property_bathrooms"]["Row"] | null
  technology?: Database["public"]["Tables"]["property_technology"]["Row"] | null
  practical?: Database["public"]["Tables"]["property_practical"]["Row"] | null
  location?: Database["public"]["Tables"]["property_location"]["Row"] | null
  accessibility?: Database["public"]["Tables"]["property_accessibility"]["Row"] | null
  images?: Database["public"]["Tables"]["property_images"]["Row"][]
  checklist_completion?: Database["public"]["Tables"]["checklist_completion"]["Row"] | null
}

export function usePropertyData(propertyId?: string) {
  const [property, setProperty] = useState<PropertyWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>("readonly")

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole()
      setUserRole(role)
    }

    fetchUserRole()
  }, [])

  useEffect(() => {
    if (!propertyId) {
      setIsLoading(false)
      return
    }

    const fetchProperty = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const supabase = getSupabaseClient()

        // Fetch the main property data
        const { data: propertyData, error: propertyError } = await supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .single()

        if (propertyError) throw propertyError

        // Fetch related data from other tables
        const [
          basicInfoResult,
          safetyResult,
          kitchenResult,
          bedroomsResult,
          bathroomsResult,
          technologyResult,
          practicalResult,
          locationResult,
          accessibilityResult,
          imagesResult,
          checklistResult,
        ] = await Promise.all([
          supabase.from("property_basic_info").select("*").eq("property_id", propertyId).single(),
          supabase.from("property_safety").select("*").eq("property_id", propertyId).single(),
          supabase.from("property_kitchen").select("*").eq("property_id", propertyId).single(),
          supabase.from("property_bedrooms").select("*").eq("property_id", propertyId).single(),
          supabase.from("property_bathrooms").select("*").eq("property_id", propertyId).single(),
          supabase.from("property_technology").select("*").eq("property_id", propertyId).single(),
          supabase.from("property_practical").select("*").eq("property_id", propertyId).single(),
          supabase.from("property_location").select("*").eq("property_id", propertyId).single(),
          supabase.from("property_accessibility").select("*").eq("property_id", propertyId).single(),
          supabase
            .from("property_images")
            .select("*")
            .eq("property_id", propertyId)
            .order("display_order", { ascending: true }),
          supabase.from("checklist_completion").select("*").eq("property_id", propertyId).single(),
        ])

        // Combine all data
        const propertyWithDetails: PropertyWithDetails = {
          ...propertyData,
          basic_info: basicInfoResult.data,
          safety: safetyResult.data,
          kitchen: kitchenResult.data,
          bedrooms: bedroomsResult.data,
          bathrooms: bathroomsResult.data,
          technology: technologyResult.data,
          practical: practicalResult.data,
          location: locationResult.data,
          accessibility: accessibilityResult.data,
          images: imagesResult.data || [],
          checklist_completion: checklistResult.data,
        }

        // Sanitize the data based on user role
        const sanitizedData = sanitizePropertyData(propertyWithDetails, userRole)
        setProperty(sanitizedData)
      } catch (err) {
        console.error("Error fetching property:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch property")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId, userRole])

  return { property, isLoading, error, userRole }
}
