"use client"

import type { ReactNode } from "react"
import { WizardProvider } from "./wizard-context"
import type { WizardFormData } from "@/lib/types/wizard-types"
import { WizardMobileLayout } from "./wizard-mobile-layout"
import { WizardDesktopLayout } from "./wizard-desktop-layout"
import { useIsMobile } from "@/hooks/use-mobile"

interface WizardLayoutProps {
  children: ReactNode
  initialData?: WizardFormData
}

export function WizardLayout({ children, initialData = {} }: WizardLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <WizardProvider initialData={initialData}>
      {isMobile ? (
        <WizardMobileLayout>{children}</WizardMobileLayout>
      ) : (
        <WizardDesktopLayout>{children}</WizardDesktopLayout>
      )}
    </WizardProvider>
  )
}
