"use client"

import { useWizard } from "@/components/wizard/wizard-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagInput } from "@/components/wizard/fields/tag-input"
import { DistanceMapper, type LocationType } from "@/components/wizard/fields/distance-mapper"

export function LocationLifestyleStep() {
  const { currentStep, formData, updateFormData } = useWizard()

  // Location types for the distance mapper
  const locationTypes: LocationType[] = [
    { type: "Public Transport", icon: "🚇", showWalkTime: true },
    { type: "Grocery Store", icon: "🛒", showWalkTime: true },
    { type: "Restaurant", icon: "🍽️", showWalkTime: true },
    { type: "Cafe", icon: "☕", showWalkTime: true },
    { type: "Shopping Mall", icon: "🛍️", showWalkTime: true },
    { type: "Tourist Attraction", icon: "🏛️", showWalkTime: false },
    { type: "Hospital", icon: "🏥", showWalkTime: false },
    { type: "Pharmacy", icon: "💊", showWalkTime: true },
    { type: "Park", icon: "🌳", showWalkTime: true },
  ]

  // Render different fields based on the current step
  switch (currentStep.id) {
    case "getting-around":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="public_transport">Public Transport</Label>
            <Textarea
              id="public_transport"
              value={formData.public_transport || ""}
              onChange={(e) => updateFormData({ public_transport: e.target.value })}
              placeholder="Describe nearby public transportation options"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Nearby Locations</Label>
            <DistanceMapper
              value={formData.nearby_locations || []}
              onChange={(value) => updateFormData({ nearby_locations: value })}
              types={locationTypes}
              maxLocations={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="walking_score">Walking Score</Label>
            <Input
              id="walking_score"
              value={formData.walking_score || ""}
              onChange={(e) => updateFormData({ walking_score: e.target.value })}
              placeholder="e.g., 85/100 - Very walkable area"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood_description">Neighborhood Description</Label>
            <Textarea
              id="neighborhood_description"
              value={formData.neighborhood_description || ""}
              onChange={(e) => updateFormData({ neighborhood_description: e.target.value })}
              placeholder="Describe the neighborhood, atmosphere, and character"
              rows={3}
            />
          </div>
        </div>
      )

    case "local-gems":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Restaurants</Label>
            <TagInput
              value={formData.restaurants || []}
              onChange={(value) => updateFormData({ restaurants: value })}
              suggestions={[
                "Thai Restaurant",
                "Italian Restaurant",
                "Japanese Restaurant",
                "Cafe",
                "Bakery",
                "Street Food",
                "Fine Dining",
              ]}
              placeholder="Add recommended restaurants"
              icon="🍽️"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grocery_shopping">Grocery Shopping</Label>
            <Textarea
              id="grocery_shopping"
              value={formData.grocery_shopping || ""}
              onChange={(e) => updateFormData({ grocery_shopping: e.target.value })}
              placeholder="Describe grocery shopping options nearby"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Tourist Attractions</Label>
            <TagInput
              value={formData.tourist_attractions || []}
              onChange={(value) => updateFormData({ tourist_attractions: value })}
              suggestions={[
                "Temple",
                "Museum",
                "Park",
                "Shopping Mall",
                "Market",
                "Historical Site",
                "Beach",
                "Viewpoint",
              ]}
              placeholder="Add nearby tourist attractions"
              icon="🏛️"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_services">Emergency Services</Label>
            <Textarea
              id="emergency_services"
              value={formData.emergency_services || ""}
              onChange={(e) => updateFormData({ emergency_services: e.target.value })}
              placeholder="List nearby hospitals, police stations, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="local_tips">Local Tips</Label>
            <Textarea
              id="local_tips"
              value={formData.local_tips || ""}
              onChange={(e) => updateFormData({ local_tips: e.target.value })}
              placeholder="Share insider tips about the area"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weather_patterns">Weather Patterns</Label>
            <Input
              id="weather_patterns"
              value={formData.weather_patterns || ""}
              onChange={(e) => updateFormData({ weather_patterns: e.target.value })}
              placeholder="e.g., Rainy season from May to October"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="safety_assessment">Safety Assessment</Label>
            <Select
              value={formData.safety_assessment || ""}
              onValueChange={(value) => updateFormData({ safety_assessment: value })}
            >
              <SelectTrigger id="safety_assessment">
                <SelectValue placeholder="Select safety level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very_safe">Very Safe</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="use_caution">Use Caution</SelectItem>
                <SelectItem value="not_recommended">Not Recommended at Night</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )

    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Step content for "{currentStep.id}" is under development</p>
        </div>
      )
  }
}
