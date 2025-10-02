<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: {
    ref?: HTMLTableCaptionElement | null;
    class?: string;
    [key: string]: any;
  } = $props();
</script>

<caption
  bind:this={ref}
  class={cn("mt-4 text-sm text-muted-foreground", className)}
  {...restProps}
>
  {@render restProps.children?.()}
</caption>
