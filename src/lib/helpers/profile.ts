import type { Database } from "../../DatabaseDefinitions"

/**
 * Check if a profile has all required fields filled
 */
export function hasFullProfile(
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null,
): boolean {
  if (!profile) {
    return false
  }
  if (!profile.full_name) {
    return false
  }
  if (!profile.company_name) {
    return false
  }

  return true
}
