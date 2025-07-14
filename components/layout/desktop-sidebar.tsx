// Desktop sidebar component
// Conditionally render admin links based on user role

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  BarChart3,
  LayoutGrid,
  Settings,
  Search,
  Shield,
  FileText,
  Users,
  Home,
  ChevronDown,
  Database,
  Terminal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/auth/logout-button"
import { UserProfile } from "@/components/auth/user-profile"
import { ScrollArea } from "@/components/ui/scroll-area"

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
}

type NavSection = {
  title: string
  items: NavItem[]
}

export function DesktopSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    admin: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Define navigation sections
  const mainNav: NavSection = {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "Properties",
        href: "/properties",
        icon: <LayoutGrid className="h-5 w-5" />,
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        title: "Reports",
        href: "/reports",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: "Search",
        href: "/search",
        icon: <Search className="h-5 w-5" />,
      },
      {
        title: "Team",
        href: "/team",
        icon: <Users className="h-5 w-5" />,
      },
    ],
  }

  const adminNav: NavSection = {
    title: "Admin",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: <Settings className="h-5 w-5" />,
      },
      {
        title: "Security",
        href: "/security",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "SQL Console",
        href: "/admin/sql",
        icon: <Terminal className="h-5 w-5" />,
      },
      {
        title: "Database Setup",
        href: "/admin/setup",
        icon: <Database className="h-5 w-5" />,
      },
    ],
  }

  // Show admin navigation only for admin or staff users
  const isAdmin = userRole === "admin" || userRole === "staff"

  // Render nav item
  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
          isActive
            ? "bg-accent text-accent-foreground"
            : "hover:bg-muted hover:text-foreground",
        )}
      >
        {item.icon}
        <span>{item.title}</span>
      </Link>
    )
  }

  // Render nav section
  const NavSection = ({ section }: { section: NavSection }) => {
    const isAdminSection = section.title === "Admin"
    const isOpen = openSections[section.title.toLowerCase()] !== false

    return (
      <div className="pb-4">
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center justify-between py-1 px-4",
            isAdminSection ? "text-orange-600 hover:text-orange-700" : "",
          )}
          onClick={() => toggleSection(section.title.toLowerCase())}
        >
          <span className="font-medium text-sm">{section.title}</span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          />
        </Button>
        {isOpen && (
          <div className="mt-1 pl-2 space-y-1">
            {section.items.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-4">
        <Link href="/">
          <h1 className="text-lg font-semibold tracking-tight">PropSync</h1>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2">
        <NavSection section={mainNav} />
        {isAdmin && <NavSection section={adminNav} />}
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <UserProfile />
        <LogoutButton />
      </div>
    </div>
  )
}
