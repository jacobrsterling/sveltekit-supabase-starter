import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  // If user is logged in, redirect to account
  if (locals.session) {
    throw redirect(303, '/account')
  }

  return {}
}
