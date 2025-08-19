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
// MVP: RoleGate removed - single admin user has full access
// For beta: restore RoleGate import from components/_archived/auth/role-gate

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

  const handleEdit = () => {
    // Navigate to the property wizard with the property ID for editing
    router.push(`/properties/add?edit=${property.id}`)
  }

  const formatPropertyType = (type: string) => {
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
          <Badge className="bg-gray-600 text-white">
            Last updated {formatLastUpdated(property.updated_at)}
          </Badge>
        </div>

        {/* MVP: Always show Edit/Delete buttons for authenticated users */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
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

            {/* --- Overview --- */}
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
              </div>
            </TabsContent>

            {/* --- Safety --- */}
            <TabsContent value="safety" className="p-4">
              <h2 className="text-xl font-semibold">Safety & Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.smoke_detectors?.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold">Smoke Detectors</h3>
                    <ul className="list-disc pl-5">
                      {property.smoke_detectors.map((detector: any, index: number) => (
                        <li key={index}>
                          {typeof detector === "string"
                            ? detector
                            : `${detector.location}${detector.expiry_date ? ` (Expiry: ${detector.expiry_date})` : ""}`}
                        </li>
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
              </div>
            </TabsContent>

            {/* --- Kitchen --- */}
            <TabsContent value="kitchen" className="p-4">
              <h2 className="text-xl font-semibold">Kitchen & Dining</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.major_appliances?.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold">Major Appliances</h3>
                    <ul className="list-disc pl-5">
                      {property.major_appliances.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {property.small_appliances?.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold">Small Appliances</h3>
                    <ul className="list-disc pl-5">
                      {property.small_appliances.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bedrooms" className="p-4">
              <h2 className="text-xl font-semibold">Bedrooms</h2>
              <p>{property.bedrooms_description || property.description}</p>

              <div className="mt-4 space-y-2">
                <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                <p><strong>Mattress Type:</strong> {property.mattress_type}</p>
                <p><strong>Pillows:</strong> {property.pillow_details}</p>
                <p><strong>Closets & Furniture:</strong> {property.closet_details} {property.furniture_inventory}</p>
                <p><strong>Blackout Curtains:</strong> {property.blackout_curtains}</p>
                <p><strong>Electronics:</strong> {property.bedroom_electronics.join(", ")}</p>
                <p><strong>Amenities:</strong> {property.bedroom_amenities.join(", ")}</p>
                <p><strong>Extra Bedding Location:</strong> {property.extra_bedding_location}</p>
              </div>
            </TabsContent>

            {/* --- Bathrooms --- */}
            <TabsContent value="bathrooms" className="p-4">
              <h2 className="text-xl font-semibold">Bathrooms</h2>
              <p>{property.bathrooms_description || "No bathroom details available."}</p>

              <div className="mt-4 space-y-2">
                <p><strong>Shower/Bath Configuration:</strong> {property.shower_bath_config}</p>
                <p><strong>Towels:</strong> {property.towel_details}</p>
                <p><strong>Toiletries Provided:</strong> {property.toiletries_provided.join(", ")}</p>
                <p><strong>Hair Dryer:</strong> {property.hair_dryer_available ? property.hair_dryer_details : "None"}</p>
                <p><strong>Water Pressure:</strong> {property.water_pressure}</p>
                <p><strong>Hot Water System:</strong> {property.hot_water_system}</p>
                <p><strong>Ventilation:</strong> {property.ventilation}</p>
                <p><strong>Special Features:</strong> {property.bathroom_special_features.join(", ")}</p>
              </div>
            </TabsContent>

            {/* --- Technology --- */}
            <TabsContent value="technology" className="p-4">
              <h2 className="text-xl font-semibold">Technology</h2>
              <div className="mt-4 space-y-2">
                <p><strong>WiFi Network:</strong> {property.wifi_network}</p>
                <p><strong>WiFi Password:</strong> {property.wifi_password}</p>
                <p><strong>Internet Speed:</strong> {property.internet_speed}</p>
                <p><strong>Smart Home Features:</strong> {property.smart_home_features.join(", ")}</p>
                <p><strong>Router Location:</strong> {property.router_location}</p>
                <p><strong>TV Details:</strong> {property.tv_details}</p>
                <p><strong>Streaming Services:</strong> {property.streaming_services}</p>
                <p><strong>Speaker Systems:</strong> {property.speaker_systems}</p>
                <p><strong>Remote Controls:</strong> {property.remote_controls.join(", ")}</p>
                <p><strong>Charging Stations:</strong> {property.charging_stations}</p>
                <p><strong>Backup Solutions:</strong> {property.backup_solutions}</p>
              </div>
            </TabsContent>

            {/* --- Practical --- */}
            <TabsContent value="practical" className="p-4">
              <h2 className="text-xl font-semibold">Practical Information</h2>
              <div className="mt-4 space-y-2">
                <p><strong>Washer:</strong> {property.washer_details}</p>
                <p><strong>Dryer:</strong> {property.dryer_details || "None"}</p>
                <p><strong>Detergent Provided:</strong> {property.detergent_provided ? "Yes" : "No"}</p>
                <p><strong>Iron Board:</strong> {property.iron_board_available ? "Available" : "None"}</p>
                <p><strong>Drying Rack:</strong> {property.drying_rack_location}</p>
                <p><strong>Laundry Basket:</strong> {property.laundry_basket_available ? "Available" : "None"}</p>
                <p><strong>Building Laundry Info:</strong> {property.building_laundry_info}</p>
                <p><strong>Vacuum:</strong> {property.vacuum_details}</p>
                <p><strong>Cleaning Schedule:</strong> {property.cleaning_schedule}</p>
                <p><strong>Special Instructions:</strong> {property.special_instructions}</p>
                <p><strong>AC Units:</strong> {property.ac_units_details}</p>
                <p><strong>Heating System:</strong> {property.heating_system}</p>
                <p><strong>Thermostat Instructions:</strong> {property.thermostat_instructions}</p>
                <p><strong>Ventilation Systems:</strong> {property.ventilation_systems}</p>
              </div>
            </TabsContent>

            {/* --- Location --- */}
            <TabsContent value="location" className="p-4">
              <h2 className="text-xl font-semibold">Location & Lifestyle</h2>
              <div className="mt-4 space-y-2">
                <p>{property.neighborhood_description}</p>
                <p><strong>Nearby Locations:</strong> {property.nearby_locations.map(loc => `${loc.name} (${loc.distance} ${loc.unit})`).join(", ")}</p>
                <p><strong>Restaurants:</strong> {property.restaurants.join(", ")}</p>
                <p><strong>Grocery Shopping:</strong> {property.grocery_shopping}</p>
                <p><strong>Tourist Attractions:</strong> {property.tourist_attractions.join(", ")}</p>
                <p><strong>Emergency Services:</strong> {property.emergency_services}</p>
                <p><strong>Local Tips:</strong> {property.local_tips}</p>
                <p><strong>Weather Patterns:</strong> {property.weather_patterns}</p>
                <p><strong>Walking Score:</strong> {property.walking_score}</p>
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
                  <span>{new Date(property.created_at).toLocaleDateString('en-US')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span>{new Date(property.updated_at).toLocaleDateString('en-US')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}