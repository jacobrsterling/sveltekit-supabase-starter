import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user has a session (set by authGuard in hooks)
  if (locals.session) {
    throw redirect(303, '/app')
  }

  return {}
}