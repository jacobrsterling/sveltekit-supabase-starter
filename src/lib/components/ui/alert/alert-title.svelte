<script lang="ts">
  import type { Snippet } from "svelte"
  import { cn } from "$lib/utils"

  type Props = {
    class?: string
    children?: Snippet
  }

  let { class: className, children }: Props = $props()
</script>

<h5
  class={cn("mb-1 font-medium leading-none tracking-tight", className)}
>
  {@render children?.()}
</h5>