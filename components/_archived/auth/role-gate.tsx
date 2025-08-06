"use client"

import { ReactNode, useEffect, useState } from "react"
import { isCurrentUserAdminClient, getCurrentUserRoleClient, logAuthError } from "@/lib/utils/auth-utils-client"
import { Loader2 } from "lucide-react"

interface RoleGateProps {
  children: ReactNode
  allowedRoles?: string[]
  requireAdmin?: boolean
  fallback?: ReactNode
}

export function RoleGate({ children, allowedRoles = [], requireAdmin = false, fallback }: RoleGateProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuthorization() {
      try {
        console.log("[ROLE_GATE] Checking user authorization...");
        
        if (requireAdmin) {
          const isAdmin = await isCurrentUserAdminClient()
          const role = await getCurrentUserRoleClient()
          
          console.log(`[ROLE_GATE] Admin check - isAdmin: ${isAdmin}, role: ${role}`);
          
          setUserRole(role)
          setIsAuthorized(isAdmin)
        } else if (allowedRoles.length > 0) {
          const role = await getCurrentUserRoleClient()
          const hasAccess = role ? allowedRoles.includes(role) : false
          
          console.log(`[ROLE_GATE] Role check - role: ${role}, allowedRoles: ${allowedRoles}, hasAccess: ${hasAccess}`);
          
          setUserRole(role)
          setIsAuthorized(hasAccess)
        } else {
          // No specific role requirements, allow access
          console.log("[ROLE_GATE] No role requirements, allowing access");
          setIsAuthorized(true)
        }
      } catch (error) {
        logAuthError('RoleGate', error, { allowedRoles, requireAdmin })
        setIsAuthorized(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthorization()
  }, [allowedRoles, requireAdmin])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Checking permissions...</span>
      </div>
    )
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          {requireAdmin 
            ? "Only admin users can access this feature." 
            : `You need one of the following roles: ${allowedRoles.join(', ')}`
          }
        </p>
        <p className="text-sm text-gray-500">
          Your current role: {userRole || 'Unknown'}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
    )
  }

  return <>{children}</>
}