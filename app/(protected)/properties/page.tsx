import { getServerSupabaseClient } from "@/lib/supabase/server"
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
}

export const dynamic = "force-dynamic"

export default async function PropertiesPage() {
  const supabase = await getServerSupabaseClient()

  // Fetch properties from the new properties_complete table
  const { data: properties, error } = await supabase
    .from("properties_complete")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching properties:", error)
    return (
      <ResponsiveLayout>
        <div className="p-4 bg-red-50 text-red-500 rounded-md">Error loading properties. Please try again later.</div>
      </ResponsiveLayout>
    )
  }

  // Format properties for our components with proper typing
  const formattedProperties: FormattedProperty[] = (properties || []).map((property) => ({
    id: property.id,
    reference: property.property_reference,
    name: property.building_name,
    unit: property.unit_number,
    type: property.property_type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    occupancy: property.max_occupancy,
    address: property.full_address || "Address not available",
    imageUrl: property.primary_photo,
    completion: property.overall_completion || 0,
    status: property.status,
    createdAt: property.created_at,
  }))

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Properties</h1>
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden md:flex">
              <ViewSwitcher />
            </div>
          </div>
        </div>

        {/* Mobile View - Always use swipeable cards */}
        <div className="md:hidden space-y-4">
          {formattedProperties.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <p className="text-gray-500">No properties found</p>
              <Link href="/properties/add">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Property
                </Button>
              </Link>
            </div>
          ) : (
            formattedProperties.map((property) => (
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
              />
            ))
          )}
        </div>

        {/* Desktop View - Grid or Table based on tab selection */}
        <div className="hidden md:block">
          <div data-tab="grid">
            <PropertyGrid properties={formattedProperties} />
          </div>
          <div data-tab="table" className="hidden">
            <PropertyTable properties={formattedProperties} />
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}
