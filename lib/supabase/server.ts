import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/types/supabase"

export async function getServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
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
