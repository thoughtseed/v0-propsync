"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Lock } from "lucide-react"

interface SecureInputProps {
  value: string
  onChange: (value: string) => void
  isInternal?: boolean
  showToRoles?: string[]
  label?: string
  placeholder?: string
}

export function SecureInput({
  value,
  onChange,
  isInternal = false,
  showToRoles = ["admin", "manager"],
  label = "Secure Information",
  placeholder = "Enter secure information",
}: SecureInputProps) {
  const [visible, setVisible] = useState(false)

  // In a real app, you would check the user's role here
  const userRole = "admin" // Mock user role
  const canView = !isInternal || showToRoles.includes(userRole)

  if (!canView) {
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <Lock className="h-4 w-4 mr-1 text-amber-500" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="bg-gray-100 border border-gray-200 rounded-md p-2 text-sm text-gray-500 italic">
          This information is restricted to {showToRoles.join(", ")} roles
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Lock className="h-4 w-4 mr-1 text-blue-500" />
        <span className="text-sm font-medium">{label}</span>
        {isInternal && (
          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Internal Only</span>
        )}
      </div>

      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
        </Button>
      </div>

      {isInternal && (
        <p className="text-xs text-amber-600">
          This information is for internal use only and will not be shared with guests
        </p>
      )}
    </div>
  )
}
