"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { useFormValidation } from "@/hooks/use-form-validation"
import type { WizardCategory, WizardContextType, WizardFormData } from "@/lib/types/wizard-types"

// Define all wizard steps and categories
const wizardCategories: WizardCategory[] = [
  {
    id: "basic-info",
    title: "Basic Information",
    emoji: "🏠",
    steps: [
      {
        id: "identity-location",
        title: "Identity & Location",
        subtitle: "Let's start with the essentials",
        emoji: "📍",
        category: "basic-info",
        fields: 5,
      },
      {
        id: "space-capacity",
        title: "Space & Capacity",
        subtitle: "Tell us about the property size",
        emoji: "📏",
        category: "basic-info",
        fields: 4,
      },
      {
        id: "description-story",
        title: "Description & Story",
        subtitle: "Describe the property in detail",
        emoji: "📝",
        category: "basic-info",
        fields: 2,
      },
      {
        id: "visual-impression",
        title: "Visual First Impression",
        subtitle: "Add photos and floor plans",
        emoji: "📸",
        category: "basic-info",
        fields: 2,
      },
    ],
  },
  {
    id: "safety-security",
    title: "Safety & Security",
    emoji: "🛡️",
    steps: [
      {
        id: "fire-emergency",
        title: "Fire & Emergency Safety",
        subtitle: "Essential safety equipment",
        emoji: "🧯",
        category: "safety-security",
        fields: 5,
      },
      {
        id: "access-security",
        title: "Access & Building Security",
        subtitle: "Secure entry and access",
        emoji: "🔐",
        category: "safety-security",
        fields: 4,
      },
      {
        id: "safety-features",
        title: "Safety Features & Contacts",
        subtitle: "Additional safety information",
        emoji: "☎️",
        category: "safety-security",
        fields: 4,
      },
    ],
  },
  {
    id: "kitchen-dining",
    title: "Kitchen & Dining",
    emoji: "🍽️",
    steps: [
      {
        id: "cooking-essentials",
        title: "Cooking Essentials",
        subtitle: "Major appliances and features",
        emoji: "🍳",
        category: "kitchen-dining",
        fields: 5,
      },
      {
        id: "dining-cookware",
        title: "Dining & Cookware",
        subtitle: "Dining capacity and inventory",
        emoji: "🍽️",
        category: "kitchen-dining",
        fields: 4,
      },
      {
        id: "special-kitchen",
        title: "Special Kitchen Features",
        subtitle: "Unique kitchen amenities",
        emoji: "✨",
        category: "kitchen-dining",
        fields: 4,
      },
    ],
  },
  {
    id: "bedrooms-bathrooms",
    title: "Bedrooms & Bathrooms",
    emoji: "🛏️",
    steps: [
      {
        id: "sleep-sanctuary",
        title: "Sleep Sanctuary",
        subtitle: "Bed configurations and comfort",
        emoji: "🛏️",
        category: "bedrooms-bathrooms",
        fields: 5,
      },
      {
        id: "bedroom-comfort",
        title: "Bedroom Comfort",
        subtitle: "Additional bedroom amenities",
        emoji: "🛋️",
        category: "bedrooms-bathrooms",
        fields: 4,
      },
      {
        id: "bathroom-bliss",
        title: "Bathroom Bliss",
        subtitle: "Shower, bath, and towels",
        emoji: "🚿",
        category: "bedrooms-bathrooms",
        fields: 5,
      },
      {
        id: "bathroom-features",
        title: "Bathroom Features",
        subtitle: "Special bathroom amenities",
        emoji: "🧴",
        category: "bedrooms-bathrooms",
        fields: 4,
      },
    ],
  },
  {
    id: "technology",
    title: "Technology",
    emoji: "📱",
    steps: [
      {
        id: "connected-living",
        title: "Connected Living",
        subtitle: "WiFi, smart home, and charging",
        emoji: "📶",
        category: "technology",
        fields: 5,
      },
      {
        id: "entertainment-hub",
        title: "Entertainment Hub",
        subtitle: "TV, streaming, and audio",
        emoji: "🎮",
        category: "technology",
        fields: 4,
      },
    ],
  },
  {
    id: "practical-living",
    title: "Practical Living",
    emoji: "🧹",
    steps: [
      {
        id: "laundry-solutions",
        title: "Laundry Solutions",
        subtitle: "Washer, dryer, and laundry supplies",
        emoji: "🧺",
        category: "practical-living",
        fields: 5,
      },
      {
        id: "cleaning-maintenance",
        title: "Cleaning & Maintenance",
        subtitle: "Cleaning supplies and schedules",
        emoji: "🧼",
        category: "practical-living",
        fields: 4,
      },
      {
        id: "climate-control",
        title: "Climate Control",
        subtitle: "AC, heating, and ventilation",
        emoji: "🌡️",
        category: "practical-living",
        fields: 4,
      },
    ],
  },
  {
    id: "location-lifestyle",
    title: "Location & Lifestyle",
    emoji: "🌆",
    steps: [
      {
        id: "getting-around",
        title: "Getting Around",
        subtitle: "Transport and accessibility",
        emoji: "🚇",
        category: "location-lifestyle",
        fields: 4,
      },
      {
        id: "local-gems",
        title: "Local Gems",
        subtitle: "Restaurants, shops, and attractions",
        emoji: "🍜",
        category: "location-lifestyle",
        fields: 5,
      },
    ],
  },
  {
    id: "accessibility-sustainability",
    title: "Accessibility & Sustainability",
    emoji: "♿",
    steps: [
      {
        id: "inclusive-design",
        title: "Inclusive Design",
        subtitle: "Accessibility features",
        emoji: "♿",
        category: "accessibility-sustainability",
        fields: 5,
      },
      {
        id: "green-living",
        title: "Green Living",
        subtitle: "Eco-friendly features",
        emoji: "🌱",
        category: "accessibility-sustainability",
        fields: 5,
      },
    ],
  },
]

