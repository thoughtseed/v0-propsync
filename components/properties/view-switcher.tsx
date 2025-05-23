"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"

export function ViewSwitcher() {
  const [view, setView] = useState("grid")

  useEffect(() => {
    // Show/hide the appropriate view
    const gridView = document.querySelector('[data-tab="grid"]')
    const tableView = document.querySelector('[data-tab="table"]')

    if (gridView && tableView) {
      if (view === "grid") {
        gridView.classList.remove("hidden")
        tableView.classList.add("hidden")
      } else {
        gridView.classList.add("hidden")
        tableView.classList.remove("hidden")
      }
    }
  }, [view])

  return (
    <div className="flex rounded-md shadow-sm">
      <Button
        variant={view === "grid" ? "default" : "outline"}
        size="icon"
        className="rounded-r-none"
        onClick={() => setView("grid")}
        aria-label="Grid view"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "table" ? "default" : "outline"}
        size="icon"
        className="rounded-l-none"
        onClick={() => setView("table")}
        aria-label="Table view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
