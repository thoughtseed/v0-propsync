import React from "react"
import { getServerSupabaseClient } from "@/lib/supabase/server"

export default async function Test() {
  const supabase = getServerSupabaseClient();

  const { data, error } = await supabase.from("properties_complete").select("*").limit(1);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
