<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"

  let { data, children } = $props()

  let { supabase, session } = $state(data)
  $effect(() => {
    ;({ supabase, session } = data)
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
