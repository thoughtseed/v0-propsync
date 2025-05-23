"use client"

import { useWizard } from "@/components/wizard/wizard-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TagInput } from "@/components/wizard/fields/tag-input"
import { SecureInput } from "@/components/wizard/fields/secure-input"
import { Plus, Trash2 } from "lucide-react"

export function SafetySecurityStep() {
  const { currentStep, formData, updateFormData } = useWizard()

  // Helper function to update smoke detectors array
  const updateSmokeDetectors = (index: number, field: string, value: string) => {
    const detectors = [...(formData.smoke_detectors || [])]
    detectors[index] = { ...detectors[index], [field]: value }
    updateFormData({ smoke_detectors: detectors })
  }

  const addSmokeDetector = () => {
    const detectors = [...(formData.smoke_detectors || [])]
    detectors.push({ location: "" })
    updateFormData({ smoke_detectors: detectors })
  }

  const removeSmokeDetector = (index: number) => {
    const detectors = [...(formData.smoke_detectors || [])]
    detectors.splice(index, 1)
    updateFormData({ smoke_detectors: detectors })
  }

  // Render different fields based on the current step
  switch (currentStep.id) {
    case "fire-emergency":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Smoke Detectors</Label>
            <div className="space-y-2">
              {(formData.smoke_detectors || []).map((detector, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={detector.location}
                    onChange={(e) => updateSmokeDetectors(index, "location", e.target.value)}
                    placeholder="Location (e.g., Living Room)"
                    className="flex-1"
                  />
                  <Input
                    type="date"
                    value={detector.expiry_date || ""}
                    onChange={(e) => updateSmokeDetectors(index, "expiry_date", e.target.value)}
                    placeholder="Expiry Date"
                    className="w-40"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSmokeDetector(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button type="button" variant="outline" size="sm" onClick={addSmokeDetector} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Smoke Detector
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fire_extinguisher_location">Fire Extinguisher Location</Label>
            <Input
              id="fire_extinguisher_location"
              value={formData.fire_extinguisher_location || ""}
              onChange={(e) => updateFormData({ fire_extinguisher_location: e.target.value })}
              placeholder="e.g., Kitchen cabinet under sink"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fire_extinguisher_expiry">Fire Extinguisher Expiry Date</Label>
            <Input
              id="fire_extinguisher_expiry"
              type="date"
              value={formData.fire_extinguisher_expiry || ""}
              onChange={(e) => updateFormData({ fire_extinguisher_expiry: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="emergency_exit_plan"
              checked={formData.emergency_exit_plan || false}
              onCheckedChange={(checked) => updateFormData({ emergency_exit_plan: checked })}
            />
            <Label htmlFor="emergency_exit_plan">Emergency Exit Plan Available</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_aid_location">First Aid Kit Location</Label>
            <Input
              id="first_aid_location"
              value={formData.first_aid_location || ""}
              onChange={(e) => updateFormData({ first_aid_location: e.target.value })}
              placeholder="e.g., Bathroom cabinet"
            />
          </div>
        </div>
      )

    case "access-security":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="door_lock_type">Door Lock Type</Label>
            <Select
              value={formData.door_lock_type || ""}
              onValueChange={(value) => updateFormData({ door_lock_type: value })}
            >
              <SelectTrigger id="door_lock_type">
                <SelectValue placeholder="Select lock type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">Traditional Key</SelectItem>
                <SelectItem value="keypad">Keypad</SelectItem>
                <SelectItem value="smart_lock">Smart Lock</SelectItem>
                <SelectItem value="card_key">Card Key</SelectItem>
                <SelectItem value="fingerprint">Fingerprint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <SecureInput
              value={formData.smart_lock_code || ""}
              onChange={(value) => updateFormData({ smart_lock_code: value })}
              isInternal={true}
              showToRoles={["admin", "manager"]}
              label="Smart Lock Code / Key Safe Code"
              placeholder="Enter code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="building_security">Building Security</Label>
            <Textarea
              id="building_security"
              value={formData.building_security || ""}
              onChange={(e) => updateFormData({ building_security: e.target.value })}
              placeholder="Describe building security features..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>CCTV Coverage</Label>
            <TagInput
              value={formData.cctv_coverage || []}
              onChange={(value) => updateFormData({ cctv_coverage: value })}
              suggestions={["Entrance", "Lobby", "Elevator", "Hallway", "Parking", "Pool"]}
              placeholder="Add areas with CCTV coverage"
              icon="📹"
            />
          </div>
        </div>
      )

    case "safety-features":
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="emergency_contacts">Emergency Contacts</Label>
            <Textarea
              id="emergency_contacts"
              value={formData.emergency_contacts || ""}
              onChange={(e) => updateFormData({ emergency_contacts: e.target.value })}
              placeholder="List emergency contacts and phone numbers..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="window_security">Window Security</Label>
            <Input
              id="window_security"
              value={formData.window_security || ""}
              onChange={(e) => updateFormData({ window_security: e.target.value })}
              placeholder="e.g., Window locks, security bars"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balcony_safety">Balcony Safety</Label>
            <Input
              id="balcony_safety"
              value={formData.balcony_safety || ""}
              onChange={(e) => updateFormData({ balcony_safety: e.target.value })}
              placeholder="e.g., Height of railings, child safety features"
            />
          </div>

          <div className="space-y-2">
            <Label>Child Safety Features</Label>
            <TagInput
              value={formData.child_safety_features || []}
              onChange={(value) => updateFormData({ child_safety_features: value })}
              suggestions={["Socket Covers", "Cabinet Locks", "Corner Protectors", "Stair Gates", "Window Locks"]}
              placeholder="Add child safety features"
              icon="👶"
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
