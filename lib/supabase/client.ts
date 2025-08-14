"use client"

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

// Returns "user" if authenticated, null if not
export async function getUserRole(): Promise<string | null> {
  const supabase = getSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session ? "user" : null
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  // Optional: fetch profile from users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  return {
    ...session.user,
    profile: profile || null,
  }
}
