import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"
import { getServerSession } from "@/lib/supabase/server"

export default async function LoginPage() {
  const session = await getServerSession()

  // If the user is already logged in, redirect to the properties page
  if (session) {
    redirect("/properties")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Co.Property</h1>
        <p className="text-muted-foreground">Property management made simple</p>
      </div>
      <AuthForm />
    </div>
  )
}
