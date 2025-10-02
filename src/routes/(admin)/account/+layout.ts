import { redirect } from "@sveltejs/kit"
import type { Database } from "../../../DatabaseDefinitions.js"
import { CreateProfileStep } from "../../../config"

export const load = async ({ parent, url }) => {
  const { supabase, session } = await parent()

  if (!session) {
    redirect(303, "/")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", session.user.id)
    .single()

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  const createProfilePath = "/account/create_profile"
  const signOutPath = "/account/sign_out"
  if (
    profile &&
    !_hasFullProfile(profile) &&
    url.pathname !== createProfilePath &&
    url.pathname !== signOutPath &&
    CreateProfileStep
  ) {
    redirect(303, createProfilePath)
  }

  return {
    supabase,
    session,
    profile,
    user: session.user,
    amr: aal?.currentAuthenticationMethods,
  }
}

export const _hasFullProfile = (
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null,
) => {
  if (!profile) {
    return false
  }
  if (!profile.full_name) {
    return false
  }
  if (!profile.company_name) {
    return false
  }
  if (!profile.website) {
    return false
  }

  return true
}