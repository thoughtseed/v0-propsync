import { getTeamMembers } from "@/app/actions/team-actions"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { TeamPageClient } from "@/components/team/team-page-client"
import { Suspense } from "react"

export default async function TeamPage() {
  // Fetch team members from Supabase database
  const teamMembers = await getTeamMembers()

  return (
    <ResponsiveLayout>
      <Suspense fallback={<TeamLoadingState />}>
        <TeamPageClient initialMembers={teamMembers} />
      </Suspense>
    </ResponsiveLayout>
  )
}

// Loading state component
function TeamLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 w-80 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}
