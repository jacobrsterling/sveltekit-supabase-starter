import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  // If user is logged in, redirect to app
  if (locals.session) {
    throw redirect(303, '/app')
  }

  return {}
}
