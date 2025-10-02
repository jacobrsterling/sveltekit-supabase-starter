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

<thead
  bind:this={ref}
  class={cn("[&_tr]:border-b", className)}
  {...restProps}
>
  {@render restProps.children?.()}
</thead>
