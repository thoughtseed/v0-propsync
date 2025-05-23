"use client"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type IconCheckboxOption = {
  value: string
  label: string
  icon: string
}

interface IconCheckboxGridProps {
  options: IconCheckboxOption[]
  value: string[]
  onChange: (value: string[]) => void
  columns?: 2 | 3 | 4
}

export function IconCheckboxGrid({ options, value = [], onChange, columns = 3 }: IconCheckboxGridProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => toggleOption(option.value)}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors",
            value.includes(option.value)
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 hover:border-gray-300 text-gray-700",
          )}
        >
          <div className="relative">
            <span className="text-2xl">{option.icon}</span>
            {value.includes(option.value) && (
              <span className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-0.5">
                <Check className="h-2 w-2 text-white" />
              </span>
            )}
          </div>
          <span className="mt-2 text-sm font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
