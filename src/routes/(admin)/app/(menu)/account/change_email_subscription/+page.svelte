<script lang="ts">
  import SettingsModule from "../settings_module.svelte"
  import PageTitle from "$lib/components/page-title.svelte"

  let { data } = $props()
  let { profile } = data
  let unsubscribed = profile?.unsubscribed
</script>

<PageTitle title="Change Email Subscription" />

<h1 class="text-2xl font-bold mb-6">Email Subscription</h1>

<SettingsModule
  editable={true}
  title="Subscription"
  message={unsubscribed
    ? "You are currently unsubscribed from emails"
    : "You are currently subscribed to emails"}
  saveButtonTitle={unsubscribed ? "Re-subscribe" : "Unsubscribe"}
  successBody={unsubscribed
    ? "You have been re-subscribed to emails"
    : "You have been unsubscribed from emails"}
  formTarget="/account/api?/toggleEmailSubscription"
  fields={[]}
/>
