import { notFound } from "next/navigation"
import { getServerSupabaseClient } from "@/lib/supabase/server"
import { PropertyDetailClientPage } from "./property-detail-client-page"

export const dynamic = "force-dynamic"

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getServerSupabaseClient()

  const { data: property, error } = await supabase
    .from("properties_complete")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !property) {
    console.error("Error fetching property:", error)
    return notFound()
  }

  return <PropertyDetailClientPage property={property} />
}
