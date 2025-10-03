import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../DatabaseDefinitions"

export type Setting = Database["public"]["Tables"]["settings"]["Row"]

/**
 * Get a setting value by key
 * Returns the default_value if the setting is not found or has no value
 */
export async function getSetting<T = any>(
  supabase: SupabaseClient<Database>,
  key: string,
): Promise<T | null> {
  const { data, error } = await supabase
    .from("settings")
    .select("value, default_value")
    .eq("key", key)
    .single()

  if (error || !data) {
    return null
  }

  // Return value if it exists, otherwise default_value
  return (data.value ?? data.default_value) as T
}

/**
 * Get multiple settings by keys
 * Returns a map of key -> value
 */
export async function getSettings(
  supabase: SupabaseClient<Database>,
  keys: string[],
): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from("settings")
    .select("key, value, default_value")
    .in("key", keys)

  if (error || !data) {
    return {}
  }

  return data.reduce(
    (acc, setting) => {
      acc[setting.key] = setting.value ?? setting.default_value
      return acc
    },
    {} as Record<string, any>,
  )
}

/**
 * Check if a user can view a setting based on their role
 */
export function canViewSetting(
  setting: Setting,
  userRoleName: string | null | undefined,
): boolean {
  if (!setting.view_roles || setting.view_roles.length === 0) {
    return true // No restrictions
  }

  if (!userRoleName) {
    return false // User has no role
  }

  return setting.view_roles.includes(userRoleName)
}

/**
 * Check if a user can edit a setting based on their role
 */
export function canEditSetting(
  setting: Setting,
  userRoleName: string | null | undefined,
): boolean {
  if (!setting.edit_roles || setting.edit_roles.length === 0) {
    return true // No restrictions
  }

  if (!userRoleName) {
    return false // User has no role
  }

  return setting.edit_roles.includes(userRoleName)
}

/**
 * Get the appropriate input component props based on input_type
 */
export function getInputProps(setting: Setting) {
  const baseProps = {
    type: "text",
    placeholder: setting.description || "",
  }

  switch (setting.input_type) {
    case "number":
      return { ...baseProps, type: "number" }
    case "boolean":
      return { type: "checkbox" }
    case "date":
      return { ...baseProps, type: "date" }
    case "color":
      return { ...baseProps, type: "color" }
    case "textarea":
      return { ...baseProps, type: "textarea" }
    case "select":
    case "multiselect":
      return { type: "select", multiple: setting.input_type === "multiselect" }
    case "json":
      return { ...baseProps, type: "textarea" }
    default:
      return baseProps
  }
}

/**
 * Parse and validate a setting value based on its type
 */
export function parseSettingValue(value: string, inputType: string): any {
  switch (inputType) {
    case "number":
      return Number(value)
    case "boolean":
      return value === "true" || value === "on"
    case "json":
      try {
        return JSON.parse(value)
      } catch {
        throw new Error("Invalid JSON format")
      }
    case "multiselect":
      return Array.isArray(value) ? value : [value]
    default:
      return value
  }
}

/**
 * Format a setting value for display
 */
export function formatSettingValue(value: any, inputType: string): string {
  if (value === null || value === undefined) {
    return ""
  }

  switch (inputType) {
    case "boolean":
      return value ? "Yes" : "No"
    case "json":
    case "multiselect":
      return JSON.stringify(value, null, 2)
    default:
      return String(value)
  }
}

/**
 * Format group key for display (capitalize and replace underscores with spaces)
 */
export function formatGroupKey(groupKey: string): string {
  return groupKey
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Group settings by their group_key
 */
export function groupSettings(settings: Setting[]): Record<string, Setting[]> {
  return settings.reduce(
    (acc, setting) => {
      const groupKey = setting.group_key || "general"
      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(setting)
      return acc
    },
    {} as Record<string, Setting[]>,
  )
}

/**
 * Sort settings within their group by sort_order
 */
export function sortSettings(settings: Setting[]): Setting[] {
  return settings.sort((a, b) => {
    const orderA = a.sort_order ?? 0
    const orderB = b.sort_order ?? 0
    return orderA - orderB
  })
}
