"use client"

import { useState } from "react"
import { setupStorageBucket } from "@/app/actions/storage-setup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function StorageSetupDebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  const handleSetup = async () => {
    setIsLoading(true)
    try {
      const setupResult = await setupStorageBucket()
      setResult(setupResult)
    } catch (error) {
      setResult({ success: false, error: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Storage Setup</h1>
      
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">Alternative Setup Method</h2>
        <p className="mb-4">If you prefer to set up the storage policies manually via the Supabase dashboard:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Log in to your Supabase dashboard</li>
          <li>Navigate to Storage → Buckets</li>
          <li>Create a bucket named "properties" (set as public)</li>
          <li>Add RLS policies:
            <ul className="list-disc pl-6 mt-2">
              <li><strong>For INSERT:</strong> Allow uploads for authenticated users with policy: <code>(bucket_id = 'properties')</code></li>
              <li><strong>For SELECT:</strong> Allow public read access with policy: <code>(bucket_id = 'properties')</code></li>
              <li><strong>For DELETE:</strong> Allow file owners with policy: <code>(bucket_id = 'properties' AND owner = auth.uid())</code></li>
            </ul>
          </li>
        </ol>
      </div>
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Automatic Storage Setup</CardTitle>
          <CardDescription>
            This will automatically create the necessary bucket and security policies for file uploads.
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
                  ? "Storage bucket and policies have been set up successfully."
                  : `Failed to set up storage bucket: ${result.error}`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetup} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Setting Up..." : "Set Up Storage Bucket"}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center">
        <a href="/debug/storage" className="text-blue-600 underline">
          Return to Storage Debug Page
        </a>
      </div>
    </div>
  )
}
