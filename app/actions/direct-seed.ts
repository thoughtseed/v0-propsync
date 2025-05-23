"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import { sampleProperty } from "@/lib/seed-data/sample-property"
import type { Database } from "@/lib/types/supabase"

export async function directSeedSampleProperty() {
  try {
    // Create a direct client with service role key to bypass RLS
    const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Create a test user if needed
    const testUserId = "00000000-0000-0000-0000-000000000000"

    // Check if user exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("id", testUserId).single()

    if (!existingUser) {
      // Insert test user
      await supabase.from("users").insert({
        id: testUserId,
        email: "test@example.com",
        role: "admin",
        full_name: "Test User",
      })
    }

    // Insert property with direct SQL to bypass any RLS issues
    const { data: propertyData, error: propertyError } = await supabase.rpc("insert_sample_property", {
      p_reference: sampleProperty.property_reference,
      p_building: sampleProperty.building_name,
      p_unit: sampleProperty.unit_number,
      p_type: sampleProperty.property_type,
      p_sqm: sampleProperty.square_meters,
      p_beds: sampleProperty.bedrooms,
      p_baths: sampleProperty.bathrooms,
      p_occupancy: sampleProperty.max_occupancy,
      p_user_id: testUserId,
      p_description: sampleProperty.description,
      p_address: sampleProperty.full_address,
    })

    if (propertyError) {
      // If RPC doesn't exist, fall back to direct insert
      const { data, error } = await supabase
        .from("properties")
        .insert({
          property_reference: sampleProperty.property_reference,
          building_name: sampleProperty.building_name,
          unit_number: sampleProperty.unit_number,
          property_type: sampleProperty.property_type,
          square_meters: sampleProperty.square_meters,
          bedrooms: sampleProperty.bedrooms,
          bathrooms: sampleProperty.bathrooms,
          max_occupancy: sampleProperty.max_occupancy,
          status: "active",
          user_id: testUserId,
        })
        .select("id")
        .single()

      if (error) throw error

      // Continue with other inserts using the property ID
      // ...
    }

    // Revalidate the properties page
    revalidatePath("/properties")

    return { success: true }
  } catch (error) {
    console.error("Error with direct seeding:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to seed sample property" }
  }
}
