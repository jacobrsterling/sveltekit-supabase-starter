import { redirect } from "@sveltejs/kit"

export const load = async ({ parent, url }) => {
  const parentData = await parent()
  const { supabase, session } = parentData

  if (!session) {
    redirect(303, "/")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(`*, roles(id, name, description, colour)`)
    .eq("id", session.user.id)
    .single()

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  return {
    ...parentData, // Include all parent data (isImpersonating, originalUserEmail, etc.)
    supabase,
    session,
    profile,
    user: session.user,
    amr: aal?.currentAuthenticationMethods,
    userRole: profile?.roles || null,
  }
}