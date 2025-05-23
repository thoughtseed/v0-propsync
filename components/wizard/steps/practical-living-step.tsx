"use client"

import { useWizard } from "@/components/wizard/wizard-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TagInput } from "@/components/wizard/fields/tag-input"

export function PracticalLivingStep() {
  const { currentStep, formData, updateFormData } = useWizard()

  // Render different fields based on the current step
  switch (currentStep.id) {
    case "laundry-solutions":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="washer_details">Washer Details</Label>
            <Textarea
              id="washer_details"
              value={formData.washer_details || ""}
              onChange={(e) => updateFormData({ washer_details: e.target.value })}
              placeholder="Describe the washer (brand, type, location, instructions)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dryer_details">Dryer Details</Label>
            <Textarea
              id="dryer_details"
              value={formData.dryer_details || ""}
              onChange={(e) => updateFormData({ dryer_details: e.target.value })}
              placeholder="Describe the dryer (brand, type, location, instructions)"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="detergent_provided"
              checked={formData.detergent_provided || false}
              onCheckedChange={(checked) => updateFormData({ detergent_provided: checked })}
            />
            <Label htmlFor="detergent_provided">Laundry Detergent Provided</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="iron_board_available"
              checked={formData.iron_board_available || false}
              onCheckedChange={(checked) => updateFormData({ iron_board_available: checked })}
            />
            <Label htmlFor="iron_board_available">Iron & Ironing Board Available</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="drying_rack_location">Drying Rack Location</Label>
            <Input
              id="drying_rack_location"
              value={formData.drying_rack_location || ""}
              onChange={(e) => updateFormData({ drying_rack_location: e.target.value })}
              placeholder="e.g., Balcony, laundry room, closet"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="laundry_basket_available"
              checked={formData.laundry_basket_available || false}
              onCheckedChange={(checked) => updateFormData({ laundry_basket_available: checked })}
            />
            <Label htmlFor="laundry_basket_available">Laundry Basket Available</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="building_laundry_info">Building Laundry Information</Label>
            <Textarea
              id="building_laundry_info"
              value={formData.building_laundry_info || ""}
              onChange={(e) => updateFormData({ building_laundry_info: e.target.value })}
              placeholder="Information about shared laundry facilities if applicable"
              rows={3}
            />
          </div>
        </div>
      )

    case "cleaning-maintenance":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vacuum_details">Vacuum Details</Label>
            <Input
              id="vacuum_details"
              value={formData.vacuum_details || ""}
              onChange={(e) => updateFormData({ vacuum_details: e.target.value })}
              placeholder="e.g., Brand, type, location"
            />
          </div>

          <div className="space-y-2">
            <Label>Cleaning Supplies</Label>
            <TagInput
              value={formData.cleaning_supplies || []}
              onChange={(value) => updateFormData({ cleaning_supplies: value })}
              suggestions={[
                "All-purpose Cleaner",
                "Glass Cleaner",
                "Bathroom Cleaner",
                "Floor Cleaner",
                "Dish Soap",
                "Sponges",
                "Mop",
                "Broom",
                "Dustpan",
              ]}
              placeholder="Add cleaning supplies provided"
              icon="🧹"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cleaning_schedule">Cleaning Schedule</Label>
            <Textarea
              id="cleaning_schedule"
              value={formData.cleaning_schedule || ""}
              onChange={(e) => updateFormData({ cleaning_schedule: e.target.value })}
              placeholder="Describe regular cleaning services if provided"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_instructions">Special Cleaning Instructions</Label>
            <Textarea
              id="special_instructions"
              value={formData.special_instructions || ""}
              onChange={(e) => updateFormData({ special_instructions: e.target.value })}
              placeholder="Any special cleaning instructions for specific items or areas"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="stain_removal_kit"
              checked={formData.stain_removal_kit || false}
              onCheckedChange={(checked) => updateFormData({ stain_removal_kit: checked })}
            />
            <Label htmlFor="stain_removal_kit">Stain Removal Kit Available</Label>
          </div>
        </div>
      )

    case "climate-control":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ac_units_details">AC Units Details</Label>
            <Textarea
              id="ac_units_details"
              value={formData.ac_units_details || ""}
              onChange={(e) => updateFormData({ ac_units_details: e.target.value })}
              placeholder="Describe air conditioning units (type, location, remote controls)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heating_system">Heating System</Label>
            <Input
              id="heating_system"
              value={formData.heating_system || ""}
              onChange={(e) => updateFormData({ heating_system: e.target.value })}
              placeholder="e.g., Central heating, space heaters, floor heating"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thermostat_instructions">Thermostat Instructions</Label>
            <Textarea
              id="thermostat_instructions"
              value={formData.thermostat_instructions || ""}
              onChange={(e) => updateFormData({ thermostat_instructions: e.target.value })}
              placeholder="Instructions for operating the thermostat"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ventilation_systems">Ventilation Systems</Label>
            <Input
              id="ventilation_systems"
              value={formData.ventilation_systems || ""}
              onChange={(e) => updateFormData({ ventilation_systems: e.target.value })}
              placeholder="e.g., Exhaust fans, air purifiers, dehumidifiers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="air_purifiers">Air Purifiers</Label>
            <Input
              id="air_purifiers"
              value={formData.air_purifiers || ""}
              onChange={(e) => updateFormData({ air_purifiers: e.target.value })}
              placeholder="e.g., Brand, location, filter replacement schedule"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electrical_panel_location">Electrical Panel Location</Label>
            <Input
              id="electrical_panel_location"
              value={formData.electrical_panel_location || ""}
              onChange={(e) => updateFormData({ electrical_panel_location: e.target.value })}
              placeholder="e.g., Kitchen cabinet, hallway closet"
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
