<script lang="ts">
  type Props = {
    profiles: {
      full_name: string | null
      company_name: string | null
    } | null
  }

  let { profiles }: Props = $props()
</script>

{#if profiles}
  <div>
    <div class="font-medium">{profiles.full_name || "Unknown"}</div>
    {#if profiles.company_name}
      <div class="text-[10px] text-muted-foreground">{profiles.company_name}</div>
    {/if}
  </div>
{:else}
  <span class="text-muted-foreground">System</span>
{/if}
