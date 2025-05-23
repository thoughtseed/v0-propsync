"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function AuthSetupCheck() {
  const [isChecking, setIsChecking] = useState(true)
  const [isSetup, setIsSetup] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkSetup = async () => {
      try {
        // Check if the users table exists
        const { error } = await supabase.from("users").select("id").limit(1)

        if (error && error.code === "42P01") {
          // Table doesn't exist
          setIsSetup(false)
        } else {
          setIsSetup(true)
        }
      } catch (error) {
        console.error("Error checking auth setup:", error)
        setIsSetup(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkSetup()
  }, [supabase])

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isSetup) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Database Setup Required</CardTitle>
            <CardDescription>
              The authentication tables need to be set up before you can use the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>Please set up the authentication tables to continue.</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/admin/auth-setup")} className="w-full">
              Set Up Authentication
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return null
}
