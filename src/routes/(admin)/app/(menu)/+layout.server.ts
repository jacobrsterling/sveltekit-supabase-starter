import type { LayoutServerLoad } from "./$types"
import { getSetting } from "$lib/helpers/settings"

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
  const siteTitle = await getSetting<string>(supabase, "site_title")

  return {
    siteTitle: siteTitle || "App",
  }
}
