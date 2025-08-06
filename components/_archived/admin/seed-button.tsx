"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { seedSampleProperty } from "@/app/actions/seed-actions"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function SeedButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()

  const handleSeed = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await seedSampleProperty()

      if (response.success) {
        setResult({
          success: true,
          message: `Successfully seeded sample property with ID: ${response.propertyId}`,
        })

        // Refresh the page data
        router.refresh()

        // Navigate to the property page after a short delay
        setTimeout(() => {
          router.push(`/properties/${response.propertyId}`)
        }, 2000)
      } else {
        setResult({
          success: false,
          message: response.error || "Failed to seed sample property",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={handleSeed} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Seeding Sample Property...
          </>
        ) : (
          "Seed Sample Property"
        )}
      </Button>

      {result && (
        <div className={`p-3 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {result.success ? (
                <Check className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{result.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}