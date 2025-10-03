<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card"
  import * as Dialog from "$lib/components/ui/dialog"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import PageHeader from "$lib/components/page-header.svelte"
  import PageTitle from "$lib/components/page-title.svelte"
  import { Plus, ShieldCheck } from "lucide-svelte"
  import { enhance } from "$app/forms"
  import type { PageData, ActionData } from "./$types"
  import DataTable from "./data-table.svelte"
  import { columns, type User } from "./columns"
  import { setContext } from "svelte"

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let dialogOpen = $state(false)
  let editDialogOpen = $state(false)
  let isSubmitting = $state(false)
  let editingUser = $state<User | null>(null)

  function openEditDialog(user: User) {
    editingUser = { ...user }
    editDialogOpen = true
  }

  // Set context for actions cell to access
  setContext('openEditDialog', openEditDialog)
  setContext('currentUserId', data.currentUserId)

  $effect(() => {
    if (form?.success) {
      dialogOpen = false
      editDialogOpen = false
      editingUser = null
    }
  })
</script>

<PageTitle title="Users" />

<div class="space-y-6">
  <PageHeader title="Users" description="Manage and view all users in the system">
    {#snippet children()}
      <Button variant="outline" href="/app/roles">
        <ShieldCheck class="mr-2 h-4 w-4" />
        View Roles
      </Button>
      <Dialog.Root bind:open={dialogOpen}>
        <Dialog.Trigger>
          <Button>
            <Plus class="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create New User</Dialog.Title>
          <Dialog.Description>
            Add a new user to the system. They will receive their login credentials.
          </Dialog.Description>
        </Dialog.Header>
        <form
          method="POST"
          action="?/createUser"
          use:enhance={() => {
            isSubmitting = true
            return async ({ update }) => {
              await update()
              isSubmitting = false
            }
          }}
        >
          <div class="grid gap-4 py-4">
            {#if form?.errorMessage}
              <div class="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {form.errorMessage}
              </div>
            {/if}
            <div class="grid gap-2">
              <Label for="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={form?.fullName || ""}
                required
                class={form?.errorFields?.includes("fullName") ? "border-red-500" : ""}
              />
            </div>
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={form?.email || ""}
                required
                class={form?.errorFields?.includes("email") ? "border-red-500" : ""}
              />
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                class={form?.errorFields?.includes("password") ? "border-red-500" : ""}
              />
              <p class="text-xs text-muted-foreground">
                Must be at least 6 characters long
              </p>
            </div>
          </div>
          <Dialog.Footer>
            <Button type="button" variant="outline" onclick={() => dialogOpen = false}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
      </Dialog.Root>
    {/snippet}
  </PageHeader>

  <!-- Edit User Dialog -->
  <Dialog.Root bind:open={editDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Edit User</Dialog.Title>
        <Dialog.Description>
          Update user information including email and profile details.
        </Dialog.Description>
      </Dialog.Header>
      <form
        method="POST"
        action="?/updateUser"
        use:enhance={() => {
          isSubmitting = true
          return async ({ update }) => {
            await update()
            isSubmitting = false
          }
        }}
      >
        <input type="hidden" name="userId" value={editingUser?.id || ""} />
        <div class="grid gap-4 py-4">
          {#if form?.errorMessage && form?.userId === editingUser?.id}
            <div class="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {form.errorMessage}
            </div>
          {/if}
          <div class="grid gap-2">
            <Label for="edit-email">Email</Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              placeholder="user@example.com"
              value={editingUser?.email || ""}
              required
              class={form?.errorFields?.includes("email") && form?.userId === editingUser?.id ? "border-red-500" : ""}
            />
          </div>
          <div class="grid gap-2">
            <Label for="edit-fullName">Full Name</Label>
            <Input
              id="edit-fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={editingUser?.full_name || ""}
              required
              class={form?.errorFields?.includes("fullName") && form?.userId === editingUser?.id ? "border-red-500" : ""}
            />
          </div>
          <div class="grid gap-2">
            <Label for="edit-companyName">Company Name</Label>
            <Input
              id="edit-companyName"
              name="companyName"
              type="text"
              placeholder="Acme Inc."
              value={editingUser?.company_name || ""}
            />
          </div>
        </div>
        <Dialog.Footer>
          <Button type="button" variant="outline" onclick={() => editDialogOpen = false}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>

  <Card>
    <CardHeader>
      <CardTitle>All Users</CardTitle>
      <CardDescription>
        Total users: {data.users.length}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <DataTable data={data.users} {columns} />
    </CardContent>
  </Card>
</div>
