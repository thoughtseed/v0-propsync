"use client"

import { useState } from "react"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { Search, Mail, Phone, Building2, Edit, Trash2, UserPlus } from "lucide-react"

// Mock team data
const teamMembers = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Property Manager",
    email: "sarah.chen@coproperty.com",
    phone: "+66 81 234 5678",
    properties: 12,
    access: "admin",
    avatar: "SC",
  },
  {
    id: "2",
    name: "Michael Roberts",
    role: "Director of Operations",
    email: "michael.roberts@coproperty.com",
    phone: "+66 82 345 6789",
    properties: 24,
    access: "admin",
    avatar: "MR",
  },
  {
    id: "3",
    name: "Tom Wilson",
    role: "Maintenance Supervisor",
    email: "tom.wilson@coproperty.com",
    phone: "+66 83 456 7890",
    properties: 18,
    access: "staff",
    avatar: "TW",
  },
  {
    id: "4",
    name: "Lisa Johnson",
    role: "Property Manager",
    email: "lisa.johnson@coproperty.com",
    phone: "+66 84 567 8901",
    properties: 8,
    access: "manager",
    avatar: "LJ",
  },
  {
    id: "5",
    name: "David Kim",
    role: "Maintenance Staff",
    email: "david.kim@coproperty.com",
    phone: "+66 85 678 9012",
    properties: 15,
    access: "staff",
    avatar: "DK",
  },
]

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const isMobile = useIsMobile()

  // Filter team members based on search query and active tab
  const filteredTeamMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && member.access === activeTab
  })

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team</h1>
            <p className="text-gray-500 mt-1">Manage team members and access permissions</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search team members..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Members</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="manager">Managers</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="readonly">Read-only</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 pt-4">
            {isMobile ? (
              // Mobile view - cards
              <div className="space-y-4">
                {filteredTeamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-medium">{member.avatar}</span>
                          </div>
                          <div>
                            <CardTitle>{member.name}</CardTitle>
                            <CardDescription>{member.role}</CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={
                            member.access === "admin"
                              ? "default"
                              : member.access === "manager"
                                ? "secondary"
                                : member.access === "staff"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {member.access}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{member.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{member.properties} properties</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              // Desktop view - table
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Name</th>
                          <th className="text-left py-3 px-4 font-medium">Role</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Phone</th>
                          <th className="text-center py-3 px-4 font-medium">Properties</th>
                          <th className="text-center py-3 px-4 font-medium">Access Level</th>
                          <th className="text-right py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTeamMembers.map((member) => (
                          <tr key={member.id} className="border-b">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-medium">{member.avatar}</span>
                                </div>
                                <span className="font-medium">{member.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{member.role}</td>
                            <td className="py-3 px-4">{member.email}</td>
                            <td className="py-3 px-4">{member.phone}</td>
                            <td className="py-3 px-4 text-center">{member.properties}</td>
                            <td className="py-3 px-4 text-center">
                              <Badge
                                variant={
                                  member.access === "admin"
                                    ? "default"
                                    : member.access === "manager"
                                      ? "secondary"
                                      : member.access === "staff"
                                        ? "outline"
                                        : "destructive"
                                }
                              >
                                {member.access}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {filteredTeamMembers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No team members found matching your search.</p>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  )
}
