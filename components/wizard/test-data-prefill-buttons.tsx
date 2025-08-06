'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { testPropertyTemplates, getTestPropertyTemplate, createRandomizedTestProperty } from '@/lib/utils/test-data-prefill'
import { useWizard } from '@/components/wizard/wizard-context'
import { useState } from 'react'
import { CheckCircle, TestTube, Shuffle, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface TestDataPrefillButtonsProps {
  className?: string
  showInProduction?: boolean
}

export function TestDataPrefillButtons({ className, showInProduction = false }: TestDataPrefillButtonsProps) {
  const { updateFormData, formData } = useWizard()
  const [lastPrefilled, setLastPrefilled] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Hide in production unless explicitly shown
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null
  }

  const handlePrefill = async (templateType: keyof typeof testPropertyTemplates, randomize = false) => {
    setIsLoading(true)
    try {
      const template = randomize 
        ? createRandomizedTestProperty(templateType)
        : getTestPropertyTemplate(templateType)
      
      // Update form data with template
      updateFormData(template)
      setLastPrefilled(template.property_reference || templateType)
      
      console.log('[TEST_PREFILL] Form pre-filled with:', {
        type: templateType,
        randomized: randomize,
        reference: template.property_reference
      })
    } catch (error) {
      console.error('[TEST_PREFILL] Error pre-filling form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearForm = () => {
    updateFormData({})
    setLastPrefilled(null)
    console.log('[TEST_PREFILL] Form data cleared')
  }

  const templateInfo = {
    luxuryCondo: {
      title: 'Luxury Condo',
      description: 'High-end Bangkok condo with premium amenities',
      badge: 'Premium',
      color: 'bg-purple-100 text-purple-800'
    },
    villa: {
      title: 'Beach Villa',
      description: 'Luxury beachfront villa with pool and ocean views',
      badge: 'Luxury',
      color: 'bg-blue-100 text-blue-800'
    },
    apartment: {
      title: 'City Apartment',
      description: 'Compact downtown apartment for business travelers',
      badge: 'Standard',
      color: 'bg-green-100 text-green-800'
    }
  }

  return (
    <Card className={`border-dashed border-2 border-orange-200 bg-orange-50/50 ${className}`}>
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-center gap-2 mb-1">
          <TestTube className="h-4 w-4 text-orange-600" />
          <CardTitle className="text-sm text-orange-800">Test Data</CardTitle>
          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300 px-1.5 py-0.5">
            Dev
          </Badge>
        </div>
        <CardDescription className="text-orange-700 text-xs leading-relaxed">
          Pre-fill forms with test data for debugging.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 px-3 pb-3">
        {lastPrefilled && (
          <Alert className="bg-green-50 border-green-200 py-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <AlertDescription className="text-green-800 text-xs">
              Pre-filled: <strong>{lastPrefilled}</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-2">
          <div className="text-xs font-medium text-orange-800 mb-1">Templates:</div>
          
          {Object.entries(templateInfo).map(([key, info]) => (
            <div key={key} className="p-2 bg-white rounded-lg border border-orange-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 text-sm">{info.title}</span>
                <Badge className={`${info.color} text-xs`}>{info.badge}</Badge>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{info.description}</p>
              
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePrefill(key as keyof typeof testPropertyTemplates)}
                  disabled={isLoading}
                  className="text-xs flex-1 h-7"
                >
                  Use
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePrefill(key as keyof typeof testPropertyTemplates, true)}
                  disabled={isLoading}
                  className="text-xs flex-1 h-7"
                >
                  <Shuffle className="h-3 w-3 mr-1" />
                  Random
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-orange-200">
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearForm}
            className="text-xs text-red-600 border-red-200 hover:bg-red-50 h-7 w-full"
          >
            Clear Form
          </Button>
          
          <div className="flex items-center justify-center gap-1 text-xs text-orange-600">
            <Info className="h-3 w-3" />
            <span>Check console logs</span>
          </div>
        </div>

        {formData.property_reference && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
            <strong>Current:</strong> {formData.property_reference}
            {formData.building_name && ` - ${formData.building_name}`}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TestDataPrefillButtons