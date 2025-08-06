"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { setupDatabase } from '@/app/actions/setup-database'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertCircle, Database, ArrowRight } from 'lucide-react'

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupResult, setSetupResult] = useState<{success?: boolean, message?: string} | null>(null)
  
  const handleSetup = async () => {
    setIsLoading(true)
    try {
      const result = await setupDatabase()
      setSetupResult({ 
        success: result.success,
        message: result.success 
          ? "Database tables were set up successfully!"
          : `Error: ${result.error || "Unknown error"}`
      })
    } catch (error) {
      setSetupResult({
        success: false,
        message: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" /> 
            Database Setup
          </CardTitle>
          <CardDescription>
            Initialize the database tables required for property management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will create the following tables if they don't exist yet:
          </p>
          
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>properties - Main property records</li>
            <li>property_basic_info - Basic information about properties</li>
            <li>property_images - Images associated with properties</li>
          </ul>
          
          <p className="text-sm text-muted-foreground mt-4">
            It will also set up the necessary row level security (RLS) policies.
          </p>
          
          {setupResult && (
            <Alert variant={setupResult.success ? "default" : "destructive"} className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{setupResult.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{setupResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSetup} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center">Setting up tables...</span>
            ) : (
              <span className="flex items-center">Initialize Database Tables <ArrowRight className="ml-2 h-4 w-4" /></span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 