"use client"

import { useState } from "react"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import { FileText, Download, Calendar, Clock, Plus, Search } from "lucide-react"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("saved")
  const isMobile = useIsMobile()

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500 mt-1">Generate and manage property reports</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="saved" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6 pt-4">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search reports..." className="pl-10" />
              </div>
              <Select defaultValue="recent">
                <SelectTrigger className={isMobile ? "w-full" : "w-[180px]"}>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
              {[
                {
                  title: "Monthly Performance Summary",
                  description: "Overview of all property performance metrics for April 2024",
                  date: "May 1, 2024",
                  type: "PDF",
                },
                {
                  title: "Occupancy Analysis",
                  description: "Detailed occupancy analysis by building and property type",
                  date: "April 15, 2024",
                  type: "Excel",
                },
                {
                  title: "Revenue Breakdown",
                  description: "Revenue breakdown by property with year-over-year comparison",
                  date: "April 10, 2024",
                  type: "PDF",
                },
                {
                  title: "Checklist Completion Report",
                  description: "Status of checklist completion across all properties",
                  date: "April 5, 2024",
                  type: "PDF",
                },
                {
                  title: "Maintenance Schedule",
                  description: "Upcoming maintenance tasks for all properties",
                  date: "April 1, 2024",
                  type: "Excel",
                },
              ].map((report, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      {report.title}
                    </CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Generated: {report.date}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {report.type}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6 pt-4">
            <div className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
              {[
                {
                  title: "Weekly Performance Summary",
                  description: "Sent every Monday at 9:00 AM",
                  recipients: "Operations Team",
                  format: "PDF",
                },
                {
                  title: "Monthly Revenue Report",
                  description: "Sent on the 1st of each month",
                  recipients: "Management, Finance",
                  format: "Excel",
                },
                {
                  title: "Quarterly Occupancy Analysis",
                  description: "Sent on the first day of each quarter",
                  recipients: "Executive Team",
                  format: "PDF + Excel",
                },
              ].map((report, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      {report.title}
                    </CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Recipients:</span>
                        <span>{report.recipients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Format:</span>
                        <span>{report.format}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Disable
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
                <CardDescription>Select parameters to generate a custom report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Title</label>
                  <Input placeholder="Enter report title" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select defaultValue="performance">
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance Summary</SelectItem>
                      <SelectItem value="occupancy">Occupancy Analysis</SelectItem>
                      <SelectItem value="revenue">Revenue Breakdown</SelectItem>
                      <SelectItem value="checklist">Checklist Completion</SelectItem>
                      <SelectItem value="maintenance">Maintenance Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex space-x-4">
                    <Select defaultValue="last-30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-7">Last 7 days</SelectItem>
                        <SelectItem value="last-30">Last 30 days</SelectItem>
                        <SelectItem value="last-90">Last 90 days</SelectItem>
                        <SelectItem value="year-to-date">Year to date</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Properties</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select properties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      <SelectItem value="active">Active Properties</SelectItem>
                      <SelectItem value="building">By Building</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="pdf" name="format" defaultChecked />
                      <label htmlFor="pdf">PDF</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="excel" name="format" />
                      <label htmlFor="excel">Excel</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="both" name="format" />
                      <label htmlFor="both">Both</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Options</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="charts" defaultChecked />
                      <label htmlFor="charts">Include charts and graphs</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="comparison" defaultChecked />
                      <label htmlFor="comparison">Include year-over-year comparison</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="schedule" />
                      <label htmlFor="schedule">Schedule this report to run automatically</label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button variant="outline">Cancel</Button>
                <Button>Generate Report</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  )
}
