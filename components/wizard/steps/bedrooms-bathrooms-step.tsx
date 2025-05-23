"use client"

import { useWizard } from "@/components/wizard/wizard-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { IconCheckboxGrid } from "@/components/wizard/fields/icon-checkbox-grid"
import { TagInput } from "@/components/wizard/fields/tag-input"
import { RoomConfigurator, type RoomConfig } from "@/components/wizard/fields/room-configurator"
import { QualitySlider } from "@/components/wizard/fields/quality-slider"

export function BedroomsBathroomsStep() {
  const { currentStep, formData, updateFormData } = useWizard()

  // Helper function to update bedroom configurations
  const updateBedConfigurations = (configs: RoomConfig[]) => {
    updateFormData({ bed_configurations: configs })
  }

  // Render different fields based on the current step
  switch (currentStep.id) {
    case "sleep-sanctuary":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Bed Configurations</Label>
            <RoomConfigurator
              value={formData.bed_configurations || []}
              onChange={updateBedConfigurations}
              rooms={["Master Bedroom", "Guest Bedroom", "Second Bedroom", "Third Bedroom", "Kids Room"]}
              options={{
                size: ["King", "Queen", "Double", "Twin", "Single", "Bunk"],
                type: ["Memory Foam", "Spring", "Hybrid", "Latex", "Adjustable"],
              }}
              maxRooms={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra_bedding_location">Extra Bedding Location</Label>
            <Input
              id="extra_bedding_location"
              value={formData.extra_bedding_location || ""}
              onChange={(e) => updateFormData({ extra_bedding_location: e.target.value })}
              placeholder="e.g., Closet in master bedroom, under bed storage"
            />
          </div>

          <div className="space-y-2">
            <Label>Mattress Quality</Label>
            <QualitySlider
              options={[
                { value: "budget", label: "Budget", stars: 1 },
                { value: "standard", label: "Standard", stars: 2 },
                { value: "premium", label: "Premium", stars: 3 },
                { value: "luxury", label: "Luxury", stars: 4 },
                { value: "ultra_luxury", label: "Ultra Luxury", stars: 5 },
              ]}
              value={formData.mattress_type || "standard"}
              onChange={(value) => updateFormData({ mattress_type: value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pillow_details">Pillow Details</Label>
            <Textarea
              id="pillow_details"
              value={formData.pillow_details || ""}
              onChange={(e) => updateFormData({ pillow_details: e.target.value })}
              placeholder="Describe the pillows provided (type, quantity, firmness)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="closet_details">Closet Details</Label>
            <Textarea
              id="closet_details"
              value={formData.closet_details || ""}
              onChange={(e) => updateFormData({ closet_details: e.target.value })}
              placeholder="Describe the closet space and storage options"
              rows={3}
            />
          </div>
        </div>
      )

    case "bedroom-comfort":
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="blackout_curtains"
              checked={formData.blackout_curtains || false}
              onCheckedChange={(checked) => updateFormData({ blackout_curtains: checked })}
            />
            <Label htmlFor="blackout_curtains">Blackout Curtains Available</Label>
          </div>

          <div className="space-y-2">
            <Label>Bedroom Electronics</Label>
            <IconCheckboxGrid
              options={[
                { value: "tv", label: "TV", icon: "📺" },
                { value: "alarm_clock", label: "Alarm Clock", icon: "⏰" },
                { value: "air_purifier", label: "Air Purifier", icon: "🌬️" },
                { value: "fan", label: "Fan", icon: "🌀" },
                { value: "sound_machine", label: "Sound Machine", icon: "🔊" },
                { value: "charging_station", label: "Charging Station", icon: "🔌" },
              ]}
              value={formData.bedroom_electronics || []}
              onChange={(value) => updateFormData({ bedroom_electronics: value })}
              columns={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="furniture_inventory">Furniture Inventory</Label>
            <Textarea
              id="furniture_inventory"
              value={formData.furniture_inventory || ""}
              onChange={(e) => updateFormData({ furniture_inventory: e.target.value })}
              placeholder="List all furniture items in the bedrooms"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Bedroom Amenities</Label>
            <TagInput
              value={formData.bedroom_amenities || []}
              onChange={(value) => updateFormData({ bedroom_amenities: value })}
              suggestions={[
                "Reading Lamp",
                "Desk",
                "Chair",
                "Luggage Rack",
                "Full-length Mirror",
                "Dresser",
                "Nightstand",
                "Blackout Curtains",
                "Bedside Table",
              ]}
              placeholder="Add bedroom amenities"
              icon="🛋️"
            />
          </div>
        </div>
      )

    case "bathroom-bliss":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="shower_bath_config">Shower/Bath Configuration</Label>
            <Select
              value={formData.shower_bath_config || ""}
              onValueChange={(value) => updateFormData({ shower_bath_config: value })}
            >
              <SelectTrigger id="shower_bath_config">
                <SelectValue placeholder="Select configuration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shower_only">Shower Only</SelectItem>
                <SelectItem value="bath_only">Bath Only</SelectItem>
                <SelectItem value="shower_over_bath">Shower Over Bath</SelectItem>
                <SelectItem value="separate_shower_bath">Separate Shower and Bath</SelectItem>
                <SelectItem value="walk_in_shower">Walk-in Shower</SelectItem>
                <SelectItem value="jacuzzi_tub">Jacuzzi Tub</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="towel_details">Towel Details</Label>
            <Textarea
              id="towel_details"
              value={formData.towel_details || ""}
              onChange={(e) => updateFormData({ towel_details: e.target.value })}
              placeholder="Describe the towels provided (quantity, sizes, quality)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Toiletries Provided</Label>
            <TagInput
              value={formData.toiletries_provided || []}
              onChange={(value) => updateFormData({ toiletries_provided: value })}
              suggestions={[
                "Shampoo",
                "Conditioner",
                "Body Wash",
                "Hand Soap",
                "Body Lotion",
                "Toothpaste",
                "Shower Cap",
                "Cotton Buds",
                "Facial Tissues",
              ]}
              placeholder="Add toiletries provided"
              icon="🧴"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hair_dryer_available"
              checked={formData.hair_dryer_available || false}
              onCheckedChange={(checked) => updateFormData({ hair_dryer_available: checked })}
            />
            <Label htmlFor="hair_dryer_available">Hair Dryer Available</Label>
          </div>

          {formData.hair_dryer_available && (
            <div className="space-y-2">
              <Label htmlFor="hair_dryer_details">Hair Dryer Details</Label>
              <Input
                id="hair_dryer_details"
                value={formData.hair_dryer_details || ""}
                onChange={(e) => updateFormData({ hair_dryer_details: e.target.value })}
                placeholder="e.g., Brand, wattage, location"
              />
            </div>
          )}
        </div>
      )

    case "bathroom-features":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="water_pressure">Water Pressure</Label>
            <Select
              value={formData.water_pressure || ""}
              onValueChange={(value) => updateFormData({ water_pressure: value })}
            >
              <SelectTrigger id="water_pressure">
                <SelectValue placeholder="Select water pressure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="very_high">Very High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hot_water_system">Hot Water System</Label>
            <Input
              id="hot_water_system"
              value={formData.hot_water_system || ""}
              onChange={(e) => updateFormData({ hot_water_system: e.target.value })}
              placeholder="e.g., Tank, tankless, solar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ventilation">Ventilation</Label>
            <Input
              id="ventilation"
              value={formData.ventilation || ""}
              onChange={(e) => updateFormData({ ventilation: e.target.value })}
              placeholder="e.g., Exhaust fan, window, natural ventilation"
            />
          </div>

          <div className="space-y-2">
            <Label>Special Features</Label>
            <IconCheckboxGrid
              options={[
                { value: "heated_floors", label: "Heated Floors", icon: "🔥" },
                { value: "rainfall_shower", label: "Rainfall Shower", icon: "🚿" },
                { value: "bidet", label: "Bidet", icon: "🚽" },
                { value: "double_sink", label: "Double Sink", icon: "🧼" },
                { value: "makeup_mirror", label: "Makeup Mirror", icon: "🪞" },
                { value: "scale", label: "Scale", icon: "⚖️" },
              ]}
              value={formData.bathroom_special_features || []}
              onChange={(value) => updateFormData({ bathroom_special_features: value })}
              columns={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Accessibility Features</Label>
            <TagInput
              value={formData.bathroom_accessibility_features || []}
              onChange={(value) => updateFormData({ bathroom_accessibility_features: value })}
              suggestions={[
                "Grab Bars",
                "Shower Seat",
                "Roll-in Shower",
                "Raised Toilet",
                "Wide Doorway",
                "Non-slip Flooring",
              ]}
              placeholder="Add accessibility features"
              icon="♿"
            />
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
