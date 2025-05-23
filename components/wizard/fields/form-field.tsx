"use client"

import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { useWizard } from "@/components/wizard/wizard-context"

interface FormFieldProps {
  name: string
  label: string
  children: ReactNode
  description?: string
  required?: boolean
}

export function FormField({ name, label, children, description, required = false }: FormFieldProps) {
  const { getFieldError, validationEnabled } = useWizard()
  const error = getFieldError(name)
  const showError = validationEnabled && error

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {showError && <span className="text-xs text-red-500">{error}</span>}
      </div>
      {children}
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  )
}
