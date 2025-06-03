import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/types/supabase"

// Singleton pattern to avoid multiple instances
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>()
  }
  return supabaseClient
}

// Simplified role handling - always returns "user" for authenticated users
export async function getUserRole(): Promise<string | null> {
  const supabase = getSupabaseClient()

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  // Always return "user" for authenticated users (removing role-based access control)
  return "user"
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  const { data } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  return {
    ...session.user,
    profile: data || null,
  }
}
