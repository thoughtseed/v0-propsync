import { notFound } from "next/navigation"
import { getServerSupabaseClient } from "@/lib/supabase/server"
import { PropertyDetailClientPage } from "./property-detail-client-page"

export const dynamic = "force-dynamic"

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getServerSupabaseClient()

  const { data: property, error } = await supabase
    .from("properties")
    .select(
      `
      *,
      basic_info:property_basic_info(*),
      safety:property_safety(*),
      kitchen:property_kitchen(*),
      bedrooms:property_bedrooms(*),
      bathrooms:property_bathrooms(*),
      technology:property_technology(*),
      practical:property_practical(*),
      location:property_location(*),
      accessibility:property_accessibility(*),
      images:property_images(*),
      checklist_completion(*)
    `
    )
    .eq("id", params.id)
    .single()

  if (error || !property) {
    console.error("Error fetching property:", error)
    return notFound()
  }

  return <PropertyDetailClientPage property={property} />
}
