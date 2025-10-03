<script lang="ts">
  import SettingsModule from "./settings_module.svelte"
  import PageHeader from "$lib/components/page-header.svelte"
  import PageTitle from "$lib/components/page-title.svelte"

  let { data } = $props()
  let { profile, user } = data
</script>

<PageTitle title="Account" />

<div class="space-y-6">
  <PageHeader title="Account" description="Manage your account settings and preferences" />

<SettingsModule
  title="Profile"
  editable={false}
  fields={[
    { id: "fullName", label: "Name", initialValue: profile?.full_name ?? "" },
    {
      id: "companyName",
      label: "Company Name",
      initialValue: profile?.company_name ?? "",
    },
  ]}
  editButtonTitle="Edit Profile"
  editLink="/app/account/edit_profile"
/>

<SettingsModule
  title="Email"
  editable={false}
  fields={[{ id: "email", initialValue: user?.email || "" }]}
  editButtonTitle="Change Email"
  editLink="/app/account/change_email"
/>

<SettingsModule
  title="Password"
  editable={false}
  fields={[{ id: "password", initialValue: "••••••••••••••••" }]}
  editButtonTitle="Change Password"
  editLink="/app/account/change_password"
/>

<SettingsModule
  title="Email Subscription"
  editable={false}
  fields={[
    {
      id: "subscriptionStatus",
      initialValue: profile?.unsubscribed ? "Unsubscribed" : "Subscribed",
    },
  ]}
  editButtonTitle="Change Subscription"
  editLink="/app/account/change_email_subscription"
/>

  <SettingsModule
    title="Danger Zone"
    editable={false}
    dangerous={true}
    fields={[]}
    editButtonTitle="Delete Account"
    editLink="/app/account/delete_account"
  />
</div>
