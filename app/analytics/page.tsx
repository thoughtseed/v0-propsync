"use client"

import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { useIsMobile } from "@/hooks/use-mobile"
import { BarChart, LineChart, PieChart } from "@/components/analytics/charts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, TrendingUp, Building2, DollarSign, Star } from "lucide-react"

export default function AnalyticsPage() {
  const isMobile = useIsMobile()

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">Track performance metrics across your properties</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select defaultValue="30d">
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key metrics */}
        <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-4 gap-6"}>
          {[
            { title: "Occupancy Rate", value: "87%", icon: TrendingUp, change: "+5%" },
            { title: "Total Revenue", value: "฿1.2M", icon: DollarSign, change: "+12%" },
            { title: "Avg. Rating", value: "4.8", icon: Star, change: "+0.2" },
            { title: "Active Properties", value: "24", icon: Building2, change: "+3" },
          ].map((metric) => (
            <Card key={metric.title}>
              <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
                <CardTitle className={`flex items-center ${isMobile ? "text-sm" : "text-base"}`}>
                  <metric.icon className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} mr-2 text-blue-600`} />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? "pt-0" : ""}>
                <div className={`${isMobile ? "text-xl" : "text-2xl"} font-bold text-gray-900`}>{metric.value}</div>
                <p
                  className={`${isMobile ? "text-xs" : "text-sm"} ${
                    metric.change.startsWith("+") ? "text-green-600" : "text-red-600"
                  } mt-1 flex items-center`}
                >
                  {metric.change}
                  <span className="text-gray-500 ml-1">vs. previous period</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="relative">
          <Tabs defaultValue="occupancy">
            <TabsList>
              <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
              <TabsTrigger value="checklist">Checklist Completion</TabsTrigger>
            </TabsList>

          <TabsContent value="occupancy" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rate Over Time</CardTitle>
                <CardDescription>Average occupancy rate across all properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart />
                </div>
              </CardContent>
            </Card>

            <div className={isMobile ? "space-y-6" : "grid grid-cols-2 gap-6"}>
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy by Building</CardTitle>
                  <CardDescription>Compare occupancy rates across buildings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <BarChart />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Occupancy by Property Type</CardTitle>
                  <CardDescription>Compare occupancy rates by property type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <PieChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Total revenue across all properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart />
                </div>
              </CardContent>
            </Card>

            <div className={isMobile ? "space-y-6" : "grid grid-cols-2 gap-6"}>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Building</CardTitle>
                  <CardDescription>Compare revenue across buildings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <BarChart />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Property Type</CardTitle>
                  <CardDescription>Compare revenue by property type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <PieChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs would follow the same pattern */}
        </Tabs>
        </div>

        {/* Top performing properties */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>Properties with the highest occupancy and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Property</th>
                    <th className="text-left py-3 px-4 font-medium">Building</th>
                    <th className="text-right py-3 px-4 font-medium">Occupancy</th>
                    <th className="text-right py-3 px-4 font-medium">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      property: "Noble Remix 772/621",
                      building: "Noble Remix",
                      occupancy: "92%",
                      revenue: "฿85,000",
                      rating: "4.9",
                    },
                    {
                      property: "Ashton Asoke 1205",
                      building: "Ashton Asoke",
                      occupancy: "89%",
                      revenue: "฿92,000",
                      rating: "4.8",
                    },
                    {
                      property: "The Line Asoke 3301",
                      building: "The Line Asoke",
                      occupancy: "87%",
                      revenue: "฿78,000",
                      rating: "4.7",
                    },
                    {
                      property: "Park 24 1810",
                      building: "Park 24",
                      occupancy: "85%",
                      revenue: "฿65,000",
                      rating: "4.6",
                    },
                    {
                      property: "Rhythm Sukhumvit 2205",
                      building: "Rhythm Sukhumvit",
                      occupancy: "83%",
                      revenue: "฿72,000",
                      rating: "4.5",
                    },
                  ].map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{item.property}</td>
                      <td className="py-3 px-4">{item.building}</td>
                      <td className="py-3 px-4 text-right">{item.occupancy}</td>
                      <td className="py-3 px-4 text-right">{item.revenue}</td>
                      <td className="py-3 px-4 text-right">{item.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <ComingSoonOverlay 
          title="Analytics Coming Soon"
          description="Advanced analytics and reporting features are currently under development. Stay tuned for comprehensive insights into your property performance."
        />
      </div>
    </ResponsiveLayout>
  )
}
