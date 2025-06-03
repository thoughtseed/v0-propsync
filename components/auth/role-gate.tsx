"use client"

import { type ReactNode } from "react"

interface RoleGateProps {
  children: ReactNode
  allowedRoles?: string[] // Made optional as it's no longer used
  fallback?: ReactNode
}

// Simplified RoleGate that always allows access (removing role-based restrictions)
export function RoleGate({ children }: RoleGateProps) {
  // Always render children, no role checking
  return <>{children}</>
}
