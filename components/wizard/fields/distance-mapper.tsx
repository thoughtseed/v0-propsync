"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, X } from "lucide-react"

interface DistanceMapperProps {
  value: Array<{
    name: string
    distance: number
    unit: "m" | "km" | "min"
  }>
  onChange: (
    value: Array<{
      name: string
      distance: number
      unit: "m" | "km" | "min"
    }>,
  ) => void
  label?: string
  description?: string
}

export function DistanceMapper({
  value = [],
  onChange,
  label = "Nearby Amenities",
  description = "Add distances to nearby amenities and points of interest",
}: DistanceMapperProps) {
  const [newName, setNewName] = useState("")
  const [newDistance, setNewDistance] = useState<number | "">("")
  const [newUnit, setNewUnit] = useState<"m" | "km" | "min">("min")

  const handleAddItem = () => {
    if (newName && newDistance !== "") {
      onChange([
        ...value,
        {
          name: newName,
          distance: Number(newDistance),
          unit: newUnit,
        },
      ])
      setNewName("")
      setNewDistance("")
    }
  }

  const handleRemoveItem = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>{label}</Label>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3 md:col-span-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Supermarket"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="distance">Distance</Label>
                  <Input
                    id="distance"
                    type="number"
                    placeholder="5"
                    value={newDistance}
                    onChange={(e) => setNewDistance(e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as "m" | "km" | "min")}
                  >
                    <option value="min">min</option>
                    <option value="m">m</option>
                    <option value="km">km</option>
                  </select>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleAddItem}
                disabled={!newName || newDistance === ""}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Label>Added Amenities</Label>
            {value.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">No amenities added yet</p>
            ) : (
              <div className="mt-2 space-y-2">
                {value.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{item.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {item.distance} {item.unit}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(index)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
