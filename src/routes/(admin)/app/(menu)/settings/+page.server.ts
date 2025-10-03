import { redirect, fail } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"
import { canViewSetting, canEditSetting } from "$lib/helpers/settings"

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession()
  if (!session) {
    redirect(303, "/")
  }

  // Get user's profile with role information
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, roles(name)")
    .eq("id", session.user.id)
    .single()

  const userRole = profile?.roles?.name

  // Fetch all settings
  const { data: allSettings, error: settingsError } = await supabase
    .from("settings")
    .select("*")
    .order("group_key", { ascending: true })
    .order("sort_order", { ascending: true })

  if (settingsError) {
    console.error("Error fetching settings:", settingsError)
  }

  // Filter settings based on user's role permissions
  const settings = (allSettings || []).filter((setting) =>
    !setting.is_hidden && canViewSetting(setting, userRole),
  )

  // Fetch all roles for the create/edit forms
  const { data: roles } = await supabase
    .from("roles")
    .select("*")
    .order("name", { ascending: true })

  return {
    settings: settings || [],
    roles: roles || [],
    userRole,
  }
}

export const actions: Actions = {
  updateSetting: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/")
    }

    const formData = await request.formData()
    const settingId = formData.get("settingId") as string
    const value = formData.get("value") as string
    const label = formData.get("label") as string
    const description = formData.get("description") as string

    if (!settingId) {
      return fail(400, {
        errorMessage: "Setting ID is required",
      })
    }

    // Get user's profile with role information
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, roles(name)")
      .eq("id", session.user.id)
      .single()

    const userRole = profile?.roles?.name

    // Get the setting to check permissions
    const { data: setting } = await supabase
      .from("settings")
      .select("*")
      .eq("id", settingId)
      .single()

    if (!setting) {
      return fail(404, {
        errorMessage: "Setting not found",
      })
    }

    // Check if user can edit this setting
    if (!canEditSetting(setting, userRole)) {
      return fail(403, {
        errorMessage: "You do not have permission to edit this setting",
      })
    }

    // Check if setting is readonly
    if (setting.is_readonly) {
      return fail(403, {
        errorMessage: "This setting is read-only",
      })
    }

    // Parse value based on input_type
    let parsedValue: any = value

    try {
      switch (setting.input_type) {
        case "number":
          parsedValue = value ? Number(value) : null
          break
        case "boolean":
          parsedValue = value === "on" || value === "true"
          break
        case "json":
          parsedValue = value ? JSON.parse(value) : null
          break
        case "multiselect":
          // Handle multiple values from form
          const allValues = formData.getAll("value")
          parsedValue = allValues.length > 0 ? allValues : null
          break
        default:
          parsedValue = value || null
      }
    } catch (error) {
      return fail(400, {
        errorMessage: "Invalid value format for this setting type",
        settingId,
      })
    }

    // Validate against validation rules if present
    if (setting.validation) {
      const validation = setting.validation as any

      if (validation.required && !parsedValue) {
        return fail(400, {
          errorMessage: "This setting is required",
          settingId,
        })
      }

      if (validation.min !== undefined && parsedValue < validation.min) {
        return fail(400, {
          errorMessage: `Value must be at least ${validation.min}`,
          settingId,
        })
      }

      if (validation.max !== undefined && parsedValue > validation.max) {
        return fail(400, {
          errorMessage: `Value must be at most ${validation.max}`,
          settingId,
        })
      }

      if (validation.pattern && typeof parsedValue === "string") {
        const regex = new RegExp(validation.pattern)
        if (!regex.test(parsedValue)) {
          return fail(400, {
            errorMessage: "Value does not match the required pattern",
            settingId,
          })
        }
      }
    }

    // Build update object - only update fields that are provided
    const updateData: any = {
      value: parsedValue,
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    }

    // If label is provided, update it (from edit dialog)
    if (label !== null && label !== undefined) {
      updateData.label = label
    }

    // If description is provided, update it (from edit dialog)
    if (description !== null && description !== undefined) {
      updateData.description = description || null
    }

    // Update the setting
    const { error } = await supabase
      .from("settings")
      .update(updateData)
      .eq("id", settingId)

    if (error) {
      console.error("Error updating setting:", error)
      return fail(500, {
        errorMessage: "Failed to update setting",
        settingId,
      })
    }

    return {
      success: true,
      settingId,
    }
  },

  createSetting: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/")
    }

    // Get user's profile with role information
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, roles(name)")
      .eq("id", session.user.id)
      .single()

    const userRole = profile?.roles?.name

    // Only admins can create settings
    if (userRole !== "admin") {
      return fail(403, {
        errorMessage: "Only admins can create new settings",
      })
    }

    const formData = await request.formData()
    const key = formData.get("key") as string
    const label = formData.get("label") as string
    const description = formData.get("description") as string
    const inputType = formData.get("inputType") as string
    const groupKey = formData.get("groupKey") as string
    const defaultValue = formData.get("defaultValue") as string
    const viewRoles = formData.getAll("viewRoles") as string[]
    const editRoles = formData.getAll("editRoles") as string[]

    // Validation
    if (!key || !label || !inputType || !groupKey) {
      return fail(400, {
        errorMessage: "Key, label, input type, and group are required",
        formData: Object.fromEntries(formData),
      })
    }

    // Check if key already exists
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", key)
      .single()

    if (existing) {
      return fail(400, {
        errorMessage: "A setting with this key already exists",
        formData: Object.fromEntries(formData),
      })
    }

    // Parse default value based on input type
    let parsedDefaultValue: any = defaultValue

    try {
      switch (inputType) {
        case "number":
          parsedDefaultValue = defaultValue ? Number(defaultValue) : null
          break
        case "boolean":
          parsedDefaultValue = defaultValue === "true"
          break
        case "json":
          parsedDefaultValue = defaultValue ? JSON.parse(defaultValue) : null
          break
        default:
          parsedDefaultValue = defaultValue || null
      }
    } catch (error) {
      return fail(400, {
        errorMessage: "Invalid default value format for this input type",
        formData: Object.fromEntries(formData),
      })
    }

    // Create the setting
    const { error } = await supabase
      .from("settings")
      .insert({
        key,
        label,
        description: description || null,
        input_type: inputType,
        group_key: groupKey,
        default_value: parsedDefaultValue,
        value: parsedDefaultValue, // Initialize value with default
        view_roles: viewRoles.length > 0 ? viewRoles : ["admin"],
        edit_roles: editRoles.length > 0 ? editRoles : ["admin"],
        updated_by: session.user.id,
      })

    if (error) {
      console.error("Error creating setting:", error)
      return fail(500, {
        errorMessage: "Failed to create setting: " + error.message,
        formData: Object.fromEntries(formData),
      })
    }

    return {
      success: true,
      message: "Setting created successfully",
    }
  },

  deleteSetting: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/")
    }

    // Get user's profile with role information
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, roles(name)")
      .eq("id", session.user.id)
      .single()

    const userRole = profile?.roles?.name

    // Only admins can delete settings
    if (userRole !== "admin") {
      return fail(403, {
        errorMessage: "Only admins can delete settings",
      })
    }

    const formData = await request.formData()
    const settingId = formData.get("settingId") as string

    if (!settingId) {
      return fail(400, {
        errorMessage: "Setting ID is required",
      })
    }

    const { error } = await supabase
      .from("settings")
      .delete()
      .eq("id", settingId)

    if (error) {
      console.error("Error deleting setting:", error)
      return fail(500, {
        errorMessage: "Failed to delete setting",
      })
    }

    return {
      success: true,
      message: "Setting deleted successfully",
    }
  },
}
