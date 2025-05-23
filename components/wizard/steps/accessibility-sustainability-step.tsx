"use client"

import { useWizard } from "@/components/wizard/wizard-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconCheckboxGrid } from "@/components/wizard/fields/icon-checkbox-grid"
import { TagInput } from "@/components/wizard/fields/tag-input"

export function AccessibilitySustainabilityStep() {
  const { currentStep, formData, updateFormData } = useWizard()

  // Render different fields based on the current step
  switch (currentStep.id) {
    case "inclusive-design":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="step_free_access">Step-Free Access</Label>
            <Textarea
              id="step_free_access"
              value={formData.step_free_access || ""}
              onChange={(e) => updateFormData({ step_free_access: e.target.value })}
              placeholder="Describe step-free access to and within the property"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="elevator_accessibility">Elevator Accessibility</Label>
            <Input
              id="elevator_accessibility"
              value={formData.elevator_accessibility || ""}
              onChange={(e) => updateFormData({ elevator_accessibility: e.target.value })}
              placeholder="e.g., Elevator size, accessibility features"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doorway_widths">Doorway Widths</Label>
            <Input
              id="doorway_widths"
              value={formData.doorway_widths || ""}
              onChange={(e) => updateFormData({ doorway_widths: e.target.value })}
              placeholder="e.g., All doorways are 32 inches or wider"
            />
          </div>

          <div className="space-y-2">
            <Label>Bathroom Accessibility Features</Label>
            <IconCheckboxGrid
              options={[
                { value: "grab_bars", label: "Grab Bars", icon: "🚿" },
                { value: "roll_in_shower", label: "Roll-in Shower", icon: "♿" },
                { value: "shower_seat", label: "Shower Seat", icon: "🪑" },
                { value: "raised_toilet", label: "Raised Toilet", icon: "🚽" },
                { value: "lowered_sink", label: "Lowered Sink", icon: "🧼" },
                { value: "emergency_cord", label: "Emergency Cord", icon: "🆘" },
              ]}
              value={formData.bathroom_features || []}
              onChange={(value) => updateFormData({ bathroom_features: value })}
              columns={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kitchen_height">Kitchen Counter Height</Label>
            <Input
              id="kitchen_height"
              value={formData.kitchen_height || ""}
              onChange={(e) => updateFormData({ kitchen_height: e.target.value })}
              placeholder="e.g., Standard height, adjustable, lowered section"
            />
          </div>

          <div className="space-y-2">
            <Label>Visual Accessibility Features</Label>
            <TagInput
              value={formData.visual_features || []}
              onChange={(value) => updateFormData({ visual_features: value })}
              suggestions={[
                "High Contrast Markings",
                "Braille Signage",
                "Good Lighting",
                "Large Print Materials",
                "Color Coded Features",
              ]}
              placeholder="Add visual accessibility features"
              icon="👁️"
            />
          </div>

          <div className="space-y-2">
            <Label>Auditory Accessibility Features</Label>
            <TagInput
              value={formData.auditory_features || []}
              onChange={(value) => updateFormData({ auditory_features: value })}
              suggestions={["Visual Doorbell", "Visual Alarms", "TTY Equipment", "Sound Amplification", "Quiet Areas"]}
              placeholder="Add auditory accessibility features"
              icon="👂"
            />
          </div>
        </div>
      )

    case "green-living":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="energy_rating">Energy Rating</Label>
            <Select
              value={formData.energy_rating || ""}
              onValueChange={(value) => updateFormData({ energy_rating: value })}
            >
              <SelectTrigger id="energy_rating">
                <SelectValue placeholder="Select energy rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">A (Excellent)</SelectItem>
                <SelectItem value="b">B (Very Good)</SelectItem>
                <SelectItem value="c">C (Good)</SelectItem>
                <SelectItem value="d">D (Fair)</SelectItem>
                <SelectItem value="e">E (Poor)</SelectItem>
                <SelectItem value="f">F (Very Poor)</SelectItem>
                <SelectItem value="g">G (Extremely Poor)</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewable_features">Renewable Energy Features</Label>
            <Textarea
              id="renewable_features"
              value={formData.renewable_features || ""}
              onChange={(e) => updateFormData({ renewable_features: e.target.value })}
              placeholder="Describe any renewable energy features (solar panels, etc.)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recycling_instructions">Recycling Instructions</Label>
            <Textarea
              id="recycling_instructions"
              value={formData.recycling_instructions || ""}
              onChange={(e) => updateFormData({ recycling_instructions: e.target.value })}
              placeholder="Provide instructions for recycling in the property"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Energy-Efficient Appliances</Label>
            <TagInput
              value={formData.efficient_appliances || []}
              onChange={(value) => updateFormData({ efficient_appliances: value })}
              suggestions={[
                "Energy Star Refrigerator",
                "Energy Star Washer",
                "Energy Star Dryer",
                "LED Lighting",
                "Efficient AC",
                "Induction Cooktop",
              ]}
              placeholder="Add energy-efficient appliances"
              icon="⚡"
            />
          </div>

          <div className="space-y-2">
            <Label>Water Conservation Features</Label>
            <TagInput
              value={formData.water_conservation || []}
              onChange={(value) => updateFormData({ water_conservation: value })}
              suggestions={[
                "Low-flow Showerheads",
                "Dual-flush Toilets",
                "Water-saving Faucets",
                "Rainwater Collection",
                "Drought-resistant Plants",
              ]}
              placeholder="Add water conservation features"
              icon="💧"
            />
          </div>

          <div className="space-y-2">
            <Label>Eco-Friendly Products</Label>
            <TagInput
              value={formData.eco_products || []}
              onChange={(value) => updateFormData({ eco_products: value })}
              suggestions={[
                "Organic Toiletries",
                "Biodegradable Cleaning Products",
                "Reusable Shopping Bags",
                "Filtered Water System",
                "Compost Bin",
              ]}
              placeholder="Add eco-friendly products provided"
              icon="🌱"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sustainable_materials">Sustainable Materials</Label>
            <Textarea
              id="sustainable_materials"
              value={formData.sustainable_materials || ""}
              onChange={(e) => updateFormData({ sustainable_materials: e.target.value })}
              placeholder="Describe sustainable materials used in the property"
              rows={3}
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
