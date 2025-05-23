"use client"

import { useState } from "react"
import { z } from "zod"
import { getStepSchema } from "@/lib/validations/property-schemas"

export function useFormValidation(stepId: string) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (data: any) => {
    try {
      const schema = getStepSchema(stepId)
      schema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          formattedErrors[path] = err.message
        })
        setErrors(formattedErrors)
      }
      return false
    }
  }

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName]
  }

  const clearErrors = () => {
    setErrors({})
  }

  return {
    errors,
    validateStep,
    getFieldError,
    clearErrors,
  }
}
