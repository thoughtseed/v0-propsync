import { redirect } from "next/navigation"
import { UserProfile } from "@/components/auth/user-profile"
import { getServerUser } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const user = await getServerUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const isAdmin = user.profile?.role === "admin"

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <UserProfile user={user} isAdmin={isAdmin} />
    </div>
  )
}
