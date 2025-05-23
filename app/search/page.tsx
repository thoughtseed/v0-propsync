"use client"

import { useState } from "react"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { PropertyCard } from "@/components/properties/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import { Search, X, Filter, Building2, Bed, Bath, Users, DollarSign } from "lucide-react"
import type { Property } from "@/lib/types"

// Reuse the mock data from the properties page
const mockProperties: Property[] = [
  // ... same mock data as in properties/page.tsx
]

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Property[]>(mockProperties)
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useIsMobile()

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search & Filter</h1>
          <p className="text-gray-500 mt-1">Find properties that match your criteria</p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by building name, address, or property ID..."
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className={isMobile ? "space-y-6" : "flex gap-6"}>
          {/* Filters sidebar */}
          <Card className={isMobile ? "w-full" : "w-80 shrink-0"}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Building filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Building</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="All Buildings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Buildings</SelectItem>
                    <SelectItem value="noble-remix">Noble Remix</SelectItem>
                    <SelectItem value="ashton-asoke">Ashton Asoke</SelectItem>
                    <SelectItem value="park-24">Park 24</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property type filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="luxury-condo">Luxury Condo</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Bed className="h-4 w-4 mr-2" />
                  Bedrooms
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, "5+"].map((num) => (
                    <Button key={num} variant="outline" size="sm" className="flex-1 font-normal">
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bathrooms filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Bath className="h-4 w-4 mr-2" />
                  Bathrooms
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, "4+"].map((num) => (
                    <Button key={num} variant="outline" size="sm" className="flex-1 font-normal">
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Max occupancy filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Max Occupancy
                </label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="2">Up to 2</SelectItem>
                    <SelectItem value="4">Up to 4</SelectItem>
                    <SelectItem value="6">Up to 6</SelectItem>
                    <SelectItem value="8">Up to 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Revenue band filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Revenue Band
                </label>
                <div className="space-y-2">
                  {["budget", "mid-range", "luxury", "ultra-luxury"].map((band) => (
                    <div key={band} className="flex items-center space-x-2">
                      <Checkbox id={band} />
                      <label htmlFor={band} className="text-sm capitalize">
                        {band}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size range filter */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Size Range (sqm)</label>
                <Slider defaultValue={[30, 150]} min={0} max={300} step={10} />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>30 sqm</span>
                  <span>150 sqm</span>
                </div>
              </div>

              {/* Status filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="space-y-2">
                  {["active", "maintenance", "inactive"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox id={status} defaultChecked={status === "active"} />
                      <label htmlFor={status} className="text-sm capitalize">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist completion filter */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Checklist Completion</label>
                <Slider defaultValue={[0]} min={0} max={100} step={5} />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>

          {/* Search results */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">
                {searchResults.length} {searchResults.length === 1 ? "property" : "properties"} found
              </h2>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="rating-high">Highest Rating</SelectItem>
                  <SelectItem value="rating-low">Lowest Rating</SelectItem>
                  <SelectItem value="occupancy-high">Highest Occupancy</SelectItem>
                  <SelectItem value="completion-high">Highest Completion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"}
            >
              {searchResults.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}
