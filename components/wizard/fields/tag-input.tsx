"use client"

import { useState, type KeyboardEvent } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[]
  allowCustom?: boolean
  placeholder?: string
  icon?: string
  maxTags?: number
}

export function TagInput({
  value = [],
  onChange,
  suggestions = [],
  allowCustom = true,
  placeholder = "Add tag...",
  icon,
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag])
      setInputValue("")
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const filteredSuggestions = suggestions.filter(
    (suggestion) => !value.includes(suggestion) && suggestion.toLowerCase().includes(inputValue.toLowerCase()),
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 bg-white border border-gray-200 rounded-md min-h-[80px]">
        {value.map((tag) => (
          <div key={tag} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
            {icon && <span className="mr-1">{icon}</span>}
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <div className="flex-1 min-w-[120px]">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ""}
            className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          <ul className="py-1">
            {filteredSuggestions.slice(0, 5).map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => addTag(suggestion)}
                  className="flex items-center w-full px-3 py-1 text-left text-sm hover:bg-gray-100"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {value.length >= maxTags && <p className="text-xs text-amber-600">Maximum of {maxTags} tags reached</p>}
    </div>
  )
}
