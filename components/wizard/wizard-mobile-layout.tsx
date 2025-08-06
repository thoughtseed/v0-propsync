"use client"

import type { ReactNode } from "react"
import { useWizard } from "./wizard-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Save, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { TestDataPrefillButtons } from "./test-data-prefill-buttons"

interface WizardMobileLayoutProps {
  children: ReactNode
}

export function WizardMobileLayout({ children }: WizardMobileLayoutProps) {
  const {
    currentStep,
    currentCategory,
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
    <div className="flex flex-col h-screen bg-white">
      {/* Fixed Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-3 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{currentCategory.emoji}</span>
            <h1 className="text-lg font-semibold">{currentCategory.title}</h1>
          </div>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => saveProgress()} disabled={isLoading}>
            <Save className="h-3 w-3 mr-1" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-medium flex items-center">
              <span className="text-lg mr-1">{currentStep.emoji}</span>
              {currentStep.title}
            </h2>
            <span className="text-xs text-gray-500">{progress}% complete</span>
          </div>
          <Progress value={progress} className="h-1" />
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

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <TestDataPrefillButtons className="mb-6" />
        {children}
      </main>

      {/* Fixed Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-between z-10">
        <Button variant="outline" onClick={prevStep} disabled={isFirstStep} className={cn(isFirstStep && "opacity-50")}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="text-xs text-gray-500">Step {currentStep.id}</div>

        <Button onClick={handleNextClick} disabled={isLastStep}>
          {isLastStep ? "Finish" : "Next"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </footer>
    </div>
  )
}
