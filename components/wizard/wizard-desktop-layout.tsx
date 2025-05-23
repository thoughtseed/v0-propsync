"use client"

import { type ReactNode, useState } from "react"
import { useWizard } from "./wizard-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Save, Check, ChevronDown, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WizardCategory, WizardStep } from "@/lib/types/wizard-types"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface WizardDesktopLayoutProps {
  children: ReactNode
}

export function WizardDesktopLayout({ children }: WizardDesktopLayoutProps) {
  const {
    categories,
    currentStep,
    currentCategory,
    setCurrentStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    progress,
    saveProgress,
    isLoading,
    errors,
    enableValidation,
    validationEnabled,
  } = useWizard()

  const hasErrors = validationEnabled && Object.keys(errors).length > 0

  const handleNextClick = () => {
    enableValidation()
    nextStep()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">Add New Property</h1>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">{progress}% complete</span>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => saveProgress()} disabled={isLoading}>
              <Save className="h-3 w-3 mr-1" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
          <Progress value={progress} className="mt-2 h-1" />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              currentStepId={currentStep.id}
              onSelectStep={setCurrentStep}
            />
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500 mb-2">Property Preview</div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <PropertyPreview />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{currentCategory.emoji}</span>
            <div>
              <h1 className="text-xl font-semibold">{currentCategory.title}</h1>
              <div className="flex items-center mt-1">
                <span className="text-lg mr-1">{currentStep.emoji}</span>
                <h2 className="text-base text-gray-700">{currentStep.title}</h2>
                {currentStep.subtitle && <span className="text-sm text-gray-500 ml-2">— {currentStep.subtitle}</span>}
              </div>
            </div>
          </div>
        </header>

        {/* Validation Error Banner */}
        {hasErrors && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
                <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className={cn(isFirstStep && "opacity-50")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <Button onClick={handleNextClick} disabled={isLastStep}>
            {isLastStep ? "Finish" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </footer>
      </div>
    </div>
  )
}

function CategoryItem({
  category,
  currentStepId,
  onSelectStep,
}: {
  category: WizardCategory
  currentStepId: string
  onSelectStep: (stepId: string) => void
}) {
  const [isOpen, setIsOpen] = useState(category.isActive)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-1">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 text-left">
        <div className="flex items-center">
          <span className="text-lg mr-2">{category.emoji}</span>
          <span className="font-medium">{category.title}</span>
        </div>
        <div className="flex items-center">
          {category.isCompleted && <Check className="h-4 w-4 text-green-500 mr-1" />}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-7 space-y-1 mt-1">
          {category.steps.map((step) => (
            <StepItem
              key={step.id}
              step={step}
              isActive={step.id === currentStepId}
              onSelect={() => onSelectStep(step.id)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function StepItem({
  step,
  isActive,
  onSelect,
}: {
  step: WizardStep
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex items-center w-full p-2 rounded-md text-left text-sm",
        isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50",
      )}
    >
      <span className="text-base mr-2">{step.emoji}</span>
      <span>{step.title}</span>
      {step.isCompleted && <Check className="h-3 w-3 text-green-500 ml-auto" />}
    </button>
  )
}

function PropertyPreview() {
  const { formData } = useWizard()

  return (
    <div className="text-sm">
      {formData.building_name && formData.unit_number ? (
        <>
          <div className="font-medium">{formData.building_name}</div>
          <div className="text-gray-500">Unit {formData.unit_number}</div>
          {formData.bedrooms && formData.bathrooms && (
            <div className="text-gray-500 mt-1">
              {formData.bedrooms} bed • {formData.bathrooms} bath
            </div>
          )}
          {formData.property_type && <div className="text-gray-500">{formData.property_type}</div>}
        </>
      ) : (
        <div className="text-gray-400 italic">Property details will appear here as you fill out the form</div>
      )}
    </div>
  )
}
