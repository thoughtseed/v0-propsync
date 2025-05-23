"use client"

import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import { Settings, Bell, Globe, Moon, Sun, Palette, Database, Mail, Cloud } from "lucide-react"

export default function SettingsPage() {
  const isMobile = useIsMobile()

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure your application preferences</p>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure basic application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input defaultValue="Co.Property" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input type="email" defaultValue="info@coproperty.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Phone</label>
                  <Input defaultValue="+66 2 123 4567" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Currency</label>
                  <Select defaultValue="thb">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thb">Thai Baht (฿)</SelectItem>
                      <SelectItem value="usd">US Dollar ($)</SelectItem>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="gbp">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Format</label>
                  <Select defaultValue="dmy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Format</label>
                  <Select defaultValue="24h">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-save</h4>
                    <p className="text-sm text-gray-500">Automatically save changes as you work</p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  Language & Region
                </CardTitle>
                <CardDescription>Configure language and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="th">Thai</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Zone</label>
                  <Select defaultValue="asia_bangkok">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia_bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="asia_singapore">Asia/Singapore (GMT+8)</SelectItem>
                      <SelectItem value="asia_tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="europe_london">Europe/London (GMT+0)</SelectItem>
                      <SelectItem value="america_new_york">America/New_York (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">First Day of Week</label>
                  <Select defaultValue="monday">
                    <SelectTrigger>
                      <SelectValue placeholder="Select first day of week" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-blue-600" />
                  Theme Settings
                </CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Color Theme</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["blue", "purple", "green", "orange"].map((color) => (
                      <div
                        key={color}
                        className={`h-12 rounded-lg border-2 ${
                          color === "blue" ? "border-blue-600" : "border-transparent"
                        } cursor-pointer capitalize flex items-center justify-center`}
                        style={{
                          backgroundColor:
                            color === "blue"
                              ? "#3b82f6"
                              : color === "purple"
                                ? "#8b5cf6"
                                : color === "green"
                                  ? "#10b981"
                                  : "#f97316",
                          color: "white",
                        }}
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Display Mode</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Settings },
                    ].map((mode) => (
                      <div
                        key={mode.id}
                        className={`p-3 rounded-lg border-2 ${
                          mode.id === "light" ? "border-blue-600" : "border-gray-200"
                        } cursor-pointer`}
                      >
                        <div className="flex flex-col items-center">
                          <mode.icon className="h-6 w-6 mb-2" />
                          <span>{mode.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reduced Motion</h4>
                    <p className="text-sm text-gray-500">Minimize animations throughout the interface</p>
                  </div>
                  <Switch id="reduced-motion" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Compact Mode</h4>
                    <p className="text-sm text-gray-500">Reduce spacing to fit more content on screen</p>
                  </div>
                  <Switch id="compact-mode" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Email Notifications</h4>
                    {[
                      {
                        id: "property-added",
                        label: "New property added",
                        description: "When a new property is added to the system",
                      },
                      {
                        id: "checklist-update",
                        label: "Checklist updates",
                        description: "When a property checklist is updated",
                      },
                      {
                        id: "maintenance",
                        label: "Maintenance alerts",
                        description: "When maintenance is scheduled or completed",
                      },
                      {
                        id: "team-changes",
                        label: "Team member changes",
                        description: "When team members are added or roles change",
                      },
                      {
                        id: "security",
                        label: "Security alerts",
                        description: "Important security-related notifications",
                      },
                    ].map((item) => (
                      <div key={item.id} className="flex items-start justify-between">
                        <div>
                          <label htmlFor={`email-${item.id}`} className="font-medium">
                            {item.label}
                          </label>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <Switch id={`email-${item.id}`} defaultChecked={item.id !== "team-changes"} />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">In-App Notifications</h4>
                    {[
                      {
                        id: "property-added",
                        label: "New property added",
                        description: "When a new property is added to the system",
                      },
                      {
                        id: "checklist-update",
                        label: "Checklist updates",
                        description: "When a property checklist is updated",
                      },
                      {
                        id: "maintenance",
                        label: "Maintenance alerts",
                        description: "When maintenance is scheduled or completed",
                      },
                      {
                        id: "team-changes",
                        label: "Team member changes",
                        description: "When team members are added or roles change",
                      },
                      {
                        id: "security",
                        label: "Security alerts",
                        description: "Important security-related notifications",
                      },
                    ].map((item) => (
                      <div key={item.id} className="flex items-start justify-between">
                        <div>
                          <label htmlFor={`inapp-${item.id}`} className="font-medium">
                            {item.label}
                          </label>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <Switch id={`inapp-${item.id}`} defaultChecked />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notification Digest</label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily digest</SelectItem>
                        <SelectItem value="weekly">Weekly digest</SelectItem>
                        <SelectItem value="none">Don't send digests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-600" />
                  Supabase Integration
                </CardTitle>
                <CardDescription>Configure your Supabase database connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Supabase URL</label>
                  <Input defaultValue="https://xyzabcdef.supabase.co" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Supabase API Key</label>
                  <Input type="password" defaultValue="••••••••••••••••••••••••••••••" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Connection Status</h4>
                    <p className="text-sm text-green-600">Connected</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Test Connection
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Connection</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Email Integration
                </CardTitle>
                <CardDescription>Configure email service for notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Service</label>
                  <Select defaultValue="sendgrid">
                    <SelectTrigger>
                      <SelectValue placeholder="Select email service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailchimp">Mailchimp</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                      <SelectItem value="smtp">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input type="password" defaultValue="••••••••••••••••••••••••••••••" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">From Email</label>
                  <Input defaultValue="notifications@coproperty.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">From Name</label>
                  <Input defaultValue="Co.Property Notifications" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Connection Status</h4>
                    <p className="text-sm text-green-600">Connected</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Connection</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                  Storage Integration
                </CardTitle>
                <CardDescription>Configure cloud storage for property images and documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Storage Provider</label>
                  <Select defaultValue="supabase">
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supabase">Supabase Storage</SelectItem>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="cloudinary">Cloudinary</SelectItem>
                      <SelectItem value="firebase">Firebase Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bucket Name</label>
                  <Input defaultValue="property-images" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image Optimization</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-optimize" defaultChecked />
                      <label htmlFor="auto-optimize" className="text-sm">
                        Automatically optimize uploaded images
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-resize" defaultChecked />
                      <label htmlFor="auto-resize" className="text-sm">
                        Resize large images
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Connection Status</h4>
                    <p className="text-sm text-green-600">Connected</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Test Upload
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Connection</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  )
}
