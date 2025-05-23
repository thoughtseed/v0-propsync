"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"

interface ShortcutItem {
  key: string
  description: string
  modifier?: "Alt" | "Ctrl" | "Shift" | "Cmd"
}

const SHORTCUTS: ShortcutItem[] = [
  { key: "D", description: "Go to Dashboard", modifier: "Alt" },
  { key: "P", description: "Go to Properties", modifier: "Alt" },
  { key: "A", description: "Add new property", modifier: "Alt" },
  { key: "S", description: "Search", modifier: "Alt" },
  { key: "N", description: "Go to Analytics", modifier: "Alt" },
  { key: "R", description: "Go to Reports", modifier: "Alt" },
  { key: "T", description: "Go to Team", modifier: "Alt" },
  { key: "C", description: "Go to Security", modifier: "Alt" },
  { key: "G", description: "Go to Settings", modifier: "Alt" },
  { key: "K", description: "Open command palette", modifier: "Ctrl" },
  { key: "F", description: "Focus search", modifier: "Ctrl" },
  { key: "?", description: "Show keyboard shortcuts" },
]

export function KeyboardShortcutHelp() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts dialog when pressing ?
      if (e.key === "?" && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          <span>Keyboard Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {SHORTCUTS.map((shortcut) => (
            <div key={`${shortcut.modifier || ""}-${shortcut.key}`} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.modifier && (
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                    {shortcut.modifier}
                  </kbd>
                )}
                <span className="text-xs">+</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                  {shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 border rounded">?</kbd> anytime to show this dialog
        </div>
      </DialogContent>
    </Dialog>
  )
}
