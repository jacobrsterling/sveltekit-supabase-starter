<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { SidebarTrigger } from "$lib/components/ui/sidebar/index.js";
  import { page } from "$app/stores";

  let currentPath = $derived($page.url.pathname);
  let pageName = $derived(
    currentPath === "/account"
      ? "Dashboard"
      : currentPath.includes("/settings")
      ? "Settings"
      : "Account"
  );
</script>

<header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
  <SidebarTrigger class="-ml-1" />
  <Separator orientation="vertical" class="mr-2 h-4" />
  <div class="flex items-center gap-2 text-sm">
    <a href="/account" class="text-muted-foreground hover:text-foreground">Account</a>
    {#if currentPath !== "/account"}
      <span class="text-muted-foreground">/</span>
      <span class="font-medium">{pageName}</span>
    {/if}
  </div>
</header>
