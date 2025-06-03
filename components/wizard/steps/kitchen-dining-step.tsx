"use client"

import { useWizard } from "@/components/wizard/wizard-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VisualCounter } from "@/components/wizard/fields/visual-counter"
import { IconCheckboxGrid } from "@/components/wizard/fields/icon-checkbox-grid"
import { TagInput } from "@/components/wizard/fields/tag-input"
import { FeatureBuilder } from "@/components/wizard/fields/feature-builder"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function KitchenDiningStep() {
  const { currentStep, formData, updateFormData } = useWizard()

  // Render different fields based on the current step
  switch (currentStep.id) {
    case "cooking-essentials":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Major Appliances</Label>
            <IconCheckboxGrid
              options={[
                { value: "refrigerator", label: "Refrigerator", icon: "🧊" },
                { value: "stove", label: "Stove", icon: "🔥" },
                { value: "oven", label: "Oven", icon: "🍳" },
                { value: "microwave", label: "Microwave", icon: "📡" },
                { value: "dishwasher", label: "Dishwasher", icon: "🍽️" },
                { value: "freezer", label: "Freezer", icon: "❄️" },
              ]}
              value={formData.major_appliances || []}
              onChange={(value) => updateFormData({ major_appliances: value })}
              columns={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Small Appliances</Label>
            <IconCheckboxGrid
              options={[
                { value: "coffee_maker", label: "Coffee Maker", icon: "☕" },
                { value: "kettle", label: "Kettle", icon: "🫖" },
                { value: "toaster", label: "Toaster", icon: "🍞" },
                { value: "blender", label: "Blender", icon: "🥤" },
                { value: "rice_cooker", label: "Rice Cooker", icon: "🍚" },
                { value: "juicer", label: "Juicer", icon: "🍊" },
              ]}
              value={formData.small_appliances || []}
              onChange={(value) => updateFormData({ small_appliances: value })}
              columns={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cookware_inventory">Cookware Inventory</Label>
            <Textarea
              id="cookware_inventory"
              value={formData.cookware_inventory || ""}
              onChange={(e) => updateFormData({ cookware_inventory: e.target.value })}
              placeholder="List pots, pans, and cooking utensils..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dishware_count">Dishware Count</Label>
            <Input
              id="dishware_count"
              value={formData.dishware_count || ""}
              onChange={(e) => updateFormData({ dishware_count: e.target.value })}
              placeholder="e.g., 8 place settings (plates, bowls, glasses)"
            />
          </div>

          <div className="space-y-2">
            <Label>Dining Capacity</Label>
            <VisualCounter
              value={formData.dining_capacity || 0}
              onChange={(value) => updateFormData({ dining_capacity: value })}
              min={0}
              max={24}
              visual="chairs"
              icon="🪑"
              label="Number of Dining Seats"
            />
          </div>
        </div>
      )

    case "dining-cookware":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="water_filtration">Water Filtration</Label>
            <Select
              value={formData.water_filtration || ""}
              onValueChange={(value) => updateFormData({ water_filtration: value })}
            >
              <SelectTrigger id="water_filtration">
                <SelectValue placeholder="Select water filtration type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="pitcher">Water Filter Pitcher</SelectItem>
                <SelectItem value="faucet">Faucet Filter</SelectItem>
                <SelectItem value="under_sink">Under Sink System</SelectItem>
                <SelectItem value="whole_house">Whole House System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coffee_tea_facilities">Coffee & Tea Facilities</Label>
            <FeatureBuilder
              value={formData.coffee_tea_facilities ? formData.coffee_tea_facilities.split(", ") : []}
              onChange={(value) => updateFormData({ coffee_tea_facilities: value.join(", ") })}
              baseFeatures={["Electric Kettle", "Coffee Maker", "French Press"]}
              addOns={["Espresso Machine", "Tea Selection", "Coffee Grinder", "Coffee Beans", "Tea Pot"]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waste_disposal">Waste Disposal</Label>
            <Input
              id="waste_disposal"
              value={formData.waste_disposal || ""}
              onChange={(e) => updateFormData({ waste_disposal: e.target.value })}
              placeholder="e.g., Garbage disposal, trash compactor"
            />
          </div>

          <div className="space-y-2">
            <Label>Pantry Staples</Label>
            <TagInput
              value={formData.pantry_staples || []}
              onChange={(value) => updateFormData({ pantry_staples: value })}
              suggestions={[
                "Salt",
                "Pepper",
                "Olive Oil",
                "Sugar",
                "Coffee",
                "Tea",
                "Rice",
                "Pasta",
                "Spices",
                "Condiments",
              ]}
              placeholder="Add pantry items provided"
              icon="🧂"
            />
          </div>
        </div>
      )

    case "special-kitchen":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="special_features">Special Kitchen Features</Label>
            <Textarea
              id="special_features"
              value={formData.special_features || ""}
              onChange={(e) => updateFormData({ special_features: e.target.value })}
              placeholder="Describe any special or unique kitchen features..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="counter_material">Counter Material</Label>
            <Select
              value={formData.counter_material || ""}
              onValueChange={(value) => updateFormData({ counter_material: value })}
            >
              <SelectTrigger id="counter_material">
                <SelectValue placeholder="Select counter material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="granite">Granite</SelectItem>
                <SelectItem value="marble">Marble</SelectItem>
                <SelectItem value="quartz">Quartz</SelectItem>
                <SelectItem value="laminate">Laminate</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
                <SelectItem value="concrete">Concrete</SelectItem>
                <SelectItem value="stainless_steel">Stainless Steel</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Kitchen Photos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {(formData.kitchen_photos || []).length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {(formData.kitchen_photos || []).map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Kitchen photo ${index + 1}`}
                        className="h-32 w-full object-cover rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-2 right-2 bg-white/80"
                        onClick={() => {
                          const photos = [...(formData.kitchen_photos || [])]
                          photos.splice(index, 1)
                          updateFormData({ kitchen_photos: photos })
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {(formData.kitchen_photos || []).length < 4 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center h-32">
                      <Button variant="ghost">
                        <Upload className="h-5 w-5 mr-1" />
                        Add Photo
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2"  />
                  <p className="text-sm text-gray-500 mb-2">Upload photos of the kitchen to showcase its features</p>
                  <Button variant="outline" size="sm" onClick={() => {
                    const photos = [...(formData.kitchen_photos || [])]
                    photos.push("/placeholder.svg")
                    updateFormData({ kitchen_photos: photos })
                  }}>
                    Upload Photos
                  </Button>
                </div>
              )}
            </div>
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
