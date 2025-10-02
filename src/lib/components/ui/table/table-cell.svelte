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

<td
  bind:this={ref}
  class={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
  {...restProps}
>
  {@render restProps.children?.()}
</td>
