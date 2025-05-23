"use client"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export type QualityOption = {
  value: string
  label: string
  stars: number
}

interface QualitySliderProps {
  options: QualityOption[]
  value: string
  onChange: (value: string) => void
}

export function QualitySlider({ options, value, onChange }: QualitySliderProps) {
  const selectedOption = options.find((option) => option.value === value) || options[0]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Quality Level</span>
        <span className="text-sm font-medium">{selectedOption?.label}</span>
      </div>

      <div className="flex justify-between items-center">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center space-y-1 px-2 py-1 rounded-md transition-colors",
              value === option.value ? "bg-blue-50" : "hover:bg-gray-50",
            )}
          >
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("h-4 w-4", i < option.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200")}
                />
              ))}
            </div>
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
