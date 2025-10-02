import { redirect, fail } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, supabaseServiceRole, safeGetSession },
}) => {
  const { session } = await safeGetSession()
  if (!session) {
    redirect(303, "/")
  }

  // Fetch users from auth.users and profiles from public.profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false })

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError)
  }

  // Fetch users from auth.users using admin API with service role
  const { data: authUsers, error: authError } =
    await supabaseServiceRole.auth.admin.listUsers()

  if (authError) {
    console.error("Error fetching users:", authError)
  }

  // Combine auth users with their profiles
  const users = authUsers?.users.map((user) => {
    const profile = profiles?.find((p) => p.id === user.id)
    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      full_name: profile?.full_name || null,
      company_name: profile?.company_name || null,
      website: profile?.website || null,
      unsubscribed: profile?.unsubscribed || false,
    }
  })

  return {
    users: users || [],
    currentUserId: session.user.id,
  }
}

export const actions: Actions = {
  createUser: async ({ request, locals: { supabaseServiceRole, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/")
    }

    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    // Validation
    let validationError
    const errorFields = []
    if (!email || email === "") {
      validationError = "Email is required"
      errorFields.push("email")
    } else if (!email.includes("@")) {
      validationError = "A valid email address is required"
      errorFields.push("email")
    }
    if (!password) {
      validationError = "Password is required"
      errorFields.push("password")
    } else if (password.length < 6) {
      validationError = "Password must be at least 6 characters long"
      errorFields.push("password")
    } else if (password.length > 72) {
      validationError = "Password can be at most 72 characters long"
      errorFields.push("password")
    }
    if (!fullName || fullName === "") {
      validationError = "Full name is required"
      errorFields.push("fullName")
    }

    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: [...new Set(errorFields)],
        email,
        fullName,
      })
    }

    // Create user using admin API
    const { data: userData, error } = await supabaseServiceRole.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
    })

    if (error) {
      console.error("Error creating user:", error)
      return fail(500, {
        errorMessage: error.message || "Failed to create user",
        email,
        fullName,
      })
    }

    // Create profile for the user
    if (userData?.user) {
      const { error: profileError } = await supabaseServiceRole
        .from("profiles")
        .insert({
          id: userData.user.id,
          full_name: fullName,
          updated_at: new Date(),
        })

      if (profileError) {
        console.error("Error creating profile:", profileError)
      }
    }

    return {
      success: true,
      email,
      fullName,
    }
  },
  updateUser: async ({ request, locals: { supabase, supabaseServiceRole, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/")
    }

    const formData = await request.formData()
    const userId = formData.get("userId") as string
    const email = formData.get("email") as string
    const fullName = formData.get("fullName") as string
    const companyName = formData.get("companyName") as string
    const website = formData.get("website") as string

    // Validation
    let validationError
    const errorFields = []
    if (!email || email === "") {
      validationError = "Email is required"
      errorFields.push("email")
    } else if (!email.includes("@")) {
      validationError = "A valid email address is required"
      errorFields.push("email")
    }
    if (!fullName || fullName === "") {
      validationError = "Full name is required"
      errorFields.push("fullName")
    }

    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: [...new Set(errorFields)],
        userId,
        email,
        fullName,
        companyName,
        website,
      })
    }

    // Update email if changed
    const { data: currentUser } = await supabaseServiceRole.auth.admin.getUserById(userId)
    if (currentUser.user && currentUser.user.email !== email) {
      const { error: emailError } = await supabaseServiceRole.auth.admin.updateUserById(
        userId,
        { email }
      )

      if (emailError) {
        console.error("Error updating email:", emailError)
        return fail(500, {
          errorMessage: emailError.message || "Failed to update email",
          userId,
          email,
          fullName,
          companyName,
          website,
        })
      }
    }

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName,
        company_name: companyName || null,
        website: website || null,
        updated_at: new Date(),
      })

    if (profileError) {
      console.error("Error updating profile:", profileError)
      return fail(500, {
        errorMessage: "Failed to update profile",
        userId,
        email,
        fullName,
        companyName,
        website,
      })
    }

    return {
      success: true,
      userId,
      email,
      fullName,
      companyName,
      website,
    }
  },
  impersonateUser: async ({ request, locals: { supabase, supabaseServiceRole, safeGetSession }, cookies }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/")
    }

    const formData = await request.formData()
    const userId = formData.get("userId") as string

    if (!userId) {
      console.error("No userId provided")
      return fail(400, {
        errorMessage: "User ID is required",
      })
    }

    // Prevent self-impersonation
    if (userId === session.user.id) {
      return fail(400, {
        errorMessage: "Cannot impersonate yourself",
      })
    }

    try {
      // Store the CURRENT user's session (from safeGetSession which we already have)
      // This is guaranteed to be the admin user who is doing the impersonation
      if (session) {
        const cookieData = JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user_id: session.user.id,
          user_email: session.user.email
        })

        cookies.set('original_session', cookieData, {
          path: '/',
          httpOnly: true,
          secure: false, // Allow on localhost
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 // 24 hours
        })
      }

      // Get the user details
      const { data: userData, error: userError } = await supabaseServiceRole.auth.admin.getUserById(userId)

      if (userError || !userData.user) {
        console.error("Error fetching user:", userError)
        return fail(500, {
          errorMessage: "Failed to fetch user details: " + (userError?.message || "Unknown error"),
        })
      }

      // Generate a magic link which contains the access and refresh tokens
      const { data: linkData, error: linkError } = await supabaseServiceRole.auth.admin.generateLink({
        type: 'magiclink',
        email: userData.user.email!,
      })

      if (linkError || !linkData) {
        console.error("Error generating magic link:", linkError)
        return fail(500, {
          errorMessage: "Failed to generate impersonation session: " + (linkError?.message || "Unknown error"),
        })
      }

      // Extract tokens from the magic link URL - they might be in hash or query params
      const actionLink = linkData.properties.action_link
      const url = new URL(actionLink)

      // Try query params first
      let accessToken = url.searchParams.get('access_token')
      let refreshToken = url.searchParams.get('refresh_token')

      // If not in query params, try hash
      if (!accessToken || !refreshToken) {
        const hash = url.hash.substring(1) // Remove the #
        const hashParams = new URLSearchParams(hash)
        accessToken = hashParams.get('access_token')
        refreshToken = hashParams.get('refresh_token')
      }

      // Alternative approach: Use the hashed_token directly
      if (!accessToken && linkData.properties.hashed_token) {
        const hashedToken = linkData.properties.hashed_token

        // Verify the OTP token to get a session
        const { data: verifyData, error: verifyError } = await supabaseServiceRole.auth.verifyOtp({
          token_hash: hashedToken,
          type: 'magiclink',
        })

        if (verifyError || !verifyData.session) {
          console.error("Error verifying OTP:", verifyError)
          return fail(500, {
            errorMessage: "Failed to verify token: " + (verifyError?.message || "Unknown error"),
          })
        }

        accessToken = verifyData.session.access_token
        refreshToken = verifyData.session.refresh_token
      }

      if (!accessToken || !refreshToken) {
        console.error("Missing tokens in magic link")
        return fail(500, {
          errorMessage: "Failed to extract authentication tokens",
        })
      }

      // Store tokens to redirect with - must be done outside try-catch
      const redirectUrl = `/auth/callback?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}&next=/account`

      // Redirect with tokens as query params - Supabase auth will pick them up
      throw redirect(303, redirectUrl)
    } catch (error) {
      // Re-throw redirect errors
      if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
        throw error
      }

      console.error("Unexpected error during impersonation:", error)
      return fail(500, {
        errorMessage: "An unexpected error occurred: " + (error as Error).message,
      })
    }
  },
  stopImpersonation: async ({ locals: { supabase }, cookies }) => {
    // Get the original session from cookies
    const originalSessionCookie = cookies.get('original_session')

    if (!originalSessionCookie) {
      return fail(400, {
        errorMessage: "No original session found",
      })
    }

    try {
      const originalSession = JSON.parse(originalSessionCookie)

      // Restore the original session
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: originalSession.access_token,
        refresh_token: originalSession.refresh_token,
      })

      if (sessionError) {
        console.error("Error restoring session:", sessionError)
        return fail(500, {
          errorMessage: "Failed to restore original session: " + sessionError.message,
        })
      }

      // Clear the original session cookie
      cookies.delete('original_session', { path: '/' })

      // Redirect to the users page
      throw redirect(303, "/account/users")
    } catch (error) {
      // Re-throw redirect errors
      if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
        throw error
      }

      console.error("Error during stop impersonation:", error)
      return fail(500, {
        errorMessage: "Failed to stop impersonation: " + (error as Error).message,
      })
    }
  },
}
