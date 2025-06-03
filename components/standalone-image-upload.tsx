"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

interface StandaloneImageUploadProps {
  label: string
  value: string | undefined
  onChange: (url: string) => void
  description?: string
  required?: boolean
  maxSizeMB?: number
  acceptedTypes?: string[]
}

export function StandaloneImageUpload({
  label,
  value,
  onChange,
  description,
  required = false,
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
}: StandaloneImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = getSupabaseClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setUploadError(`Invalid file type. Accepted types: ${acceptedTypes.join(", ")}`)
      return
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setUploadError(`File size exceeds the maximum allowed size (${maxSizeMB}MB)`)
      return
    }

    setIsUploading(true)
    setUploadError(null)
    setUploadProgress(0)

    try {
      // Generate a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `property-images/${fileName}`

      // Check authentication status before upload
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("Authentication required to upload images")
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from("properties").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Supabase storage error:", JSON.stringify(error))
        throw error
      }

      // Get the public URL
      const { data: urlData } = supabase.storage.from("properties").getPublicUrl(filePath)

      onChange(urlData.publicUrl)
      setUploadProgress(100)
    } catch (error) {
      console.error("Upload error:", JSON.stringify(error, null, 2))
      
      // Handle different types of errors with more specific error messages
      if (error instanceof Error) {
        setUploadError(error.message)
      } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as Record<string, any>
        if (errorObj.message) {
          // Check for RLS policy errors, which likely means storage setup is needed
          if (errorObj.message.includes("row-level security policy")) {
            setUploadError(`Storage policy error: Ensure storage policies are configured (${errorObj.statusCode || 'unknown'})`)
          } else {
            setUploadError(errorObj.message)
          }
        } else if (errorObj.error_description) {
          setUploadError(errorObj.error_description)
        } else if (errorObj.statusText) {
          setUploadError(`${errorObj.statusText} (${errorObj.status || 'unknown status'})`)
        } else {
          setUploadError(`Upload failed: ${JSON.stringify(errorObj)}`)
        }
      } else {
        setUploadError("Failed to upload image. Check console for details.")
      }
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes.join(",")}
        className="hidden"
      />

      {value ? (
        <div className="relative">
          <img src={value || "/placeholder.svg"} alt={label} className="w-full h-64 object-cover rounded-md" />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={triggerFileInput}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-2" />
              <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <div>
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">Drag and drop an image here, or click to browse</p>
              <Button type="button" variant="outline" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Select Image
              </Button>
            </div>
          )}
        </div>
      )}

      {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  )
}
