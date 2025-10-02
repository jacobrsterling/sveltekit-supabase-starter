import { redirect } from '@sveltejs/kit'

export const GET = async (event) => {
  const { url, locals } = event
  const code = url.searchParams.get('code')
  const accessToken = url.searchParams.get('access_token')
  const refreshToken = url.searchParams.get('refresh_token')
  const next = url.searchParams.get('next') ?? '/account'

  // Handle token-based auth (for impersonation)
  if (accessToken && refreshToken) {
    const { error } = await locals.supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (!error) {
      throw redirect(303, next)
    }
    console.error('Error setting session:', error)
  }

  // Handle code-based auth (for OAuth flows)
  if (code) {
    const { error } = await locals.supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      throw redirect(303, next)
    }
    console.error('Error exchanging code:', error)
  }

  throw redirect(303, '/sign_in')
}