"use client"

import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Shield,
  Key,
  Lock,
  UserCog,
  History,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Download,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SecurityPage() {
  const isMobile = useIsMobile()

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security</h1>
          <p className="text-gray-500 mt-1">Manage security settings and access controls</p>
        </div>

        <Tabs defaultValue="access">
          <TabsList>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="passwords">Passwords</TabsTrigger>
            <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="access" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Role-Based Access Control
                </CardTitle>
                <CardDescription>Configure what different user roles can access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      role: "Admin",
                      description: "Full access to all features and settings",
                      permissions: [
                        { name: "View all properties", enabled: true, locked: true },
                        { name: "Add/edit properties", enabled: true, locked: true },
                        { name: "Delete properties", enabled: true, locked: false },
                        { name: "Manage team members", enabled: true, locked: true },
                        { name: "View sensitive data", enabled: true, locked: false },
                        { name: "Access security settings", enabled: true, locked: true },
                      ],
                    },
                    {
                      role: "Manager",
                      description: "Can manage properties but has limited admin access",
                      permissions: [
                        { name: "View all properties", enabled: true, locked: true },
                        { name: "Add/edit properties", enabled: true, locked: false },
                        { name: "Delete properties", enabled: false, locked: false },
                        { name: "Manage team members", enabled: false, locked: true },
                        { name: "View sensitive data", enabled: true, locked: false },
                        { name: "Access security settings", enabled: false, locked: true },
                      ],
                    },
                  ].map((role) => (
                    <div key={role.role} className="border rounded-lg p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">{role.role}</h3>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                      <div className={isMobile ? "space-y-4" : "grid grid-cols-2 gap-4"}>
                        {role.permissions.map((permission) => (
                          <div key={permission.name} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {permission.enabled ? (
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2 text-red-600" />
                              )}
                              <span>{permission.name}</span>
                              {permission.locked && <Lock className="h-3 w-3 ml-2 text-gray-400" />}
                            </div>
                            <Switch checked={permission.enabled} disabled={permission.locked} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCog className="h-5 w-5 mr-2 text-blue-600" />
                  Field-Level Security
                </CardTitle>
                <CardDescription>Control which roles can view sensitive information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      field: "Smart Lock/Key Safe Codes",
                      category: "Safety & Security",
                      visibleTo: ["Admin", "Manager"],
                    },
                    {
                      field: "WiFi Network & Password",
                      category: "Technology",
                      visibleTo: ["Admin", "Manager", "Staff"],
                    },
                    {
                      field: "Utility Companies & Account Numbers",
                      category: "HVAC & Utilities",
                      visibleTo: ["Admin", "Manager"],
                    },
                    {
                      field: "Insurance Details",
                      category: "Administrative",
                      visibleTo: ["Admin"],
                    },
                  ].map((item) => (
                    <div
                      key={item.field}
                      className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{item.field}</h4>
                        <p className="text-sm text-gray-500">Category: {item.category}</p>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        <span className="text-sm mr-3">Visible to:</span>
                        <div className="flex flex-wrap gap-2">
                          {item.visibleTo.map((role) => (
                            <Badge key={role} variant="outline">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Manage Field Security</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="passwords" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2 text-blue-600" />
                  Password Policy
                </CardTitle>
                <CardDescription>Configure password requirements for all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h4 className="font-medium">Minimum Password Length</h4>
                      <p className="text-sm text-gray-500">Require passwords to be at least this many characters</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Input type="number" defaultValue="12" className="w-20" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password Complexity</h4>
                      <p className="text-sm text-gray-500">Require passwords to include various character types</p>
                    </div>
                    <div className="mt-2 md:mt-0 space-y-2">
                      {[
                        { id: "uppercase", label: "Uppercase letters (A-Z)" },
                        { id: "lowercase", label: "Lowercase letters (a-z)" },
                        { id: "numbers", label: "Numbers (0-9)" },
                        { id: "special", label: "Special characters (!@#$%^&*)" },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Switch id={item.id} defaultChecked />
                          <label htmlFor={item.id} className="text-sm">
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password Expiration</h4>
                      <p className="text-sm text-gray-500">Force users to change passwords periodically</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center space-x-3">
                      <Switch id="expiration" defaultChecked />
                      <Input type="number" defaultValue="90" className="w-20" />
                      <span className="text-sm">days</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password History</h4>
                      <p className="text-sm text-gray-500">Prevent reuse of previous passwords</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center space-x-3">
                      <Switch id="history" defaultChecked />
                      <Input type="number" defaultValue="5" className="w-20" />
                      <span className="text-sm">previous passwords</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Password Policy</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="2fa" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Enhance security with two-factor authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Require 2FA for Admin Users</h4>
                      <p className="text-sm text-gray-500">All users with admin privileges must use 2FA</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Switch id="admin-2fa" defaultChecked />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Require 2FA for All Users</h4>
                      <p className="text-sm text-gray-500">All users regardless of role must use 2FA</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Switch id="all-2fa" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">2FA Methods</h4>
                      <p className="text-sm text-gray-500">Select which 2FA methods are allowed</p>
                    </div>
                    <div className="mt-2 md:mt-0 space-y-2">
                      {[
                        { id: "app", label: "Authenticator app" },
                        { id: "sms", label: "SMS text message" },
                        { id: "email", label: "Email" },
                        { id: "security-key", label: "Security key" },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Switch id={item.id} defaultChecked={item.id === "app"} />
                          <label htmlFor={item.id} className="text-sm">
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save 2FA Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-blue-600" />
                  Audit Log
                </CardTitle>
                <CardDescription>Track all security-related actions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search audit log..." className="pl-10" />
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Log
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                          <th className="text-left py-3 px-4 font-medium">User</th>
                          <th className="text-left py-3 px-4 font-medium">Action</th>
                          <th className="text-left py-3 px-4 font-medium">IP Address</th>
                          <th className="text-left py-3 px-4 font-medium">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            timestamp: "2024-05-24 09:32:15",
                            user: "Sarah Chen",
                            action: "Login",
                            ip: "203.45.67.89",
                            details: "Successful login",
                          },
                          {
                            timestamp: "2024-05-24 08:15:22",
                            user: "Michael Roberts",
                            action: "Password Change",
                            ip: "203.45.67.90",
                            details: "User changed their password",
                          },
                          {
                            timestamp: "2024-05-23 16:45:10",
                            user: "Tom Wilson",
                            action: "Failed Login",
                            ip: "203.45.67.91",
                            details: "3 failed attempts",
                            alert: true,
                          },
                          {
                            timestamp: "2024-05-23 14:22:05",
                            user: "Sarah Chen",
                            action: "Role Change",
                            ip: "203.45.67.89",
                            details: "Changed Lisa Johnson from Staff to Manager",
                          },
                          {
                            timestamp: "2024-05-23 11:10:33",
                            user: "System",
                            action: "Backup",
                            ip: "Internal",
                            details: "Automated database backup",
                          },
                        ].map((log, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{log.timestamp}</td>
                            <td className="py-3 px-4">{log.user}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                {log.alert && <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />}
                                {log.action}
                              </div>
                            </td>
                            <td className="py-3 px-4">{log.ip}</td>
                            <td className="py-3 px-4">{log.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  )
}
