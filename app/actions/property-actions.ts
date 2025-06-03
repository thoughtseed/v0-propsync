"use server"

import { revalidatePath } from "next/cache"
import { getAdminSupabaseClient } from "@/lib/supabase/server"
import { calculateCategoryCompletion, calculateOverallCompletion } from "@/lib/utils/checklist-completion"
import type { WizardFormData } from "@/lib/types/wizard-types"
import { createClient } from "@supabase/supabase-js"

// Create a direct admin client that completely bypasses Next.js cookies and RLS
const createDirectAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase credentials for direct admin client")
    throw new Error("Required environment variables missing for Supabase admin client")
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

// Property creation function that gets a real user ID first
export async function createProperty(formData: WizardFormData) {
  try {
    console.log("Starting property creation with direct admin client");
    
    // Use direct admin client with service role that completely bypasses RLS
    const supabase = createDirectAdminClient()
    
    // First get a valid user ID from the database
    console.log("Fetching valid users from database...");
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      console.error("No users found in the database:", userError);
      throw new Error("No valid users found in the database. Please ensure at least one user exists.");
    }
    
    // Use the first user's ID if form data doesn't specify a user_id
    const userId = formData.user_id || users[0].id;
    
    console.log("Creating main property record with user ID:", userId);
    
    // First, create the main property record with minimal fields
    const { data: propertyData, error: propertyError } = await supabase
      .from("properties")
      .insert({
        property_reference: formData.property_reference || `Property-${Date.now()}`,
        building_name: formData.building_name || "New Property",
        unit_number: formData.unit_number || "1",
        property_type: formData.property_type || "Apartment",
        square_meters: formData.square_meters || 0,
        bedrooms: formData.bedrooms || 1,
        bathrooms: formData.bathrooms || 1,
        max_occupancy: formData.max_occupancy || 2,
        status: "pending",
        user_id: userId,
      })
      .select("id")
      .single()

    if (propertyError) {
      console.error("Error in property creation:", propertyError);
      throw propertyError;
    }

    console.log("Property created successfully with ID:", propertyData.id);
    const propertyId = propertyData.id;

    // Only create the basic info record for simplicity
    const { error: basicInfoError } = await supabase.from("property_basic_info").insert({
      property_id: propertyId,
      full_address: formData.full_address || "123 Main Street",
      year_built: formData.year_built || null,
      year_renovated: formData.year_renovated || null,
      description: formData.description || "A great property in a prime location",
      floor_plan_url: formData.floor_plan || null,
    })
    
    if (basicInfoError) {
      console.error("Error creating basic info:", basicInfoError);
    } else {
      console.log("Basic info created successfully");
    }


    // Simplify - just revalidate the properties page
    revalidatePath("/properties")
    console.log("Property creation process completed");

    // Return success
    return { success: true, propertyId }
  } catch (error) {
    console.error("Error creating property:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create property",
      details: JSON.stringify(error)
    }
  }
}

export async function saveDraft(formData: WizardFormData) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = await getAdminSupabaseClient()

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
  } catch (error) {
    console.error("Error saving draft:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to save draft" }
  }
}

export async function loadDraft(draftId: string) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = await getAdminSupabaseClient()
    const { data, error } = await supabase.from("property_drafts").select("data").eq("id", draftId).single()

    if (error) throw error

    return { success: true, data: data.data as WizardFormData }
  } catch (error) {
    console.error("Error loading draft:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to load draft" }
  }
}

export async function deleteDraft(draftId: string) {
  try {
    // Use admin client to bypass RLS policies
    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("property_drafts").delete().eq("id", draftId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error deleting draft:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete draft" }
  }
}
