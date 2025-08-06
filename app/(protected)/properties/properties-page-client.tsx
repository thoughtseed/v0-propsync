"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PropertyGrid } from "@/components/properties/property-grid"
import { PropertyTable } from "@/components/properties/property-table"
import { SwipeablePropertyCard } from "@/components/properties/swipeable-property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Filter } from "lucide-react"
import Link from "next/link"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { ViewSwitcher } from "@/components/properties/view-switcher"
import { deleteProperty } from "@/app/actions/property-actions"
import { toast } from "@/hooks/use-toast"

// Define the property interface to match the component requirements
interface FormattedProperty {
  id: string
  reference: string
  name: string
  unit: string
  type: string
  bedrooms: number
  bathrooms: number
  occupancy: number
  address: string
  imageUrl?: string
  completion: number
  status: string
  createdAt: string
  updatedAt: string
}

interface PropertiesPageClientProps {
  properties: FormattedProperty[]
}

export function PropertiesPageClient({ properties }: PropertiesPageClientProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return
    }

    setIsDeleting(propertyId)
    try {
      const result = await deleteProperty(propertyId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Property deleted successfully.",
        })
        // Refresh the page to show updated data
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete property.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the property.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEdit = (propertyId: string) => {
    router.push(`/properties/${propertyId}/edit`)
  }

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Properties</h1>
          {/* MVP: Always show Add Property button for authenticated users */}
          <Link href="/properties/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search properties..." className="pl-8" />
          </div>

          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden md:flex">
              <ViewSwitcher />
            </div>
          </div>
        </div>

        {/* Mobile View - Always use swipeable cards */}
        <div className="md:hidden space-y-4">
          {properties.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <p className="text-gray-500">No properties found</p>
              {/* MVP: Always show Add New Property button for authenticated users */}
              <Link href="/properties/add">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Property
                </Button>
              </Link>
            </div>
          ) : (
            properties.map((property) => (
              <SwipeablePropertyCard
                key={property.id}
                id={property.id}
                name={property.name}
                unit={property.unit}
                address={property.address}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                occupancy={property.occupancy}
                imageUrl={property.imageUrl}
                completion={property.completion}
                status={property.status}
                updatedAt={property.updatedAt}
                onEdit={() => handleEdit(property.id)}
                onDelete={() => handleDelete(property.id)}
              />
            ))
          )}
        </div>

        {/* Desktop View - Grid or Table based on tab selection */}
        <div className="hidden md:block">
          <div data-tab="grid">
            <PropertyGrid 
              properties={properties} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
          <div data-tab="table" className="hidden">
            <PropertyTable 
              properties={properties} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}