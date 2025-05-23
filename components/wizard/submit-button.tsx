"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useWizard } from "@/components/wizard/wizard-context"
import { validateProperty } from "@/lib/utils/validate-property"
import { createProperty, saveDraft } from "@/app/actions/property-actions"
import { Loader2, Save, CheckCircle } from "lucide-react"

export function SubmitButton() {
  const router = useRouter()
  const { formData, isLastStep } = useWizard()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate the entire form
      const validationResult = validateProperty(formData)
      if (!validationResult.success) {
        setError(validationResult.error || "Please complete all required fields")
        return
      }

      // Submit the property
      const result = await createProperty(formData)

      if (!result.success) {
        throw new Error(result.error || "Failed to submit property")
      }

      // Redirect to the property detail page
      router.push(`/properties/${result.propertyId}`)
    } catch (err) {
      console.error("Error submitting property:", err)
      setError(err instanceof Error ? err.message : "An error occurred while submitting the property")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await saveDraft(formData)

      if (!result.success) {
        throw new Error(result.error || "Failed to save draft")
      }

      // Update the form data with the draft ID
      if (result.id) {
        // We would need to update the form data with the draft ID
        // This could be done through the wizard context
      }
    } catch (err) {
      console.error("Error saving draft:", err)
      setError(err instanceof Error ? err.message : "An error occurred while saving the draft")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleSaveDraft}
          disabled={isSaving || isSubmitting}
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Draft
        </Button>

        {isLastStep && (
          <Button type="button" className="flex-1" onClick={handleSubmit} disabled={isSubmitting || isSaving}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Submit Property
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
