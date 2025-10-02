import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({
  locals: { session },
  cookies,
}) => {
  // Session here is from authGuard hook

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
    session,
    cookies: cookies.getAll(),
    isImpersonating,
    originalUserEmail,
  }
}
