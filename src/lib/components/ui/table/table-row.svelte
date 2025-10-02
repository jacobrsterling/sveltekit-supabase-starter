<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: {
    ref?: HTMLTableRowElement | null;
    class?: string;
    [key: string]: any;
  } = $props();
</script>

<tr
  bind:this={ref}
  class={cn(
    "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
    className
  )}
  {...restProps}
>
  {@render restProps.children?.()}
</tr>
