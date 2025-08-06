import { redirect } from "next/navigation"
import { getServerSupabaseClient, getServerUser } from "@/lib/supabase/server"
import { DataTable } from "@/components/admin/users-table"

export default async function UsersPage() {
  const user = await getServerUser()

  if (!user) {
    redirect("/properties")
  }

  const supabase = getServerSupabaseClient()
  
  // Check if current user is admin
  const { data: currentUserProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!currentUserProfile || currentUserProfile.role !== "admin") {
    redirect("/properties")
  }

  const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return <div>Error loading users</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <DataTable data={users || []} />
    </div>
  )
}
