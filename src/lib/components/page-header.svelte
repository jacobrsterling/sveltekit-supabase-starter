<script lang="ts">
  interface Props {
    title: string
    description?: string
    children?: import('svelte').Snippet
  }

  let { title, description, children }: Props = $props()
</script>

<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div class="min-w-0 flex-1">
    <h1 class="text-3xl font-bold tracking-tight">{title}</h1>
    {#if description}
      <p class="text-muted-foreground mt-2">{description}</p>
    {/if}
  </div>
  {#if children}
    <div class="flex flex-wrap gap-2 sm:flex-nowrap">
      {@render children()}
    </div>
  {/if}
</div>
