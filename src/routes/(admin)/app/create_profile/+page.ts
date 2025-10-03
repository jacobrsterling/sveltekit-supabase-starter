import { hasFullProfile } from "$lib/helpers/profile"
import { redirect } from "@sveltejs/kit"

export async function load({ parent }) {
  const data = await parent()

  // They completed their profile! Redirect to dashboard.
  if (hasFullProfile(data?.profile)) {
    redirect(303, "/app")
  }

  return data
}
