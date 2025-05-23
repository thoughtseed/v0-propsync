"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Lock } from "lucide-react"
import { FormField } from "@/components/wizard/fields/form-field"
import { useWizard } from "@/components/wizard/wizard-context"
import { maskSensitiveData } from "@/lib/security/sensitive-fields"
import { usePropertyWizard } from "@/hooks/use-property-wizard"

interface SecureFieldProps {
  name: string
  label: string
  description?: string
  required?: boolean
  placeholder?: string
}

export function SecureField({ name, label, description, required = false, placeholder }: SecureFieldProps) {
  const [visible, setVisible] = useState(false)
  const { formData, updateFormData } = useWizard()
  const { canViewSensitive } = usePropertyWizard()

  const value = (formData[name as keyof typeof formData] as string) || ""

  // If user doesn't have permission to view sensitive data
  if (!canViewSensitive) {
    return (
      <FormField name={name} label={label} description={description} required={required}>
        <div className="flex items-center space-x-2">
          <Input type="password" value="********" disabled className="flex-1" />
          <Button type="button" size="icon" variant="outline" disabled>
            <Lock className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-amber-600 mt-1">
          You don't have permission to view or edit this sensitive information.
        </p>
      </FormField>
    )
  }

  return (
    <FormField name={name} label={label} description={description} required={required}>
      <div className="flex items-center space-x-2">
        <Input
          id={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => updateFormData({ [name]: e.target.value })}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" size="icon" variant="outline" onClick={() => setVisible(!visible)}>
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {value && !visible && <p className="text-xs text-gray-500 mt-1">Stored value: {maskSensitiveData(value)}</p>}
    </FormField>
  )
}
