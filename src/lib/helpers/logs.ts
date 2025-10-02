import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "$lib/../DatabaseDefinitions"

type LogInsert = Database["public"]["Tables"]["logs"]["Insert"]

interface CreateLogParams {
  supabase: SupabaseClient<Database>
  userId?: string | null
  action: string
  entityType?: string | null
  entityId?: string | null
  ipAddress?: string | null
  metadata?: Record<string, any> | null
}

/**
 * Creates a log entry in the database
 *
 * @param params - Log creation parameters
 * @returns Promise with the created log entry or error
 */
export async function createLog({
  supabase,
  userId = null,
  action,
  entityType = null,
  entityId = null,
  ipAddress = null,
  metadata = null,
}: CreateLogParams) {
  const logEntry: LogInsert = {
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    ip_address: ipAddress,
    metadata: metadata as any,
  }

  const { data, error } = await supabase.from("logs").insert(logEntry).select().single()

  if (error) {
    console.error("Error creating log:", error)
    return { data: null, error }
  }

  return { data, error: null }
}
