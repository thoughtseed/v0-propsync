"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient, getCurrentUser } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function UserProfile() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        setEmail(user.email || "")
        setFullName(user.profile?.full_name || "")
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setError(null)
    setMessage(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth/login")
        return
      }

      // Update user metadata
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      })

      if (updateAuthError) throw updateAuthError

      // Update user profile in the database
      const { error: updateProfileError } = await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", session.user.id)

      if (updateProfileError) throw updateProfileError

      setMessage("Profile updated successfully.")
    } catch (error: any) {
      setError(error.message || "An error occurred while updating your profile.")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <form onSubmit={handleUpdateProfile}>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled className="bg-muted" />
            <p className="text-sm text-muted-foreground">Your email cannot be changed.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updating}>
            {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {updating ? "Updating profile..." : "Update profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
