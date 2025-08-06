import { getSupabaseClient } from "@/lib/supabase/client"
import { logAuthError as logAuthErrorUtil } from "./error-logging"

/**
 * Client-side function to check if the current user is an admin
 */
export async function isCurrentUserAdminClient(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log("[AUTH_CHECK_CLIENT] No authenticated user found")
      return false
    }

    // Get user profile from the users table
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) {
      // If users table doesn't exist (42P01), return false silently
      // This allows AuthSetupCheck to handle the setup flow
      if (error.code === "42P01") {
        console.log("[AUTH_CHECK_CLIENT] Users table not found, setup required")
        return false
      }
      console.error("[AUTH_CHECK_CLIENT] Error fetching user profile:", error)
      return false
    }

    if (!profile) {
      console.log("[AUTH_CHECK_CLIENT] No profile found for user")
      return false
    }
    
    const isAdmin = profile.role === 'admin'
    console.log(`[AUTH_CHECK_CLIENT] User ${user.email} role: ${profile.role}, isAdmin: ${isAdmin}`)
    return isAdmin
  } catch (error) {
    console.error("[AUTH_CHECK_CLIENT] Error checking admin status:", error)
    return false
  }
}

/**
 * Client-side function to get current user's role
 */
export async function getCurrentUserRoleClient(): Promise<string | null> {
  try {
    const supabase = getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log("[AUTH_CHECK_CLIENT] No authenticated user found for role check")
      return null
    }

    // Get user profile from the users table
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) {
      // If users table doesn't exist (42P01), return null silently
      // This allows AuthSetupCheck to handle the setup flow
      if (error.code === "42P01") {
        console.log("[AUTH_CHECK_CLIENT] Users table not found, setup required")
        return null
      }
      console.error("[AUTH_CHECK_CLIENT] Error fetching user role:", error)
      return null
    }

    if (!profile) {
      console.log("[AUTH_CHECK_CLIENT] No profile found for user role check")
      return null
    }
    
    console.log(`[AUTH_CHECK_CLIENT] User ${user.email} has role: ${profile.role}`)
    return profile.role
  } catch (error) {
    console.error("[AUTH_CHECK_CLIENT] Error getting user role:", error)
    return null
  }
}

/**
 * Client-side function to log authentication errors
 */
export function logAuthError(functionName: string, error: any, context?: any) {
  logAuthErrorUtil(functionName, error, {
    function: functionName,
    ...context,
    timestamp: new Date().toISOString()
  })
}

/**
 * Client-side function to check if user can manage properties
 */
export async function canManageProperties(): Promise<boolean> {
  try {
    return await isCurrentUserAdminClient()
  } catch (error) {
    logAuthError('canManageProperties', error)
    return false
  }
}

/**
 * Client-side function to check if user can create properties
 */
export async function canCreateProperties(): Promise<boolean> {
  try {
    return await isCurrentUserAdminClient()
  } catch (error) {
    logAuthError('canCreateProperties', error)
    return false
  }
}