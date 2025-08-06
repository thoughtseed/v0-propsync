import { PropertyCard } from "./property-card"

// Updated interface to match the formatted properties from the page component
interface Property {
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

interface PropertyGridProps {
  properties: Property[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function PropertyGrid({ properties, onEdit, onDelete }: PropertyGridProps) {
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
          reference={property.reference}
          name={property.name}
          unit={property.unit}
          type={property.type}
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          occupancy={property.occupancy}
          address={property.address}
          imageUrl={property.imageUrl}
          completion={property.completion}
          status={property.status}
          updatedAt={property.updatedAt}
        />
      ))}
    </div>
  )
}
