"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bed, Bath, Users, Home, MapPin } from "lucide-react"

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
}: PropertyCardProps) {
  // Format property type for display
  const formatPropertyType = (type: string | undefined | null) => {
    if (!type) return "Property"

    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get status badge color
  const getStatusColor = (status: string | undefined | null) => {
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

  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg?height=400&width=600&query=luxury property"}
            alt={`${name} ${unit}`}
            className="w-full h-full object-cover"
          />
          <Badge className={`absolute top-2 right-2 ${getStatusColor(status)}`}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
          </Badge>
        </div>

        <CardContent className="p-4">
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

        <CardFooter className="px-4 py-2 bg-gray-50 text-xs text-gray-500">Ref: {reference}</CardFooter>
      </Card>
    </Link>
  )
}
