"use client"
import { usePathname, useRouter } from "next/navigation"
import { Home, Building2, Plus, Search, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Add", href: "/properties/add", icon: Plus },
  { name: "Search", href: "/search", icon: Search },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (href: string) => {
    // Use router.push for client-side navigation
    router.push(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-10">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-h-[44px] min-w-[44px]",
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
