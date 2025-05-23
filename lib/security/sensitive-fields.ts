// Fields that must NEVER appear in public interfaces
export const INTERNAL_ONLY_FIELDS = ["wifi_password", "smart_lock_code", "utility_accounts", "listing_credentials"]

// Function to sanitize data before displaying to users
export function sanitizePropertyData(data: any, userRole: string) {
  // Clone the data to avoid mutating the original
  const sanitizedData = { ...data }

  // Only admins and managers can see sensitive fields
  if (userRole !== "admin" && userRole !== "manager") {
    INTERNAL_ONLY_FIELDS.forEach((field) => {
      if (field in sanitizedData) {
        delete sanitizedData[field]
      }

      // Also check nested objects
      Object.keys(sanitizedData).forEach((key) => {
        if (typeof sanitizedData[key] === "object" && sanitizedData[key] !== null) {
          if (field in sanitizedData[key]) {
            delete sanitizedData[key][field]
          }
        }
      })
    })
  }

  return sanitizedData
}

// Function to check if a user can view sensitive fields
export function canViewSensitiveFields(userRole: string): boolean {
  return userRole === "admin" || userRole === "manager"
}

// Function to mask sensitive data for display (e.g., "********")
export function maskSensitiveData(value: string): string {
  if (!value) return ""
  if (value.length <= 4) return "*".repeat(4)
  return value.substring(0, 2) + "*".repeat(value.length - 4) + value.slice(-2)
}
