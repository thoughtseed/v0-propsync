import { UserProfile } from "@/components/auth/user-profile"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="max-w-2xl">
        <UserProfile />
      </div>
    </div>
  )
}
