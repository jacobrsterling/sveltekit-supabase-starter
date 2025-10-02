import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

const ITEMS_PER_PAGE = 50

export const load: PageServerLoad = async ({
  url,
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession()
  if (!session) {
    redirect(303, "/")
  }

  // Get query parameters
  const page = parseInt(url.searchParams.get("page") || "1")
  const search = url.searchParams.get("search") || ""

  const offset = (page - 1) * ITEMS_PER_PAGE

  // Build query - use inner join with profiles
  let query = supabase
    .from("logs")
    .select("*, profiles(full_name, company_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1)

  // Apply search filter if provided
  if (search) {
    query = query.or(`action.ilike.%${search}%,entity_type.ilike.%${search}%`)
  }

  const { data: logs, error, count } = await query

  if (error) {
    console.error("Error fetching logs:", error)
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

  return {
    logs: logs || [],
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: count || 0,
      itemsPerPage: ITEMS_PER_PAGE,
    },
    search,
  }
}
