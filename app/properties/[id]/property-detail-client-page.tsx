"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { deleteProperty } from "@/app/actions/property-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash, Home, Bed, Bath, Users, Calendar } from "lucide-react"

// Define a type for the property to pass from server to client
type Property = any // Replace with a more specific type if available

export function PropertyDetailClientPage({ property }: { property: Property }) {
  const router = useRouter()

  if (!property) {
    return <div>Property not found.</div>
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      const result = await deleteProperty(property.id)
      if (result.success) {
        alert("Property deleted successfully.")
        router.push("/properties")
      } else {
        alert(`Failed to delete property: ${result.error}`)
      }
    }
  }

  const formatPropertyType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getStatusColor = (status: string) => {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/properties">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {property.building_name} - Unit {property.unit_number}
          </h1>
          <Badge className={getStatusColor(property.status)}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={property.primary_photo || "/placeholder.svg?height=600&width=1200&query=luxury property"}
              alt={`${property.building_name} ${property.unit_number}`}
              className="w-full h-full object-cover"
            />
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-4 md:grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
              <TabsTrigger value="bedrooms">Bedrooms</TabsTrigger>
              <TabsTrigger value="bathrooms">Bathrooms</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="practical">Practical</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Property Description</h2>
                <p>{property.description || "No description available."}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Home className="h-5 w-5 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{formatPropertyType(property.property_type)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Bed className="h-5 w-5 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="font-medium">{property.bedrooms}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Bath className="h-5 w-5 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-medium">{property.bathrooms}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Users className="h-5 w-5 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Max Occupancy</p>
                      <p className="font-medium">{property.max_occupancy}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <p>{property.full_address || "Address not available"}</p>
                </div>

                {property.year_built && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Building Information</h3>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Year Built</p>
                        <p>{property.year_built}</p>
                      </div>
                      {property.year_renovated && (
                        <div>
                          <p className="text-sm text-gray-500">Year Renovated</p>
                          <p>{property.year_renovated}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="safety" className="p-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Safety & Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.smoke_detectors && property.smoke_detectors.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold">Smoke Detectors</h3>
                      <ul className="list-disc pl-5">
                        {property.smoke_detectors.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {property.fire_extinguisher_location && (
                    <div>
                      <h3 className="text-md font-semibold">Fire Extinguisher</h3>
                      <p>Location: {property.fire_extinguisher_location}</p>
                      {property.fire_extinguisher_expiry && (
                        <p>Expiry: {property.fire_extinguisher_expiry}</p>
                      )}
                    </div>
                  )}
                  
                  {property.door_lock_type && (
                    <div>
                      <h3 className="text-md font-semibold">Security</h3>
                      <p>Door Lock Type: {property.door_lock_type}</p>
                      {property.building_security && (
                        <p>Building Security: {property.building_security}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="kitchen" className="p-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Kitchen & Dining</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.major_appliances && property.major_appliances.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold">Major Appliances</h3>
                      <ul className="list-disc pl-5">
                        {property.major_appliances.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {property.small_appliances && property.small_appliances.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold">Small Appliances</h3>
                      <ul className="list-disc pl-5">
                        {property.small_appliances.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {property.dining_capacity && (
                    <div>
                      <h3 className="text-md font-semibold">Dining</h3>
                      <p>Capacity: {property.dining_capacity} people</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completion Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Basic Information</span>
                    <span className="text-sm font-medium">{property.basic_information_completion}%</span>
                  </div>
                  <Progress value={property.basic_information_completion} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Safety & Security</span>
                    <span className="text-sm font-medium">{property.safety_security_completion}%</span>
                  </div>
                  <Progress value={property.safety_security_completion} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Kitchen & Dining</span>
                    <span className="text-sm font-medium">{property.kitchen_dining_completion}%</span>
                  </div>
                  <Progress value={property.kitchen_dining_completion} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Bedrooms</span>
                    <span className="text-sm font-medium">{property.bedrooms_completion}%</span>
                  </div>
                  <Progress value={property.bedrooms_completion} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Overall Completion</span>
                    <span className="text-sm font-medium">{property.overall_completion}%</span>
                  </div>
                  <Progress value={property.overall_completion} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference</span>
                  <span>{property.property_reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span>{new Date(property.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 