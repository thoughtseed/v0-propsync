"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isCurrentUserAdminClient } from "@/lib/utils/auth-utils-client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Home,
  Building2,
  Plus,
  Search,
  BarChart3,
  Settings,
  Users,
  FileText,
  Shield,
  LogOut,
  HelpCircle,
  User,
  Bell,
  Moon,
} from "lucide-react"

interface CommandPaletteItem {
  icon: React.ElementType
  name: string
  shortcut?: string
  action: () => void
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    async function checkAdminStatus() {
      const adminStatus = await isCurrentUserAdminClient()
      setIsAdmin(adminStatus)
    }
    checkAdminStatus()
  }, [])

  const baseCommands: CommandPaletteItem[] = [
    {
      icon: Home,
      name: "Go to Dashboard",
      shortcut: "D",
      action: () => {
        router.push("/")
        setOpen(false)
      },
    },
    {
      icon: Building2,
      name: "Go to Properties",
      shortcut: "P",
      action: () => {
        router.push("/properties")
        setOpen(false)
      },
    },
  ]

  const adminCommands: CommandPaletteItem[] = [
    {
      icon: Plus,
      name: "Add New Property",
      shortcut: "A",
      action: () => {
        router.push("/properties/add")
        setOpen(false)
      },
    },
  ]

  const otherCommands: CommandPaletteItem[] = [
    {
      icon: Search,
      name: "Search Properties",
      shortcut: "S",
      action: () => {
        router.push("/search")
        setOpen(false)
      },
    },
    {
      icon: BarChart3,
      name: "Go to Analytics",
      shortcut: "N",
      action: () => {
        router.push("/analytics")
        setOpen(false)
      },
    },
    {
      icon: FileText,
      name: "Go to Reports",
      shortcut: "R",
      action: () => {
        router.push("/reports")
        setOpen(false)
      },
    },
    {
      icon: Users,
      name: "Go to Team",
      shortcut: "T",
      action: () => {
        router.push("/team")
        setOpen(false)
      },
    },
    {
      icon: Shield,
      name: "Go to Security",
      shortcut: "C",
      action: () => {
        router.push("/security")
        setOpen(false)
      },
    },
    {
      icon: Settings,
      name: "Go to Settings",
      shortcut: "G",
      action: () => {
        router.push("/settings")
        setOpen(false)
      },
    },
    {
      icon: User,
      name: "View Profile",
      action: () => {
        router.push("/profile")
        setOpen(false)
      },
    },
    {
      icon: Bell,
      name: "Notifications",
      action: () => {
        router.push("/notifications")
        setOpen(false)
      },
    },
    {
      icon: Moon,
      name: "Toggle Dark Mode",
      action: () => {
        // Toggle dark mode logic would go here
        setOpen(false)
      },
    },
    {
      icon: HelpCircle,
      name: "Help & Support",
      action: () => {
        router.push("/help")
        setOpen(false)
      },
    },
    {
      icon: LogOut,
      name: "Sign Out",
      action: () => {
        // Sign out logic would go here
        setOpen(false)
      },
    },
  ]

  // Combine commands based on user role
  const commands: CommandPaletteItem[] = [
    ...baseCommands,
    ...(isAdmin ? adminCommands : []),
    ...otherCommands,
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 gap-0 max-w-xl">
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                {commands.slice(0, 9).map((command) => (
                  <CommandItem
                    key={command.name}
                    onSelect={command.action}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <command.icon className="h-4 w-4" />
                    <span>{command.name}</span>
                    {command.shortcut && (
                      <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">Alt</span>+{command.shortcut}
                      </kbd>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Actions">
                {commands.slice(9).map((command) => (
                  <CommandItem
                    key={command.name}
                    onSelect={command.action}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <command.icon className="h-4 w-4" />
                    <span>{command.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
