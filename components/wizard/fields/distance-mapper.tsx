"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, MapPin } from "lucide-react"

export type LocationDistance = {
  type: string
  name: string
  distance: string
  walkTime?: string
}

export type LocationType = {
  type: string
  icon: string
  showWalkTime: boolean
}

interface DistanceMapperProps {
  value: LocationDistance[]
  onChange: (value: LocationDistance[]) => void
  types: LocationType[]
  maxLocations?: number
}

export function DistanceMapper({ value = [], onChange, types, maxLocations = 10 }: DistanceMapperProps) {
  const addLocation = () => {
    if (value.length < maxLocations) {
      const defaultType = types[0]?.type || ""
      onChange([...value, { type: defaultType, name: "", distance: "", walkTime: "" }])
    }
  }

  const updateLocation = (index: number, field: keyof LocationDistance, fieldValue: string) => {
    const newLocations = [...value]
    newLocations[index] = { ...newLocations[index], [field]: fieldValue }
    onChange(newLocations)
  }

  const removeLocation = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const getIconForType = (type: string): string => {
    const locationType = types.find((t) => t.type === type)
    return locationType?.icon || "📍"
  }

  const shouldShowWalkTime = (type: string): boolean => {
    const locationType = types.find((t) => t.type === type)
    return locationType?.showWalkTime || false
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {value.map((location, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-2">{getIconForType(location.type)}</span>
                <Select value={location.type} onValueChange={(val) => updateLocation(index, "type", val)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        <div className="flex items-center">
                          <span className="mr-2">{type.icon}</span>
                          {type.type}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLocation(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                value={location.name}
                onChange={(e) => updateLocation(index, "name", e.target.value)}
                placeholder="Location name"
                className="flex-1"
              />
              <Input
                value={location.distance}
                onChange={(e) => updateLocation(index, "distance", e.target.value)}
                placeholder="Distance (km)"
                className="w-24"
              />
            </div>

            {shouldShowWalkTime(location.type) && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Input
                  value={location.walkTime || ""}
                  onChange={(e) => updateLocation(index, "walkTime", e.target.value)}
                  placeholder="Walking time (min)"
                  className="flex-1"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addLocation}
        disabled={value.length >= maxLocations}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Location
      </Button>

      {value.length === 0 && (
        <p className="text-sm text-gray-500 text-center italic">
          No nearby locations added yet. Click "Add Location" to start.
        </p>
      )}
    </div>
  )
}
