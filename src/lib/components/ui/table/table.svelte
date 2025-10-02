<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: {
    ref?: HTMLTableElement | null;
    class?: string;
    [key: string]: any;
  } = $props();
</script>

<div class="relative w-full overflow-auto">
  <table
    bind:this={ref}
    class={cn("w-full caption-bottom text-sm", className)}
    {...restProps}
  >
    {@render restProps.children?.()}
  </table>
</div>
