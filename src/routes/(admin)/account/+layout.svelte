<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"
  import { enhance } from "$app/forms"
  import { Button } from "$lib/components/ui/button"
  import { AlertCircle } from "lucide-svelte"

  let { data, children } = $props()

  let { supabase, session, isImpersonating, originalUserEmail } = $state(data)
  $effect(() => {
    ;({ supabase, session, isImpersonating, originalUserEmail } = data)
  })

  onMount(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        invalidate("supabase:auth")
      }
    })

    return () => authListener.subscription.unsubscribe()
  })
</script>

{@render children?.()}
