'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Clock, Database, Search, RefreshCw } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { WizardFormData } from '@/lib/types/wizard-types'

interface TestWorkflowValidatorProps {
  className?: string
  propertyId?: string
  expectedData?: WizardFormData
}

type ValidationResult = {
  table: string
  status: 'success' | 'error' | 'pending'
  message: string
  data?: any
  error?: string
}

export function TestWorkflowValidator({ className, propertyId, expectedData }: TestWorkflowValidatorProps) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [lastValidation, setLastValidation] = useState<Date | null>(null)

  // Hide in production
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const validateBackendData = async () => {
    if (!propertyId) {
      setValidationResults([{
        table: 'validation',
        status: 'error',
        message: 'No property ID provided for validation',
        error: 'Property ID is required'
      }])
      return
    }

    setIsValidating(true)
    setValidationResults([])
    const results: ValidationResult[] = []
    const supabase = getSupabaseClient()

    try {
      // Validate main properties table
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()

      if (propertyError) {
        results.push({
          table: 'properties',
          status: 'error',
          message: 'Failed to fetch property data',
          error: propertyError.message
        })
      } else {
        results.push({
          table: 'properties',
          status: 'success',
          message: `Property found: ${propertyData.building_name || 'N/A'} - ${propertyData.unit_number || 'N/A'}`,
          data: propertyData
        })
      }

      // Validate property_basic_info table
      const { data: basicInfoData, error: basicInfoError } = await supabase
        .from('property_basic_info')
        .select('*')
        .eq('property_id', propertyId)
        .single()

      if (basicInfoError) {
        results.push({
          table: 'property_basic_info',
          status: 'error',
          message: 'Failed to fetch basic info data',
          error: basicInfoError.message
        })
      } else {
        results.push({
          table: 'property_basic_info',
          status: 'success',
          message: `Basic info found: ${basicInfoData.bedrooms || 0} bed, ${basicInfoData.bathrooms || 0} bath`,
          data: basicInfoData
        })
      }

      // Validate property_safety table
      const { data: safetyData, error: safetyError } = await supabase
        .from('property_safety')
        .select('*')
        .eq('property_id', propertyId)
        .single()

      if (safetyError) {
        results.push({
          table: 'property_safety',
          status: 'error',
          message: 'Failed to fetch safety data',
          error: safetyError.message
        })
      } else {
        results.push({
          table: 'property_safety',
          status: 'success',
          message: `Safety data found: ${safetyData.smoke_detectors?.length || 0} smoke detectors`,
          data: safetyData
        })
      }

      // Validate property_kitchen table
      const { data: kitchenData, error: kitchenError } = await supabase
        .from('property_kitchen')
        .select('*')
        .eq('property_id', propertyId)
        .single()

      if (kitchenError) {
        results.push({
          table: 'property_kitchen',
          status: 'error',
          message: 'Failed to fetch kitchen data',
          error: kitchenError.message
        })
      } else {
        results.push({
          table: 'property_kitchen',
          status: 'success',
          message: `Kitchen data found: ${kitchenData.major_appliances?.length || 0} major appliances`,
          data: kitchenData
        })
      }

      // Validate property_technology table
      const { data: technologyData, error: technologyError } = await supabase
        .from('property_technology')
        .select('*')
        .eq('property_id', propertyId)
        .single()

      if (technologyError) {
        results.push({
          table: 'property_technology',
          status: 'error',
          message: 'Failed to fetch technology data',
          error: technologyError.message
        })
      } else {
        results.push({
          table: 'property_technology',
          status: 'success',
          message: `Technology data found: WiFi ${technologyData.wifi_network ? 'configured' : 'not configured'}`,
          data: technologyData
        })
      }

      // Validate property_images table
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)

      if (imagesError) {
        results.push({
          table: 'property_images',
          status: 'error',
          message: 'Failed to fetch images data',
          error: imagesError.message
        })
      } else {
        results.push({
          table: 'property_images',
          status: 'success',
          message: `Images found: ${imagesData.length} image records`,
          data: imagesData
        })
      }

    } catch (error) {
      results.push({
        table: 'validation',
        status: 'error',
        message: 'Validation process failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    setValidationResults(results)
    setLastValidation(new Date())
    setIsValidating(false)

    // Log detailed results for debugging
    console.log('[TEST_VALIDATION] Backend validation results:', {
      propertyId,
      timestamp: new Date().toISOString(),
      results: results.map(r => ({ table: r.table, status: r.status, message: r.message }))
    })
  }

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const successCount = validationResults.filter(r => r.status === 'success').length
  const errorCount = validationResults.filter(r => r.status === 'error').length
  const totalCount = validationResults.length

  return (
    <Card className={`border-dashed border-2 border-blue-200 bg-blue-50/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg text-blue-800">Backend Validation</CardTitle>
          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
            Development Only
          </Badge>
        </div>
        <CardDescription className="text-blue-700">
          Verify that form data was correctly saved to all database tables.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={validateBackendData}
            disabled={isValidating || !propertyId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isValidating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {isValidating ? 'Validating...' : 'Validate Backend Data'}
          </Button>
          
          {propertyId && (
            <div className="text-xs text-blue-700">
              Property ID: <code className="bg-blue-100 px-1 rounded">{propertyId}</code>
            </div>
          )}
        </div>

        {!propertyId && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-800">
              Complete the property creation workflow to get a property ID for validation.
            </AlertDescription>
          </Alert>
        )}

        {lastValidation && (
          <div className="text-xs text-gray-500">
            Last validation: {lastValidation.toLocaleTimeString()}
          </div>
        )}

        {validationResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">{successCount} Success</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700">{errorCount} Errors</span>
              </div>
              <div className="text-gray-500">{totalCount} Total</div>
            </div>

            <div className="space-y-2">
              {validationResults.map((result, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(result.status)}
                    <span className="font-medium text-sm">{result.table}</span>
                  </div>
                  <p className="text-xs">{result.message}</p>
                  {result.error && (
                    <p className="text-xs mt-1 font-mono bg-red-50 p-1 rounded">{result.error}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TestWorkflowValidator