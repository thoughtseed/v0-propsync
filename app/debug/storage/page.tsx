"use client"

import { useState } from "react"
import { StandaloneImageUpload } from "@/components/standalone-image-upload"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function StorageDebugPage() {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [userInfo, setUserInfo] = useState<any>(null)
  const [bucketInfo, setBucketInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Get auth status and bucket info
  const checkStatus = async () => {
    setLoading(true)
    const supabase = getSupabaseClient()
    
    try {
      // Check auth status
      const { data: { session } } = await supabase.auth.getSession()
      setUserInfo({
        authenticated: !!session,
        userId: session?.user?.id || 'Not logged in',
        email: session?.user?.email || 'Not logged in'
      })
      
      // Check if the bucket exists by trying to list objects
      if (session) {
        const { data, error } = await supabase.storage.from('properties').list()
        setBucketInfo({
          exists: !error,
          error: error ? error.message : null,
          objects: data ? data.length : 0
        })
      }
    } catch (error) {
      console.error("Error checking status:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Storage Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Check authentication and storage status</CardDescription>
          </CardHeader>
          <CardContent>
            {userInfo && (
              <div className="mb-4">
                <h3 className="text-md font-medium">Authentication Status:</h3>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p><span className="font-medium">Authenticated:</span> {userInfo.authenticated ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">User ID:</span> {userInfo.userId}</p>
                  <p><span className="font-medium">Email:</span> {userInfo.email}</p>
                </div>
              </div>
            )}
            
            {bucketInfo && (
              <div>
                <h3 className="text-md font-medium">Storage Bucket Status:</h3>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p><span className="font-medium">Bucket 'properties' exists:</span> {bucketInfo.exists ? 'Yes' : 'No'}</p>
                  {bucketInfo.error && <p><span className="font-medium">Error:</span> {bucketInfo.error}</p>}
                  {bucketInfo.exists && <p><span className="font-medium">Objects in bucket:</span> {bucketInfo.objects}</p>}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={checkStatus} disabled={loading}>
              {loading ? "Checking..." : "Check Status"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upload Test</CardTitle>
            <CardDescription>Test image upload functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <StandaloneImageUpload
                label="Test Image Upload"
                value={imageUrl}
                onChange={setImageUrl}
                description="Upload an image to test storage permissions"
              />
            </div>
            
            {imageUrl && (
              <div className="mt-4">
                <h3 className="text-md font-medium">Upload Result:</h3>
                <div className="mt-2 p-3 bg-gray-50 rounded-md break-all">
                  <p>{imageUrl}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Troubleshooting Steps:</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Verify you are logged in (authentication status should show "Yes")</li>
          <li>Check if the storage bucket exists</li>
          <li>If you see RLS policy errors, navigate to <a href="/debug/storage-setup" className="text-blue-600 underline">Storage Setup</a></li>
          <li>After running the storage setup, return to this page and try uploading again</li>
        </ol>
      </div>
    </div>
  )
}
