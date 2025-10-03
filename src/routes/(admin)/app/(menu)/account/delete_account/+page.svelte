<script lang="ts">
  import SettingsModule from "../settings_module.svelte"
  import PageTitle from "$lib/components/page-title.svelte"

  let { data } = $props()
  let { session } = data
</script>

<PageTitle title="Delete Account" />

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  title="Delete Account"
  editable={true}
  dangerous={true}
  message="Deleting your account can not be undone. You are currently logged in as '{session
    ?.user?.email}'"
  saveButtonTitle="Delete Account"
  successTitle="Account queued for deletion"
  successBody="Your account will be deleted shortly."
  formTarget="/account/api?/deleteAccount"
  fields={[
    {
      id: "currentPassword",
      label: "Current Password",
      initialValue: "",
      inputType: "password",
    },
  ]}
/>
