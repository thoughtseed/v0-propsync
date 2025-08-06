"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MobileNavigation } from "./mobile-navigation"
import { DesktopSidebar } from "./desktop-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { KeyboardShortcutHelp } from "@/components/ui/keyboard-shortcut"
import { CommandPalette } from "@/components/ui/command-palette"

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

// function DesktopHeaderActions() {
//   return (
//     <div className="flex items-center space-x-2">
//       <KeyboardShortcutHelp />
//       <Button variant="outline" size="sm">
//         Help
//       </Button>
//       <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
//         <span className="text-white text-sm font-medium">SC</span>
//       </div>
//     </div>
//   )
// }

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()
  const pathname = usePathname()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard"
    if (pathname === "/properties") return "Properties"
    if (pathname.startsWith("/properties/add")) return "Add Property"
    if (pathname.startsWith("/properties/")) return "Property Details"
    if (pathname === "/search") return "Search"
    if (pathname === "/analytics") return "Analytics"
    if (pathname === "/reports") return "Reports"
    if (pathname === "/team") return "Team"
    if (pathname === "/security") return "Security"
    if (pathname === "/settings") return "Settings"
    return "PropertyHub"
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-900">PropertyHub</h1>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">PropertyHub</h2>
          </div>
          <DesktopSidebar />
        </div>

        {/* Mobile Content */}
        <main className="flex-1 overflow-auto pb-16 p-4">{children}</main>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </div>
    )
  }

  return (
    <>
      <CommandPalette />
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 h-screen overflow-y-auto bg-white border-r border-gray-200 fixed left-0 top-0">
          <DesktopSidebar />
        </div>

        {/* Desktop Main Content */}
        <div className="flex-1 flex flex-col md:ml-64">
          {/* Desktop Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
              <div className="flex items-center space-x-4">
                {/* Desktop header actions would go here */}
                {/* <DesktopHeaderActions /> */}
              </div>
            </div>
          </header>

          {/* Desktop Content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </>
  )
}
