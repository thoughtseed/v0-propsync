import { getServerUser } from "@/lib/supabase/server"
import { getSupabaseClient } from "@/lib/supabase/client"

/**
 * Server-side function to check if the current user is an admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const user = await getServerUser()
    if (!user || !user.profile) {
      console.log("[AUTH_CHECK] No user or profile found")
      return false
    }
    
    const isAdmin = user.profile.role === 'admin'
    console.log(`[AUTH_CHECK] User ${user.email} role: ${user.profile.role}, isAdmin: ${isAdmin}`)
    return isAdmin
  } catch (error) {
    console.error("[AUTH_CHECK] Error checking admin status:", error)
    return false
  }
}

/**
 * Server-side function to get current user's role
 */
export async function getCurrentUserRole(): Promise<string | null> {
  try {
    const user = await getServerUser()
    if (!user || !user.profile) {
      console.log("[AUTH_CHECK] No user or profile found for role check")
      return null
    }
    
    console.log(`[AUTH_CHECK] User ${user.email} has role: ${user.profile.role}`)
    return user.profile.role
  } catch (error) {
    console.error("[AUTH_CHECK] Error getting user role:", error)
    return null
  }
}

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
    
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error("[AUTH_CHECK_CLIENT] Error fetching user profile:", error)
      return false
    }
    
    const isAdmin = profile?.role === 'admin'
    console.log(`[AUTH_CHECK_CLIENT] User ${user.email} role: ${profile?.role}, isAdmin: ${isAdmin}`)
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
    
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error("[AUTH_CHECK_CLIENT] Error fetching user profile:", error)
      return null
    }
    
    console.log(`[AUTH_CHECK_CLIENT] User ${user.email} has role: ${profile?.role}`)
    return profile?.role || null
  } catch (error) {
    console.error("[AUTH_CHECK_CLIENT] Error getting user role:", error)
    return null
  }
}

/**
 * Helper function to log authentication errors with context
 */
export function logAuthError(functionName: string, error: any, context?: any) {
  console.error(`[AUTH_ERROR] Function: ${functionName}`, {
    error: error.message || error,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  })
}

/**
 * Helper function to check if user has permission for property operations
 */
export async function canManageProperties(): Promise<boolean> {
  try {
    const role = await getCurrentUserRole()
    const canManage = role === 'admin' || role === 'manager'
    console.log(`[PERMISSION_CHECK] User role: ${role}, canManageProperties: ${canManage}`)
    return canManage
  } catch (error) {
    logAuthError('canManageProperties', error)
    return false
  }
}

/**
 * Helper function to check if user can create properties (admin only)
 */
export async function canCreateProperties(): Promise<boolean> {
  try {
    const isAdmin = await isCurrentUserAdmin()
    console.log(`[PERMISSION_CHECK] canCreateProperties: ${isAdmin}`)
    return isAdmin
  } catch (error) {
    logAuthError('canCreateProperties', error)
    return false
  }
}