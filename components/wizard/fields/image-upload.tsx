"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/wizard/fields/form-field"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

interface ImageUploadProps {
  name: string
  label: string
  value: string | undefined
  onChange: (url: string) => void
  description?: string
  required?: boolean
  maxSizeMB?: number
  acceptedTypes?: string[]
}

export function ImageUpload({
  name,
  label,
  value,
  onChange,
  description,
  required = false,
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
}: ImageUploadProps) {
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

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from("properties").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) throw error

      // Get the public URL
      const { data: urlData } = supabase.storage.from("properties").getPublicUrl(filePath)

      onChange(urlData.publicUrl)
      setUploadProgress(100)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to upload image")
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
    <FormField name={name} label={label} description={description} required={required}>
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
    </FormField>
  )
}
