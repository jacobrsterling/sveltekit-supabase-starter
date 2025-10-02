<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: {
    ref?: HTMLTableCellElement | null;
    class?: string;
    [key: string]: any;
  } = $props();
</script>

<th
  bind:this={ref}
  class={cn(
    "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
    className
  )}
  {...restProps}
>
  {@render restProps.children?.()}
</th>
