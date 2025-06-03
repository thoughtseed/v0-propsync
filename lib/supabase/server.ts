import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/types/supabase"

// Named export for createClient that was missing - making it async
export const createClient = async () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  })
}

// Regular server client (respects RLS) - making it async
export const getServerSupabaseClient = async () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  })
}

// Admin client with service role (bypasses RLS) - making it async
export const getAdminSupabaseClient = async () => {
  // Make sure we have a service role key
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not set - admin client will not bypass RLS")
  }
  
  const cookieStore = cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
    options: {
      global: {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        },
      },
    },
  })
}

export async function getServerSession() {
  const supabase = await getServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getServerUser() {
  const session = await getServerSession()
  if (!session) return null

  const supabase = await getServerSupabaseClient()
  const { data } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  return {
    ...session.user,
    profile: data || null,
  }
}
