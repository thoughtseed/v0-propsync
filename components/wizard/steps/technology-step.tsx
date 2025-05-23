"use client"

import { useWizard } from "@/components/wizard/wizard-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/wizard/fields/form-field"
import { SecureField } from "@/components/wizard/fields/secure-field"
import { TagInput } from "@/components/wizard/fields/tag-input"

export function TechnologyStep() {
  const { currentStep, formData, updateFormData } = useWizard()

  // Render different fields based on the current step
  switch (currentStep.id) {
    case "connected-living":
      return (
        <div className="space-y-6">
          <FormField name="wifi_network" label="WiFi Network Name" required>
            <Input
              id="wifi_network"
              value={formData.wifi_network || ""}
              onChange={(e) => updateFormData({ wifi_network: e.target.value })}
              placeholder="e.g., Noble-Guest"
            />
          </FormField>

          <SecureField
            name="wifi_password"
            label="WiFi Password"
            required
            placeholder="Enter WiFi password"
            description="This information is encrypted and only visible to admins and managers"
          />

          <FormField name="internet_speed" label="Internet Speed">
            <Input
              id="internet_speed"
              value={formData.internet_speed || ""}
              onChange={(e) => updateFormData({ internet_speed: e.target.value })}
              placeholder="e.g., 300 Mbps"
            />
          </FormField>

          <FormField name="smart_home_features" label="Smart Home Features">
            <TagInput
              id="smart_home_features"
              value={formData.smart_home_features || []}
              onChange={(value) => updateFormData({ smart_home_features: value })}
              placeholder="Add a feature and press Enter"
              suggestions={[
                "Smart Thermostat",
                "Smart Lighting",
                "Smart Locks",
                "Voice Assistant",
                "Smart TV",
                "Smart Blinds",
                "Security Cameras",
              ]}
            />
          </FormField>

          <FormField name="router_location" label="Router Location">
            <Input
              id="router_location"
              value={formData.router_location || ""}
              onChange={(e) => updateFormData({ router_location: e.target.value })}
              placeholder="e.g., Living room cabinet"
            />
          </FormField>
        </div>
      )

    case "entertainment-hub":
      return (
        <div className="space-y-6">
          <FormField name="tv_details" label="TV Details">
            <Textarea
              id="tv_details"
              value={formData.tv_details || ""}
              onChange={(e) => updateFormData({ tv_details: e.target.value })}
              placeholder="e.g., 65-inch Samsung Smart TV in living room, 43-inch LG TV in master bedroom"
              rows={3}
            />
          </FormField>

          <FormField name="streaming_services" label="Streaming Services">
            <Textarea
              id="streaming_services"
              value={formData.streaming_services || ""}
              onChange={(e) => updateFormData({ streaming_services: e.target.value })}
              placeholder="e.g., Netflix, Amazon Prime, Disney+ (guest should use their own accounts)"
              rows={3}
            />
          </FormField>

          <FormField name="speaker_systems" label="Speaker Systems">
            <Input
              id="speaker_systems"
              value={formData.speaker_systems || ""}
              onChange={(e) => updateFormData({ speaker_systems: e.target.value })}
              placeholder="e.g., Sonos system throughout, Bluetooth speaker in kitchen"
            />
          </FormField>

          <FormField name="remote_controls" label="Remote Controls">
            <TagInput
              id="remote_controls"
              value={formData.remote_controls || []}
              onChange={(value) => updateFormData({ remote_controls: value })}
              placeholder="Add a remote control and press Enter"
              suggestions={["TV Remote", "Sound System Remote", "AC Remote", "Projector Remote", "Universal Remote"]}
            />
          </FormField>

          <FormField name="charging_stations" label="Charging Stations">
            <Input
              id="charging_stations"
              value={formData.charging_stations || ""}
              onChange={(e) => updateFormData({ charging_stations: e.target.value })}
              placeholder="e.g., USB charging ports by each bed, wireless charger in living room"
            />
          </FormField>

          <FormField name="backup_solutions" label="Backup Solutions">
            <Input
              id="backup_solutions"
              value={formData.backup_solutions || ""}
              onChange={(e) => updateFormData({ backup_solutions: e.target.value })}
              placeholder="e.g., Power bank in kitchen drawer, backup internet hotspot"
            />
          </FormField>
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
