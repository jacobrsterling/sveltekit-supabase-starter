<script lang="ts">
  import "../../../../app.css"
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import SiteHeader from "$lib/components/site-header.svelte";
  import ToastContainer from "$lib/components/toast-container.svelte";

  interface Props {
    data: any
    children?: import("svelte").Snippet
  }

  let { data, children }: Props = $props()
</script>

<Sidebar.Provider>
  <AppSidebar variant="inset" siteTitle={data.siteTitle} />
  <Sidebar.Inset>
    <SiteHeader />
    <main class="flex flex-1 flex-col overflow-auto p-4 md:p-6">
      {@render children?.()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>

<ToastContainer />