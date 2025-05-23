"use server"

import { getAdminSupabaseClient } from "@/lib/supabase/server"
import fs from "fs"
import path from "path"

export async function setupAuthTables() {
  try {
    const supabase = getAdminSupabaseClient()

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "lib/supabase/auth-setup.sql")
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL query
    const { error } = await supabase.rpc("exec_sql", { query: sqlQuery })

    if (error) {
      console.error("Error setting up auth tables:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error setting up auth tables:", error)
    return { success: false, error: String(error) }
  }
}
