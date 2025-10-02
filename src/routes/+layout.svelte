<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"

  interface Props {
    children?: import("svelte").Snippet
    data: any
  }

  let { children, data }: Props = $props()

  onMount(() => {
    const { data: authListener } = data.supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        invalidate("supabase:auth")
      }
    })

    return () => authListener.subscription.unsubscribe()
  })
</script>

{@render children?.()}
