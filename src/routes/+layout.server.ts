import type { LayoutServerLoad } from "./$types"
import { redirect } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({
  locals: { session },
  cookies,
  url,
}) => {
  // Check if we're impersonating another user
  const originalSessionCookie = cookies.get('original_session')
  let isImpersonating = false
  let originalUserEmail = null

  if (originalSessionCookie) {
    try {
      const originalSession = JSON.parse(originalSessionCookie)
      isImpersonating = true
      originalUserEmail = originalSession.user_email
    } catch (e) {
      console.error("Error parsing original session cookie:", e)
    }
  }

  return {
    url: url.origin,
    cookies: cookies.getAll(),
    session,
    isImpersonating,
    originalUserEmail,
  }
}
