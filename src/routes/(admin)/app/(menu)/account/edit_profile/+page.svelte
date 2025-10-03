<script lang="ts">
  import SettingsModule from "../settings_module.svelte"
  import PageTitle from "$lib/components/page-title.svelte"

  let { data } = $props()

  let { profile } = data
</script>

<PageTitle title="Edit Profile" />

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  editable={true}
  title="Edit Profile"
  successTitle="Saved Profile"
  formTarget="/account/api?/updateProfile"
  fields={[
    {
      id: "fullName",
      label: "Name",
      initialValue: profile?.full_name ?? "",
      placeholder: "Your full name",
      maxlength: 50,
    },
    {
      id: "companyName",
      label: "Company Name",
      initialValue: profile?.company_name ?? "",
      maxlength: 50,
    },
  ]}
/>
