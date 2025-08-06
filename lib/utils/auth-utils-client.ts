import { getSupabaseClient } from "@/lib/supabase/client"
import { logAuthError as logAuthErrorUtil } from "./error-logging"

/**
 * MVP Alpha Version - Simplified Auth Utilities
 * For beta version, restore from _archived-auth-utils-client.ts
 * 
 * Since we have a single admin user in alpha, all auth checks return true
 * for authenticated users.
 */

/**
 * Client-side function to check if the current user is an admin
 * MVP: Always returns true for authenticated users
 */
export async function isCurrentUserAdminClient(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log("[AUTH_CHECK_CLIENT] No authenticated user found")
      return false
    }

    // MVP: All authenticated users are considered admin
    console.log(`[AUTH_CHECK_CLIENT] User ${user.email} authenticated - MVP admin access granted`)
    return true
  } catch (error) {
    console.error("[AUTH_CHECK_CLIENT] Error checking admin status:", error)
    return false
  }
}

/**
 * Client-side function to get current user's role
 * MVP: Always returns 'admin' for authenticated users
 */
export async function getCurrentUserRoleClient(): Promise<string | null> {
  try {
    const supabase = getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log("[AUTH_CHECK_CLIENT] No authenticated user found")
      return null
    }

    // MVP: All authenticated users have admin role
    console.log(`[AUTH_CHECK_CLIENT] User ${user.email} role: admin (MVP)`)
    return 'admin'
  } catch (error) {
    console.error("[AUTH_CHECK_CLIENT] Error fetching user role:", error)
    return null
  }
}

/**
 * Log authentication errors
 */
export function logAuthError(functionName: string, error: any, context?: any) {
  logAuthErrorUtil(functionName, error, context)
}

/**
 * Check if user can manage properties
 * MVP: Always true for authenticated users
 */
export async function canManageProperties(): Promise<boolean> {
  return await isCurrentUserAdminClient()
}

/**
 * Check if user can create properties
 * MVP: Always true for authenticated users
 */
export async function canCreateProperties(): Promise<boolean> {
  return await isCurrentUserAdminClient()
}