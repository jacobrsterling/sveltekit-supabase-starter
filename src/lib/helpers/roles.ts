import type { Database } from "../../DatabaseDefinitions"

export type Role = Database["public"]["Tables"]["roles"]["Row"]

/**
 * Check if a user has a specific role
 */
export function hasRole(
  role: Role | null | undefined,
  roleName: string,
): boolean {
  if (!role) {
    return false
  }
  return role.name === roleName
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(
  role: Role | null | undefined,
  roleNames: string[],
): boolean {
  if (!role) {
    return false
  }
  return roleNames.includes(role.name)
}

/**
 * Get the role name or a default value
 */
export function getRoleName(
  role: Role | null | undefined,
  defaultValue: string = "No Role",
): string {
  return role?.name || defaultValue
}
