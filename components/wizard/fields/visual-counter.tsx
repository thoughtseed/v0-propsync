"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface VisualCounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  visual?: "chairs" | "beds" | "people" | "basic"
  icon?: string
  label?: string
}

export function VisualCounter({
  value,
  onChange,
  min = 0,
  max = 10,
  visual = "basic",
  icon = "🪑",
  label = "Count",
}: VisualCounterProps) {
  const increment = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const decrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={decrement}
            disabled={value <= min}
            className={cn("p-1 rounded-l-lg", value <= min ? "text-gray-400" : "hover:bg-gray-200 text-gray-700")}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-medium">{value}</span>
          <button
            type="button"
            onClick={increment}
            disabled={value >= max}
            className={cn("p-1 rounded-r-lg", value >= max ? "text-gray-400" : "hover:bg-gray-200 text-gray-700")}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-1">
        {Array.from({ length: value }).map((_, i) => (
          <span key={i} className="text-xl">
            {icon}
          </span>
        ))}
        {value === 0 && <span className="text-gray-400 text-sm italic">None selected</span>}
      </div>
    </div>
  )
}
