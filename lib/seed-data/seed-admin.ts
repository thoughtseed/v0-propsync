import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/supabase"

/**
 * Seeds the database with an initial admin user
 * This function is meant to be called programmatically, not from the UI
 */
export async function seedAdminUser() {
  try {
    // Create a Supabase client with admin privileges
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Check if the admin user already exists
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("role", "admin")
      .limit(1)

    if (checkError) {
      console.error("Error checking for existing admin:", checkError)
      return { success: false, error: "Failed to check for existing admin" }
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log("Admin user already exists")
      return { success: true, message: "Admin user already exists" }
    }

    // Create the admin user
    const adminEmail = "admin@coproperties.com"
    const adminPassword = "Admin123!" // This should be changed after first login
    const adminName = "System Administrator"

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName,
      },
    })

    if (authError) {
      console.error("Error creating admin user:", authError)
      return { success: false, error: "Failed to create admin user" }
    }

    // Update the user's role in the users table
    if (authData.user) {
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          role: "admin",
        })
        .eq("id", authData.user.id)

      if (updateError) {
        console.error("Error updating admin role:", updateError)
        return { success: false, error: "Failed to set admin role" }
      }
    }

    console.log("Admin user created successfully")
    return {
      success: true,
      message: "Admin user created successfully",
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
    }
  } catch (error) {
    console.error("Unexpected error during admin seeding:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
