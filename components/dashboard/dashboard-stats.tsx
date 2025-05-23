"use client"

import type { Property } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, CheckCircle, Star } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface DashboardStatsProps {
  properties: Property[]
}

export function DashboardStats({ properties }: DashboardStatsProps) {
  const isMobile = useIsMobile()

  const stats = {
    totalProperties: properties.length,
    activeProperties: properties.filter((p) => p.status === "active").length,
    avgOccupancy: Math.round(properties.reduce((acc, p) => acc + p.occupancy_rate, 0) / properties.length),
    avgRating: (properties.reduce((acc, p) => acc + p.avg_rating, 0) / properties.length).toFixed(1),
    avgCompletion: Math.round(
      properties.reduce((acc, p) => acc + p.checklist_completion.overall, 0) / properties.length,
    ),
  }

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      description: `${stats.activeProperties} active`,
    },
    {
      title: "Avg Occupancy",
      value: `${stats.avgOccupancy}%`,
      icon: TrendingUp,
      description: "Last 30 days",
    },
    {
      title: "Avg Rating",
      value: stats.avgRating,
      icon: Star,
      description: "Guest reviews",
    },
    {
      title: "Checklist Progress",
      value: `${stats.avgCompletion}%`,
      icon: CheckCircle,
      description: "Overall completion",
    },
  ]

  return (
    <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"}>
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
            <CardTitle className={`flex items-center ${isMobile ? "text-sm" : "text-base"}`}>
              <stat.icon className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} mr-2 text-blue-600`} />
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? "pt-0" : ""}>
            <div className={`${isMobile ? "text-xl" : "text-2xl"} font-bold text-gray-900`}>{stat.value}</div>
            <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500 mt-1`}>{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
