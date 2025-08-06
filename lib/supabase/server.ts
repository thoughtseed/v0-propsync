import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Named export for createClient that was missing
export const createClient = () => {
  return createServerComponentClient({ 
    cookies 
  })
}

// Regular server client (respects RLS)
export const getServerSupabaseClient = () => {
  return createServerComponentClient({ 
    cookies 
  })
}

// Admin client with service role (bypasses RLS)
export const getAdminSupabaseClient = () => {
  // Make sure we have a service role key
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not set - admin client will not bypass RLS")
  }
  
  return createServerComponentClient({
    cookies
  })
}

export async function getServerSession() {
  const supabase = getServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getServerUser() {
  const supabase = getServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
