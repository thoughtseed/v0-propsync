import { propertySchema } from "@/lib/validations/property-schemas"
import type { WizardFormData } from "@/lib/types/wizard-types"

export function validateProperty(formData: WizardFormData) {
  try {
    propertySchema.parse(formData)
    return { valid: true, errors: {} }
  } catch (error: any) {
    if (error.errors) {
      const formattedErrors: Record<string, string> = {}
      error.errors.forEach((err: any) => {
        const path = err.path.join(".")
        formattedErrors[path] = err.message
      })
      return { valid: false, errors: formattedErrors }
    }
    return { valid: false, errors: { general: "Validation failed" } }
  }
}

export function validatePropertyCategory(formData: WizardFormData, categoryId: string) {
  // This would use the getCategorySchema function to validate a specific category
  // Implementation would be similar to validateProperty
}

export function getCompletionPercentage(formData: WizardFormData) {
  // Calculate the percentage of required fields that have been filled
  const requiredFields = [
    "property_reference",
    "building_name",
    "unit_number",
    "full_address",
    "property_type",
    "bedrooms",
    "bathrooms",
    "max_occupancy",
    "description",
    // Add more required fields here
  ]

  const filledFields = requiredFields.filter((field) => {
    const value = formData[field as keyof WizardFormData]
    return value !== undefined && value !== null && value !== ""
  })

  return Math.round((filledFields.length / requiredFields.length) * 100)
}
