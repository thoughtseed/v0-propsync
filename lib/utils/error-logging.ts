/**
 * Comprehensive error logging utilities for debugging
 */

export interface ErrorContext {
  component?: string
  function?: string
  userId?: string
  userEmail?: string
  userRole?: string
  action?: string
  data?: any
  url?: string
  timestamp?: string
}

export interface DetailedError {
  message: string
  stack?: string
  name?: string
  cause?: any
  context?: ErrorContext
}

/**
 * Enhanced error logging with detailed context
 */
export function logDetailedError(
  error: Error | string,
  context: ErrorContext = {},
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) {
  const timestamp = new Date().toISOString()
  const errorObj: DetailedError = {
    message: typeof error === 'string' ? error : error.message,
    stack: typeof error === 'object' ? error.stack : undefined,
    name: typeof error === 'object' ? error.name : 'CustomError',
    cause: typeof error === 'object' ? error.cause : undefined,
    context: {
      ...context,
      timestamp,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    }
  }

  // Console logging with severity-based styling
  const severityStyles = {
    low: 'color: #666; background: #f0f0f0',
    medium: 'color: #ff6600; background: #fff3e0',
    high: 'color: #ff0000; background: #ffe0e0',
    critical: 'color: #ffffff; background: #cc0000; font-weight: bold'
  }

  console.group(`%c🚨 ERROR [${severity.toUpperCase()}] - ${errorObj.name}`, severityStyles[severity])
  console.error('Message:', errorObj.message)
  
  if (errorObj.stack) {
    console.error('Stack:', errorObj.stack)
  }
  
  if (errorObj.context) {
    console.error('Context:', errorObj.context)
  }
  
  if (errorObj.cause) {
    console.error('Cause:', errorObj.cause)
  }
  
  console.groupEnd()

  // Return structured error for potential external logging services
  return errorObj
}

/**
 * Log authentication/authorization errors
 */
export function logAuthError(
  functionName: string,
  error: Error | string,
  context: Partial<ErrorContext> = {}
) {
  return logDetailedError(error, {
    ...context,
    component: 'Authentication',
    function: functionName
  }, 'high')
}

/**
 * Log property operation errors
 */
export function logPropertyError(
  operation: string,
  error: Error | string,
  context: Partial<ErrorContext> = {}
) {
  return logDetailedError(error, {
    ...context,
    component: 'Property',
    action: operation
  }, 'medium')
}

/**
 * Log database operation errors
 */
export function logDatabaseError(
  operation: string,
  error: Error | string,
  context: Partial<ErrorContext> = {}
) {
  return logDetailedError(error, {
    ...context,
    component: 'Database',
    action: operation
  }, 'high')
}

/**
 * Log API errors with request details
 */
export function logApiError(
  endpoint: string,
  method: string,
  error: Error | string,
  context: Partial<ErrorContext> = {}
) {
  return logDetailedError(error, {
    ...context,
    component: 'API',
    action: `${method} ${endpoint}`
  }, 'medium')
}

/**
 * Log UI/Component errors
 */
export function logComponentError(
  componentName: string,
  error: Error | string,
  context: Partial<ErrorContext> = {}
) {
  return logDetailedError(error, {
    ...context,
    component: componentName
  }, 'low')
}

/**
 * Log validation errors
 */
export function logValidationError(
  field: string,
  error: Error | string,
  context: Partial<ErrorContext> = {}
) {
  return logDetailedError(error, {
    ...context,
    component: 'Validation',
    action: `Field: ${field}`
  }, 'low')
}

/**
 * Create a toast error with logging
 */
export function createErrorToast(
  title: string,
  error: Error | string,
  context: Partial<ErrorContext> = {},
  showToUser: boolean = true
) {
  const errorDetails = logDetailedError(error, context, 'medium')
  
  if (showToUser && typeof window !== 'undefined') {
    // If you have a toast library, integrate it here
    console.warn('Toast would show:', title, errorDetails.message)
    
    // Example integration with react-hot-toast or similar:
    // toast.error(`${title}: ${errorDetails.message}`)
  }
  
  return errorDetails
}

/**
 * Performance logging for slow operations
 */
export function logPerformanceIssue(
  operation: string,
  duration: number,
  threshold: number = 1000,
  context: Partial<ErrorContext> = {}
) {
  if (duration > threshold) {
    return logDetailedError(
      `Slow operation detected: ${operation} took ${duration}ms (threshold: ${threshold}ms)`,
      {
        ...context,
        component: 'Performance',
        action: operation,
        data: { duration, threshold }
      },
      duration > threshold * 2 ? 'high' : 'medium'
    )
  }
}

/**
 * Network error logging
 */
export function logNetworkError(
  url: string,
  method: string,
  status?: number,
  error?: Error | string,
  context: Partial<ErrorContext> = {}
) {
  return logDetailedError(
    error || `Network error: ${method} ${url} ${status ? `(${status})` : ''}`,
    {
      ...context,
      component: 'Network',
      action: `${method} ${url}`,
      data: { status }
    },
    status && status >= 500 ? 'high' : 'medium'
  )
}

/**
 * Helper to wrap async functions with error logging
 */
export function withErrorLogging<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  functionName: string,
  component: string = 'Unknown'
) {
  return async (...args: T): Promise<R> => {
    try {
      const startTime = performance.now()
      const result = await fn(...args)
      const duration = performance.now() - startTime
      
      logPerformanceIssue(functionName, duration, 1000, {
        component,
        function: functionName
      })
      
      return result
    } catch (error) {
      logDetailedError(error as Error, {
        component,
        function: functionName,
        data: args
      }, 'high')
      throw error
    }
  }
}

/**
 * Debug helper to log function entry/exit
 */
export function debugLog(
  functionName: string,
  phase: 'enter' | 'exit',
  data?: any,
  component: string = 'Debug'
) {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString()
    console.log(
      `%c🔍 [${component}] ${functionName} - ${phase.toUpperCase()}`,
      'color: #0066cc; background: #e6f3ff',
      {
        timestamp,
        data
      }
    )
  }
}