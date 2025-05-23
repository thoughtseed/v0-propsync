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

export async function getUserRole(): Promise<string | null> {
  const supabase = getSupabaseClient()

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  // Get the user's role from the users table
  const { data, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()

  if (error || !data) return null
  return data.role
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
