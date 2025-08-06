"use client"

import { useState } from "react"
import { z } from "zod"
import { getStepSchema } from "@/lib/validations/property-schemas"

export function useFormValidation(stepId: string) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (data: any) => {
    console.log('🔍 validateStep called with:', { stepId, data })
    try {
      const schema = getStepSchema(stepId)
      console.log('📋 Schema retrieved:', schema)
      schema.parse(data)
      console.log('✅ Validation passed')
      setErrors({})
      return true
    } catch (error) {
      console.log('❌ Validation error caught:', error)
      console.log('🔍 Error type:', typeof error)
      console.log('🔍 Error instanceof ZodError:', error instanceof z.ZodError)
      
      if (error instanceof z.ZodError) {
        console.log('🔍 ZodError.issues:', error.issues)
        console.log('🔍 ZodError.issues type:', typeof error.issues)
        console.log('🔍 ZodError.issues isArray:', Array.isArray(error.issues))
        
        const formattedErrors: Record<string, string> = {}
        
        // Safe check for issues array
        if (error.issues && Array.isArray(error.issues)) {
          error.issues.forEach((err: any) => {
            console.log('🔍 Processing error:', err)
            const path = err.path ? err.path.join(".") : 'unknown'
            formattedErrors[path] = err.message || 'Validation error'
          })
        } else {
          console.log('⚠️ error.issues is not an array or is undefined')
          formattedErrors['general'] = 'Validation failed'
        }
        
        console.log('🔍 Formatted errors:', formattedErrors)
        setErrors(formattedErrors)
      } else {
        console.log('⚠️ Non-ZodError caught:', error)
        setErrors({ general: 'Unknown validation error' })
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
