"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Bed, Bath, Users, Home, MapPin, Edit, Trash, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

interface PropertyCardProps {
  id: string
  reference: string
  name: string
  unit: string
  type: string | undefined | null
  bedrooms: number
  bathrooms: number
  occupancy: number
  address: string
  imageUrl?: string
  completion: number
  status: string | undefined | null
  updatedAt: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function PropertyCard({
  id,
  reference,
  name,
  unit,
  type,
  bedrooms,
  bathrooms,
  occupancy,
  address,
  imageUrl,
  completion,
  status,
  updatedAt,
  onEdit,
  onDelete,
}: PropertyCardProps) {
  const router = useRouter()
  // Format property type for display
  const formatPropertyType = (type: string | undefined | null) => {
    if (!type) return "Property"

    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Format last updated date
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `${diffInDays}d ago`
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    }
  }

  const handleCardClick = () => {
    router.push(`/properties/${id}`)
  }

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <img
          src={imageUrl || "/placeholder.svg?height=400&width=600&query=luxury property"}
          alt={`${name} ${unit}`}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-gray-600 text-white">
          Last updated {formatLastUpdated(updatedAt)}
        </Badge>
        {(onEdit || onDelete) && (
          <div className="absolute top-2 left-2" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => router.push(`/properties/${id}`)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(id)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <CardContent className="p-4 cursor-pointer" onClick={handleCardClick}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
              <p className="text-sm text-gray-500">Unit {unit}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {formatPropertyType(type)}
            </Badge>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="line-clamp-1">{address}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="flex flex-col items-center">
              <Bed className="h-4 w-4 mb-1" />
              <span className="text-xs">{bedrooms}</span>
            </div>
            <div className="flex flex-col items-center">
              <Bath className="h-4 w-4 mb-1" />
              <span className="text-xs">{bathrooms}</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-4 w-4 mb-1" />
              <span className="text-xs">{occupancy}</span>
            </div>
            <div className="flex flex-col items-center">
              <Home className="h-4 w-4 mb-1" />
              <span className="text-xs">ID</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Checklist Completion</span>
              <span>{completion}%</span>
            </div>
            <Progress value={completion} className="h-1.5" />
          </div>
        </CardContent>

      <CardFooter className="px-4 py-2 bg-gray-50 text-xs text-gray-500 cursor-pointer" onClick={handleCardClick}>Ref: {reference}</CardFooter>
    </Card>
  )
}
