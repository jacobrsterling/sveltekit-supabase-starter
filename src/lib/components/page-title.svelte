<script lang="ts">
  import { page } from "$app/stores"

  interface Props {
    title: string
  }

  let { title }: Props = $props()
  let siteTitle = $derived($page.data.siteTitle || "App")
  let fullTitle = $derived(`${title} - ${siteTitle}`)
</script>

<svelte:head>
  <title>{fullTitle}</title>
</svelte:head>
