<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: {
    ref?: HTMLTableSectionElement | null;
    class?: string;
    [key: string]: any;
  } = $props();
</script>

<tfoot
  bind:this={ref}
  class={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
  {...restProps}
>
  {@render restProps.children?.()}
</tfoot>