// Flatten all steps for easy access
const allSteps = wizardCategories.flatMap((category) => category.steps)

// Create the context
const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children, initialData = {} }: { children: ReactNode; initialData?: WizardFormData }) {
  const [formData, setFormData] = useState<WizardFormData>(initialData)
  const [currentStepId, setCurrentStepId] = useState(allSteps[0].id)
  const [isLoading, setIsLoading] = useState(false)
  const [validationEnabled, setValidationEnabled] = useState(false)

  // Find current step and category
  const currentStep = allSteps.find((step) => step.id === currentStepId) || allSteps[0]
  const currentCategory = wizardCategories.find((cat) => cat.id === currentStep.category) || wizardCategories[0]

  // Set up validation
  const { validateStep, getFieldError, errors, clearErrors } = useFormValidation(currentStep.id)

  // Calculate if first or last step
  const currentStepIndex = allSteps.findIndex((step) => step.id === currentStepId)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === allSteps.length - 1

  // Calculate progress
  const progress = Math.round(((currentStepIndex + 1) / allSteps.length) * 100)

  // Set up debounced auto-save
  const debouncedFormData = useDebounce(formData, 2000)

  // Update form data
  const updateFormData = (data: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  // Navigation functions
  const setCurrentStep = (stepId: string) => {
    const step = allSteps.find((s) => s.id === stepId)
    if (step) {
      // Clear validation errors when changing steps
      clearErrors()
      setCurrentStepId(stepId)
    }
  }

  const nextStep = () => {
    if (!isLastStep) {
      // Validate current step before proceeding
      if (validationEnabled) {
        const isValid = validateStep(formData)
        if (!isValid) return
      }

      const nextIndex = currentStepIndex + 1
      clearErrors()
      setCurrentStepId(allSteps[nextIndex].id)
    }
  }

  const prevStep = () => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1
      clearErrors()
      setCurrentStepId(allSteps[prevIndex].id)
    }
  }

  // Enable validation after the first next button click
  const enableValidation = () => {
    setValidationEnabled(true)
  }

  // Save progress to localStorage and Supabase
  const saveProgress = async () => {
    try {
      setIsLoading(true)

      // Save to localStorage
      localStorage.setItem("propertyWizardData", JSON.stringify(formData))

      // In a real implementation, we would save to Supabase here
      // await supabase.from('property_drafts').upsert({ data: formData, user_id: currentUser.id })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      return { success: true }
    } catch (error) {
      console.error("Failed to save progress:", error)
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-save when form data changes
  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem("propertyWizardData", JSON.stringify(debouncedFormData))
    }

    if (Object.keys(debouncedFormData).length > 0) {
      saveToLocalStorage()
    }
  }, [debouncedFormData])

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("propertyWizardData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData((prev) => ({ ...prev, ...parsedData }))
      } catch (error) {
        console.error("Failed to parse saved data:", error)
      }
    }
  }, [])

  // Mark steps as completed based on form data
  const categoriesWithStatus = wizardCategories.map((category) => {
    const steps = category.steps.map((step) => {
      // Logic to determine if step is completed would go here
      // For now, we'll just mark the current step as active
      return {
        ...step,
        isActive: step.id === currentStepId,
        isCompleted: allSteps.findIndex((s) => s.id === step.id) < currentStepIndex,
      }
    })

    return {
      ...category,
      steps,
      isActive: category.id === currentCategory.id,
      isCompleted: category.steps.every((step) => step.isCompleted),
    }
  })

  return (
    <WizardContext.Provider
      value={{
        formData,
        updateFormData,
        categories: categoriesWithStatus,
        currentCategory,
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        isFirstStep,
        isLastStep,
        saveProgress,
        isLoading,
        progress,
        validateStep,
        getFieldError,
        errors,
        enableValidation,
        validationEnabled,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export const useWizard = () => {
  const context = useContext(WizardContext)
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return context
}
