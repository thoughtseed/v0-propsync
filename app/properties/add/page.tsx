"use client"

import { WizardLayout } from "@/components/wizard/wizard-layout"
import { BasicInfoStep } from "@/components/wizard/steps/basic-info-step"
import { SafetySecurityStep } from "@/components/wizard/steps/safety-security-step"
import { KitchenDiningStep } from "@/components/wizard/steps/kitchen-dining-step"
import { BedroomsBathroomsStep } from "@/components/wizard/steps/bedrooms-bathrooms-step"
import { TechnologyStep } from "@/components/wizard/steps/technology-step"
import { PracticalLivingStep } from "@/components/wizard/steps/practical-living-step"
import { LocationLifestyleStep } from "@/components/wizard/steps/location-lifestyle-step"
import { AccessibilitySustainabilityStep } from "@/components/wizard/steps/accessibility-sustainability-step"
import { useWizard } from "@/components/wizard/wizard-context"
// MVP: RoleGate removed - single admin user has full access
// For beta: restore RoleGate import from components/_archived/auth/role-gate

export default function AddPropertyPage() {
  return (
    // MVP: Direct access for authenticated users - no role gate needed
    <WizardLayout>
      <WizardStepContent />
    </WizardLayout>
  )
}

function WizardStepContent() {
  const { currentStep } = useWizard()

  // Render the appropriate step content based on the current step ID
  switch (currentStep.category) {
    case "basic-info":
      return <BasicInfoStep />

    case "safety-security":
      return <SafetySecurityStep />

    case "kitchen-dining":
      return <KitchenDiningStep />

    case "bedrooms-bathrooms":
      return <BedroomsBathroomsStep />

    case "technology":
      return <TechnologyStep />

    case "practical-living":
      return <PracticalLivingStep />

    case "location-lifestyle":
      return <LocationLifestyleStep />

    case "accessibility-sustainability":
      return <AccessibilitySustainabilityStep />

    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Step content for "{currentStep.id}" is under development</p>
        </div>
      )
  }
}
