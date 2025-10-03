<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { SidebarTrigger } from "$lib/components/ui/sidebar/index.js";
  import { formatPathSegment } from "$lib/utils";
  import { page } from "$app/stores";

  let currentPath = $derived($page.url.pathname);

  let breadcrumbs = $derived.by(() => {
    const segments = currentPath.split("/").filter(Boolean);

    // Remove 'app' from segments as it's always the root
    const pathSegments = segments.slice(1);

    if (pathSegments.length === 0) return [];

    // Transform each segment into a breadcrumb
    return pathSegments.map((segment, index) => {
      let formatted = formatPathSegment(segment);

      // Build the URL up to this point
      const url = "/app/" + pathSegments.slice(0, index + 1).join("/");

      return { name: formatted, url, isLast: index === pathSegments.length - 1 };
    });
  });
</script>

<header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
  <SidebarTrigger class="-ml-1" />
  <Separator orientation="vertical" class="mr-2 h-4" />
  <div class="flex items-center gap-2 text-sm">
    <a href="/app" class="text-muted-foreground hover:text-foreground">Dashboard</a>
    {#each breadcrumbs as crumb}
      <span class="text-muted-foreground">/</span>
      {#if crumb.isLast}
        <span class="font-medium">{crumb.name}</span>
      {:else}
        <a href={crumb.url} class="text-muted-foreground hover:text-foreground">{crumb.name}</a>
      {/if}
    {/each}
  </div>
</header>
