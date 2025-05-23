import type React from "react"
import { redirect } from "next/navigation"
import { getServerSupabaseClient } from "@/lib/supabase/server"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redirect to login page if not authenticated
    redirect("/auth/login")
  }

  return <>{children}</>
}
