"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogoutButton } from "@/components/auth/logout-button"
import { Search, BarChart2, FileText, Users, Shield, Settings, Building } from "lucide-react"

const navItems = [
  {
    name: "Properties",
    href: "/properties",
    icon: Building,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Security",
    href: "/security",
    icon: Shield,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex flex-col h-screen w-64 border-r bg-background">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <Building className="h-6 w-6" />
          <span className="text-xl font-bold">Co.Property</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium",
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <LogoutButton variant="outline" className="w-full" />
      </div>
    </div>
  )
}
