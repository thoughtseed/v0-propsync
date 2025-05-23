"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@supabase/supabase-js"

export default function AdminSqlPage() {
  const [sql, setSql] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runSql = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Create admin client
      const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

      // Run the SQL
      const { data, error } = await supabaseAdmin.rpc("run_sql", { sql_query: sql })

      if (error) throw error
      setResult(data)
    } catch (err) {
      console.error("SQL execution error:", err)
      setError(err instanceof Error ? err.message : "Failed to execute SQL")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin SQL Runner</h1>
      <div className="space-y-4">
        <Textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="Enter SQL to run..."
          className="h-40"
        />
        <Button onClick={runSql} disabled={isLoading || !sql.trim()}>
          {isLoading ? "Running..." : "Run SQL"}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-md">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 text-green-800 rounded-md">
            <h3 className="font-bold">Result</h3>
            <pre className="overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
