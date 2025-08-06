"use client"

import { useState } from "react"
import { setupAuthTables } from "@/app/actions/auth-setup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { RoleGate } from "@/components/auth/role-gate"

export default function AuthSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  const handleSetup = async () => {
    setIsLoading(true)
    try {
      const setupResult = await setupAuthTables()
      setResult(setupResult)
    } catch (error) {
      setResult({ success: false, error: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RoleGate allowedRoles={["admin"]}>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Authentication Setup</h1>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Set Up Authentication Tables</CardTitle>
            <CardDescription>
              This will create the necessary tables and security policies for authentication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <Alert className={result.success ? "bg-green-50" : "bg-red-50"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>
                  {result.success
                    ? "Authentication tables and policies have been set up successfully."
                    : `Failed to set up authentication tables: ${result.error}`}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSetup} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Setting Up..." : "Set Up Auth Tables"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </RoleGate>
  )
}
