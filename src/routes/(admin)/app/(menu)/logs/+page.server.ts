import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession()
  if (!session) {
    redirect(303, "/")
  }

  // Fetch all logs - TanStack Table will handle pagination and filtering client-side
  const { data: logs, error } = await supabase
    .from("logs")
    .select("*, profiles(full_name, company_name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching logs:", error)
  }

  return {
    logs: logs || [],
  }
}
