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

<tbody
  bind:this={ref}
  class={cn("[&_tr:last-child]:border-0", className)}
  {...restProps}
>
  {@render restProps.children?.()}
</tbody>
