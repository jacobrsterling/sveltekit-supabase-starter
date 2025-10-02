import type { LayoutServerLoad } from "./$types"
import { redirect } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({
  locals: { session },
  cookies,
  url,
}) => {
  return {
    url: url.origin,
    cookies: cookies.getAll(),
    session,
  }
}
