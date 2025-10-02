<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card"
  import * as Table from "$lib/components/ui/table"
  import * as Dialog from "$lib/components/ui/dialog"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import RoleBadge from "$lib/components/role-badge.svelte"
  import { ArrowLeft, Pencil } from "lucide-svelte"
  import { formatDate } from "$lib/utils"
  import { enhance, applyAction } from "$app/forms"
  import type { PageData, ActionData } from "./$types"

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let editDialogOpen = $state(false)
  let editingRole = $state<any>(null)
  let editingColour = $state("#3b82f6")
  let isSubmitting = $state(false)

  function openEditDialog(role: any) {
    editingRole = { ...role }
    editingColour = role.colour || "#3b82f6"
    editDialogOpen = true
  }
</script>

<svelte:head>
  <title>Roles - EP Dealer Portal</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center gap-4">
    <Button variant="ghost" size="sm" href="/account/users">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Back to Users
    </Button>
  </div>

  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Roles</h1>
      <p class="text-muted-foreground mt-2">View all roles in the system</p>
    </div>
  </div>

  <!-- Edit Role Color Dialog -->
  <Dialog.Root bind:open={editDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Edit Role Colour</Dialog.Title>
        <Dialog.Description>
          Choose a colour for the {editingRole?.name} role badge
        </Dialog.Description>
      </Dialog.Header>
      <form
        method="POST"
        action="?/updateRoleColour"
        use:enhance={() => {
          isSubmitting = true

          return async ({ result, update }) => {
            if (result.type === 'success') {
              // This is the key: call update() to invalidate and reload data
              await update()
              editDialogOpen = false
              editingRole = null
            }
            isSubmitting = false
          }
        }}
      >
        <input type="hidden" name="roleId" value={editingRole?.id || ""} />
        <input type="hidden" name="colour" value={editingColour} />
        <div class="grid gap-4 py-4">
          {#if form?.errorMessage && !form?.success}
            <div class="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {form.errorMessage}
            </div>
          {/if}
          <div class="grid gap-2">
            <Label for="colour">Colour</Label>
            <div class="flex gap-2 items-center">
              <input
                type="color"
                value={editingColour}
                oninput={(e) => editingColour = e.currentTarget.value}
                class="w-20 h-10 cursor-pointer rounded border border-input"
              />
              <input
                id="colour-display"
                type="text"
                value={editingColour}
                oninput={(e) => editingColour = e.currentTarget.value}
                placeholder="#3b82f6"
                class="flex-1 font-mono border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                required
              />
            </div>
            <p class="text-xs text-muted-foreground">
              Select a colour or enter a hex code (e.g., #3b82f6)
            </p>
            <div class="mt-2">
              <p class="text-sm mb-2">Preview:</p>
              <RoleBadge name={editingRole?.name || ""} colour={editingColour} />
            </div>
          </div>
        </div>
        <Dialog.Footer>
          <Button type="button" variant="outline" onclick={() => editDialogOpen = false}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Colour"}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>

  <Card>
    <CardHeader>
      <CardTitle>All Roles</CardTitle>
      <CardDescription>
        Total roles: {data.roles.length}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="rounded-md border">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Colour</Table.Head>
              <Table.Head>Description</Table.Head>
              <Table.Head>Created</Table.Head>
              <Table.Head class="w-[80px]">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#if data.roles.length === 0}
              <Table.Row>
                <Table.Cell colspan={5} class="h-24 text-center text-muted-foreground">
                  No roles found
                </Table.Cell>
              </Table.Row>
            {:else}
              {#each data.roles as role (role.id)}
                <Table.Row>
                  <Table.Cell class="font-medium">{role.name}</Table.Cell>
                  <Table.Cell>
                    <RoleBadge name={role.name} colour={role.colour} />
                  </Table.Cell>
                  <Table.Cell>{role.description || "-"}</Table.Cell>
                  <Table.Cell>{formatDate(role.created_at)}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onclick={() => openEditDialog(role)}
                      title="Edit colour"
                    >
                      <Pencil class="h-4 w-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              {/each}
            {/if}
          </Table.Body>
        </Table.Root>
      </div>
    </CardContent>
  </Card>
</div>
