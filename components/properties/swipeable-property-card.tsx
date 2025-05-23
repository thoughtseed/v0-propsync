"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bed, Bath, Users, MapPin, Edit, Trash, Star, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface SwipeablePropertyCardProps {
  id: string
  name: string
  unit: string
  address: string
  bedrooms: number
  bathrooms: number
  occupancy: number
  imageUrl?: string
  completion: number
  status: string
  onEdit?: () => void
  onDelete?: () => void
}

export function SwipeablePropertyCard({
  id,
  name,
  unit,
  address,
  bedrooms,
  bathrooms,
  occupancy,
  imageUrl,
  completion,
  status,
  onEdit,
  onDelete,
}: SwipeablePropertyCardProps) {
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)
  const currentX = useRef(0)
  const [isSwiping, setIsSwiping] = useState(false)

  // Get status badge color
  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-500"

    switch (status) {
      case "active":
        return "bg-green-500"
      case "maintenance":
        return "bg-amber-500"
      case "inactive":
        return "bg-gray-500"
      case "pending":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    currentX.current = startX.current
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return

    currentX.current = e.touches[0].clientX
    const diff = currentX.current - startX.current

    // Limit swiping to left only and max -200px
    if (diff < 0 && diff > -200) {
      setOffset(diff)
    }
  }

  const handleTouchEnd = () => {
    setIsSwiping(false)

    // If swiped more than 100px, keep it open
    if (offset < -100) {
      setOffset(-150)
    } else {
      setOffset(0)
    }
  }

  const handleCardClick = () => {
    if (offset === 0) {
      router.push(`/properties/${id}`)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOffset(0)
    if (onEdit) onEdit()
    else router.push(`/properties/${id}/edit`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOffset(0)
    if (onDelete) onDelete()
  }

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/properties/${id}`)
  }

  return (
    <div className="relative overflow-hidden touch-manipulation">
      {/* Actions behind the card */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4">
        <button
          onClick={handleView}
          className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          onClick={handleEdit}
          className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>

      {/* Card */}
      <Card
        className={cn("bg-white transition-transform", isSwiping ? "" : "transition-all duration-300")}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        <div className="flex items-center p-3 border-b">
          <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={imageUrl || "/placeholder.svg?height=200&width=200&query=property"}
              alt={`${name} ${unit}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 truncate">{name}</h3>
                <p className="text-sm text-gray-500">Unit {unit}</p>
              </div>
              <Badge className={getStatusColor(status)}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
              </Badge>
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{address}</span>
            </div>
          </div>
        </div>

        <div className="p-3">
          <div className="flex justify-between mb-3">
            <div className="flex items-center text-xs">
              <Bed className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>{bedrooms} bed</span>
            </div>
            <div className="flex items-center text-xs">
              <Bath className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>{bathrooms} bath</span>
            </div>
            <div className="flex items-center text-xs">
              <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>{occupancy} guests</span>
            </div>
            <div className="flex items-center text-xs">
              <Star className="h-3.5 w-3.5 mr-1 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Checklist</span>
              <span>{completion}%</span>
            </div>
            <Progress value={completion} className="h-1.5" />
          </div>
        </div>
      </Card>
    </div>
  )
}
