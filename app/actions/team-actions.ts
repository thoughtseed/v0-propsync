"use server"

import { generateInitials } from "@/lib/utils/name-utils"
import { getAdminSupabaseClient } from "@/lib/supabase/server"

/**
 * Fetches team members from the database with property counts
 * Falls back to mock data if there's an error or no database connection
 */
export async function getTeamMembers() {
  try {
    // Use admin client to bypass RLS policies and avoid infinite recursion
    const supabase = getAdminSupabaseClient()
    
    // 1. Fetch users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, full_name, email, created_at')
    
    if (userError || !users || users.length === 0) {
      console.error("Error fetching users or no users found:", userError)
      return getFallbackTeamMembers() // Fall back to mock data
    }

    // 2. Get property counts for each user
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('user_id')
    
    // Calculate property counts per user
    const propertyCounts: Record<string, number> = {}
    if (properties) {
      properties.forEach((prop: { user_id: string }) => {
        propertyCounts[prop.user_id] = (propertyCounts[prop.user_id] || 0) + 1
      })
    }
    
    // 3. Format data for the team page
    return users.map((user: any) => ({
      id: user.id,
      name: user.full_name,
      role: "Property Manager", // Everyone is a Property Manager in the simplified system
      email: user.email,
      phone: "+66 8X XXX XXXX", // Placeholder since we don't have phone numbers
      properties: propertyCounts[user.id] || 0,
      access: "user", // All users have the same access level now
      avatar: generateInitials(user.full_name),
      createdAt: user.created_at
    }))
  } catch (error) {
    console.error("Failed to fetch team members:", error)
    // Fall back to mock data if there's an error
    return getFallbackTeamMembers()
  }
}

/**
 * Provides mock team data as a fallback
 */
function getFallbackTeamMembers() {
  return [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Property Manager",
      email: "sarah.chen@coproperty.com",
      phone: "+66 81 234 5678",
      properties: 12,
      access: "user",
      avatar: "SC",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Michael Roberts",
      role: "Property Manager",
      email: "michael.roberts@coproperty.com",
      phone: "+66 82 345 6789",
      properties: 24,
      access: "user",
      avatar: "MR",
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      name: "Tom Wilson",
      role: "Property Manager",
      email: "tom.wilson@coproperty.com",
      phone: "+66 83 456 7890",
      properties: 18,
      access: "user",
      avatar: "TW",
      createdAt: new Date().toISOString()
    },
    {
      id: "4",
      name: "Lisa Johnson",
      role: "Property Manager",
      email: "lisa.johnson@coproperty.com",
      phone: "+66 84 567 8901",
      properties: 8,
      access: "user",
      avatar: "LJ",
      createdAt: new Date().toISOString()
    },
    {
      id: "5",
      name: "David Kim",
      role: "Property Manager",
      email: "david.kim@coproperty.com",
      phone: "+66 85 678 9012",
      properties: 15,
      access: "user",
      avatar: "DK",
      createdAt: new Date().toISOString()
    }
  ]
}
