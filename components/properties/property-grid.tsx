import { PropertyCard } from "./property-card"

interface Property {
  id: string
  property_reference: string
  building_name: string
  unit_number: string
  property_type: string
  bedrooms: number
  bathrooms: number
  max_occupancy: number
  status: string
  basic_info?: {
    full_address: string
  }[]
  checklist_completion?: {
    overall: number
  }[]
  images?: {
    url: string
  }[]
}

interface PropertyGridProps {
  properties: Property[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No properties found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          reference={property.property_reference || ""}
          name={property.building_name || ""}
          unit={property.unit_number || ""}
          type={property.property_type || ""}
          bedrooms={property.bedrooms || 0}
          bathrooms={property.bathrooms || 0}
          occupancy={property.max_occupancy || 0}
          address={property.basic_info?.[0]?.full_address || ""}
          imageUrl={property.images?.[0]?.url}
          completion={property.checklist_completion?.[0]?.overall || 0}
          status={property.status || ""}
        />
      ))}
    </div>
  )
}
