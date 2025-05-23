import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/types/supabase"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>()
  }
  return supabaseClient
}

// Helper function to get the current user
export const getCurrentUser = async () => {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get the user's profile from the users table
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return {
    ...user,
    profile: profile || null,
  }
}

// Helper function to get the current user's role
export const getUserRole = async (): Promise<string> => {
  const user = await getCurrentUser()
  return user?.profile?.role || "readonly"
}
