"use client"
import { Check, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureBuilderProps {
  value: string[]
  onChange: (value: string[]) => void
  baseFeatures: string[]
  addOns: string[]
}

export function FeatureBuilder({ value = [], onChange, baseFeatures = [], addOns = [] }: FeatureBuilderProps) {
  const toggleFeature = (feature: string) => {
    if (value.includes(feature)) {
      onChange(value.filter((v) => v !== feature))
    } else {
      onChange([...value, feature])
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Essential Features</h3>
        <div className="space-y-1">
          {baseFeatures.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={cn(
                "flex items-center justify-between w-full p-2 rounded-md text-left",
                value.includes(feature)
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-gray-50 hover:bg-gray-100 border border-gray-200",
              )}
            >
              <span>{feature}</span>
              {value.includes(feature) ? (
                <Check className="h-4 w-4 text-blue-600" />
              ) : (
                <Plus className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Additional Features</h3>
        <div className="space-y-1">
          {addOns.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={cn(
                "flex items-center justify-between w-full p-2 rounded-md text-left",
                value.includes(feature)
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-gray-50 hover:bg-gray-100 border border-gray-200",
              )}
            >
              <span>{feature}</span>
              {value.includes(feature) ? (
                <Check className="h-4 w-4 text-blue-600" />
              ) : (
                <Plus className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium mb-2">Selected Features ({value.length})</h3>
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {value.map((feature) => (
              <div
                key={feature}
                className="flex items-center bg-white border border-gray-200 rounded-md px-2 py-1 text-sm"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No features selected yet</p>
        )}
      </div>
    </div>
  )
}
