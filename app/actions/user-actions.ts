"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import { isCurrentUserAdmin, logAuthError } from "@/lib/utils/auth-utils"
import type { Database } from "@/lib/types/supabase"

type UserRole = "admin" | "manager" | "staff" | "readonly"

interface CreateUserData {
  email: string
  full_name: string
  role: UserRole
  password: string
}

interface UpdateUserData {
  full_name: string
  role: UserRole
}

/**
 * Create a new user (admin only)
 */
export async function createUser(userData: CreateUserData) {
  try {
    // MVP: Authorization check removed - single admin user has full access
    // For beta: restore authorization check with isCurrentUserAdmin()
    // const isAdmin = await isCurrentUserAdmin()
    // if (!isAdmin) {
    //   logAuthError('createUser', new Error('Unauthorized: Admin access required'))
    //   return {
    //     success: false,
    //     error: "Unauthorized: Admin access required"
    //   }
    // }

    // Create admin client with service role
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.full_name,
      },
    })

    if (authError) {
      console.error("[USER_CREATE] Auth error:", authError)
      return {
        success: false,
        error: authError.message
      }
    }

    // Update the user's role in the users table
    if (authData.user) {
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          role: userData.role,
        })
        .eq("id", authData.user.id)

      if (updateError) {
        console.error("[USER_CREATE] Role update error:", updateError)
        return {
          success: false,
          error: "Failed to set user role"
        }
      }
    }

    console.log(`[USER_CREATE] Successfully created user: ${userData.email}`)
    revalidatePath("/admin/users")
    
    return {
      success: true,
      data: authData.user
    }
  } catch (error) {
    console.error("[USER_CREATE] Unexpected error:", error)
    logAuthError('createUser', error)
    return {
      success: false,
      error: "An unexpected error occurred"
    }
  }
}

/**
 * Update an existing user (admin only)
 */
export async function updateUser(userId: string, userData: UpdateUserData) {
  try {
    // MVP: Authorization check removed - single admin user has full access
    // For beta: restore authorization check with isCurrentUserAdmin()
    // const isAdmin = await isCurrentUserAdmin()
    // if (!isAdmin) {
    //   logAuthError('updateUser', new Error('Unauthorized: Admin access required'))
    //   return {
    //     success: false,
    //     error: "Unauthorized: Admin access required"
    //   }
    // }

    // Create admin client with service role
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update the user's profile in the users table
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        full_name: userData.full_name,
        role: userData.role,
      })
      .eq("id", userId)

    if (updateError) {
      console.error("[USER_UPDATE] Update error:", updateError)
      return {
        success: false,
        error: updateError.message
      }
    }

    console.log(`[USER_UPDATE] Successfully updated user: ${userId}`)
    revalidatePath("/admin/users")
    
    return {
      success: true
    }
  } catch (error) {
    console.error("[USER_UPDATE] Unexpected error:", error)
    logAuthError('updateUser', error)
    return {
      success: false,
      error: "An unexpected error occurred"
    }
  }
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string) {
  try {
    // MVP: Authorization check removed - single admin user has full access
    // For beta: restore authorization check with isCurrentUserAdmin()
    // const isAdmin = await isCurrentUserAdmin()
    // if (!isAdmin) {
    //   logAuthError('deleteUser', new Error('Unauthorized: Admin access required'))
    //   return {
    //     success: false,
    //     error: "Unauthorized: Admin access required"
    //   }
    // }

    // Create admin client with service role
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Delete the user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("[USER_DELETE] Auth deletion error:", authError)
      return {
        success: false,
        error: authError.message
      }
    }

    console.log(`[USER_DELETE] Successfully deleted user: ${userId}`)
    revalidatePath("/admin/users")
    
    return {
      success: true
    }
  } catch (error) {
    console.error("[USER_DELETE] Unexpected error:", error)
    logAuthError('deleteUser', error)
    return {
      success: false,
      error: "An unexpected error occurred"
    }
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  try {
    // MVP: Authorization check removed - single admin user has full access
    // For beta: restore authorization check with isCurrentUserAdmin()
    // const isAdmin = await isCurrentUserAdmin()
    // if (!isAdmin) {
    //   logAuthError('getAllUsers', new Error('Unauthorized: Admin access required'))
    //   return {
    //     success: false,
    //     error: "Unauthorized: Admin access required"
    //   }
    // }

    // Create admin client with service role
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[USER_LIST] Fetch error:", error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: users || []
    }
  } catch (error) {
    console.error("[USER_LIST] Unexpected error:", error)
    logAuthError('getAllUsers', error)
    return {
      success: false,
      error: "An unexpected error occurred"
    }
  }
}