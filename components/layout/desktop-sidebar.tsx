"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Building2, Plus, Search, BarChart3, Settings, Users, FileText, Shield, Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, shortcut: "D" },
  { name: "Properties", href: "/properties", icon: Building2, shortcut: "P" },
  { name: "Add Property", href: "/properties/add", icon: Plus, shortcut: "A" },
  { name: "Search & Filter", href: "/search", icon: Search, shortcut: "S" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, shortcut: "N" },
  { name: "Reports", href: "/reports", icon: FileText, shortcut: "R" },
  { name: "Team", href: "/team", icon: Users, shortcut: "T" },
  { name: "Security", href: "/security", icon: Shield, shortcut: "C" },
  { name: "Settings", href: "/settings", icon: Settings, shortcut: "G" },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showShortcuts, setShowShortcuts] = useState(false)

  const handleNavigation = (href: string) => {
    // Use router.push for client-side navigation
    router.push(href)
  }

  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Alt key is pressed with the shortcut
      if (e.altKey) {
        const navItem = navigation.find((item) => item.shortcut.toLowerCase() === e.key.toLowerCase())
        if (navItem) {
          // Use router.push instead of window.location.href
          router.push(navItem.href)
        }
      }

      // Show shortcuts when holding Alt
      if (e.key === "Alt") {
        setShowShortcuts(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setShowShortcuts(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [router])

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">PropertyHub</h1>
        <p className="text-sm text-gray-500 mt-1">Property Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        <TooltipProvider>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Tooltip key={item.name} delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative w-full text-left",
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{item.name}</span>
                    {showShortcuts && (
                      <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">Alt</span>+{item.shortcut}
                      </kbd>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>
                    {item.name} (Alt+{item.shortcut})
                  </p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <button
            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-full"
            onClick={() => setShowShortcuts(!showShortcuts)}
          >
            <Keyboard className="h-5 w-5 mr-3" />
            <span>{showShortcuts ? "Hide Shortcuts" : "Show Shortcuts"}</span>
          </button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">SC</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
            <p className="text-xs text-gray-500">Property Manager</p>
          </div>
        </div>
      </div>
    </div>
  )
}
