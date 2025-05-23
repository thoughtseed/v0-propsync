"use client"

import { useWizard } from "@/components/wizard/wizard-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VisualCounter } from "@/components/wizard/fields/visual-counter"
import { FormField } from "@/components/wizard/fields/form-field"
import { ImageUpload } from "@/components/wizard/fields/image-upload"

export function BasicInfoStep() {
  const { currentStep, formData, updateFormData } = useWizard()

  // Render different fields based on the current step
  switch (currentStep.id) {
    case "identity-location":
      return (
        <div className="space-y-6">
          <FormField
            name="property_reference"
            label="Property Reference ID"
            description="A unique identifier for this property"
            required
          >
            <Input
              id="property_reference"
              value={formData.property_reference || ""}
              onChange={(e) => updateFormData({ property_reference: e.target.value })}
              placeholder="e.g., noble-remix-772-621"
            />
          </FormField>

          <FormField name="building_name" label="Building Name" required>
            <Input
              id="building_name"
              value={formData.building_name || ""}
              onChange={(e) => updateFormData({ building_name: e.target.value })}
              placeholder="e.g., Noble Remix"
            />
          </FormField>

          <FormField name="unit_number" label="Unit Number" required>
            <Input
              id="unit_number"
              value={formData.unit_number || ""}
              onChange={(e) => updateFormData({ unit_number: e.target.value })}
              placeholder="e.g., 772/621"
            />
          </FormField>

          <FormField name="full_address" label="Full Address" required>
            <Textarea
              id="full_address"
              value={formData.full_address || ""}
              onChange={(e) => updateFormData({ full_address: e.target.value })}
              placeholder="Enter the complete address"
              rows={3}
            />
          </FormField>

          <FormField name="property_type" label="Property Type" required>
            <Select
              value={formData.property_type || ""}
              onValueChange={(value) => updateFormData({ property_type: value })}
            >
              <SelectTrigger id="property_type">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury_condo">Luxury Condo</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
      )

    case "space-capacity":
      return (
        <div className="space-y-6">
          <FormField name="square_meters" label="Square Meters" description="Total living area in square meters">
            <Input
              id="square_meters"
              type="number"
              value={formData.square_meters || ""}
              onChange={(e) => updateFormData({ square_meters: Number(e.target.value) })}
              placeholder="e.g., 85"
            />
          </FormField>

          <FormField name="bedrooms" label="Bedrooms" required>
            <VisualCounter
              value={formData.bedrooms || 0}
              onChange={(value) => updateFormData({ bedrooms: value })}
              min={0}
              max={10}
              visual="beds"
              icon="🛏️"
              label="Number of Bedrooms"
            />
          </FormField>

          <FormField name="bathrooms" label="Bathrooms" required>
            <VisualCounter
              value={formData.bathrooms || 0}
              onChange={(value) => updateFormData({ bathrooms: value })}
              min={0}
              max={10}
              visual="basic"
              icon="🚿"
              label="Number of Bathrooms"
            />
          </FormField>

          <FormField name="max_occupancy" label="Maximum Occupancy" required>
            <VisualCounter
              value={formData.max_occupancy || 0}
              onChange={(value) => updateFormData({ max_occupancy: value })}
              min={1}
              max={20}
              visual="people"
              icon="👤"
              label="Maximum Guests"
            />
          </FormField>
        </div>
      )

    case "description-story":
      return (
        <div className="space-y-6">
          <FormField name="year_built" label="Year Built / Renovated">
            <div className="flex space-x-2">
              <Input
                id="year_built"
                value={formData.year_built || ""}
                onChange={(e) => updateFormData({ year_built: e.target.value })}
                placeholder="Year built"
                className="flex-1"
              />
              <Input
                id="year_renovated"
                value={formData.year_renovated || ""}
                onChange={(e) => updateFormData({ year_renovated: e.target.value })}
                placeholder="Year renovated"
                className="flex-1"
              />
            </div>
          </FormField>

          <FormField
            name="description"
            label="Property Description"
            description="Provide a comprehensive description of the property, highlighting key features and unique selling points."
            required
          >
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Describe the property in detail..."
              rows={6}
            />
          </FormField>
        </div>
      )

    case "visual-impression":
      return (
        <div className="space-y-6">
          <ImageUpload
            name="primary_photo"
            label="Primary Photo"
            value={formData.primary_photo}
            onChange={(url) => updateFormData({ primary_photo: url })}
            description="This will be the main photo displayed for your property"
            required
          />

          <ImageUpload
            name="floor_plan"
            label="Floor Plan"
            value={formData.floor_plan}
            onChange={(url) => updateFormData({ floor_plan: url })}
            description="Upload a floor plan to help guests understand the layout"
          />
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
