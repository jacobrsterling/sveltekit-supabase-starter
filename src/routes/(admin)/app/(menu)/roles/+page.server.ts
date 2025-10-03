import { redirect, fail } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession()
  if (!session) {
    redirect(303, "/")
  }

  // Fetch all roles
  const { data: roles, error: rolesError } = await supabase
    .from("roles")
    .select("*")
    .order("name", { ascending: true })

  if (rolesError) {
    console.error("Error fetching roles:", rolesError)
  }

  return {
    roles: roles || [],
  }
}

export const actions: Actions = {
  updateRoleColour: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/")
    }

    const formData = await request.formData()
    const roleId = formData.get("roleId") as string
    const colour = formData.get("colour") as string

    if (!roleId || !colour) {
      return fail(400, {
        errorMessage: "Role ID and colour are required",
      })
    }

    // Validate hex colour format
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/
    if (!hexColorRegex.test(colour)) {
      return fail(400, {
        errorMessage: "Invalid colour format. Must be a hex colour (e.g., #FF5733)",
      })
    }

    const { error } = await supabase
      .from("roles")
      .update({ colour })
      .eq("id", roleId)

    if (error) {
      console.error("Error updating role colour:", error)
      return fail(500, {
        errorMessage: "Failed to update role colour",
      })
    }

    return {
      success: true,
    }
  },
}
