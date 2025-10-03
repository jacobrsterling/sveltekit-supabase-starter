<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card"
  import * as Dialog from "$lib/components/ui/dialog"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import PageHeader from "$lib/components/page-header.svelte"
  import PageTitle from "$lib/components/page-title.svelte"
  import { Plus, Save, Trash2, Settings2, Pencil } from "lucide-svelte"
  import { enhance } from "$app/forms"
  import { groupSettings, sortSettings, canEditSetting, formatSettingValue, formatGroupKey } from "$lib/helpers/settings"
  import { toast } from "$lib/stores/toast.svelte"
  import type { PageData, ActionData } from "./$types"
  import type { Setting } from "$lib/helpers/settings"

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let createDialogOpen = $state(false)
  let editDialogOpen = $state(false)
  let editingSetting = $state<Setting | null>(null)
  let isSubmitting = $state(false)
  let editingValues = $state<Record<string, any>>({})

  // Track the last form we processed to avoid duplicates
  let lastProcessedForm: ActionData = null

  function openEditDialog(setting: Setting) {
    editingSetting = { ...setting }
    editDialogOpen = true
  }

  // Group settings by group_key
  const groupedSettings = $derived(groupSettings(data.settings))

  // Get unique group labels
  const groups = $derived(
    Object.entries(groupedSettings).map(([groupKey, settings]) => ({
      key: groupKey,
      label: formatGroupKey(groupKey),
      settings: sortSettings(settings),
    })),
  )

  // Check if user is admin
  const isAdmin = $derived(data.userRole === "admin")

  // Initialize editing values when settings change
  $effect(() => {
    data.settings.forEach((setting) => {
      if (!(setting.id in editingValues)) {
        const value = setting.value ?? setting.default_value
        editingValues[setting.id] = formatSettingValue(value, setting.input_type)
      }
    })
  })

  function getSettingDisplayValue(setting: Setting) {
    const value = setting.value ?? setting.default_value
    return formatSettingValue(value, setting.input_type)
  }

  $effect(() => {
    if (!form || form === lastProcessedForm) return

    lastProcessedForm = form

    if (form?.success) {
      createDialogOpen = false
      editDialogOpen = false

      // Show success toast
      if (form?.message) {
        toast.success(form.message)
      } else {
        toast.success("Setting updated successfully")
      }
    } else if (form?.errorMessage && !form?.settingId) {
      // Only show error toasts for general errors, not field-specific ones
      toast.error(form.errorMessage)
    }
  })
</script>

<PageTitle title="Settings" />

<div class="space-y-6">
  <PageHeader title="Settings" description="Manage system-wide settings and configuration">
    {#snippet children()}
      {#if isAdmin}
        <Dialog.Root bind:open={createDialogOpen}>
          <Dialog.Trigger>
            <Button>
              <Plus class="mr-2 h-4 w-4" />
              Create Setting
            </Button>
          </Dialog.Trigger>
        <Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Header>
            <Dialog.Title>Create New Setting</Dialog.Title>
            <Dialog.Description>
              Add a new setting to the system. This will be available to users based on role permissions.
            </Dialog.Description>
          </Dialog.Header>
          <form
            method="POST"
            action="?/createSetting"
            use:enhance={() => {
              isSubmitting = true
              return async ({ update }) => {
                await update()
                isSubmitting = false
              }
            }}
          >
            <div class="grid gap-4 py-4">
              {#if form?.errorMessage && !form?.settingId}
                <div class="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {form.errorMessage}
                </div>
              {/if}

              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="key">Key *</Label>
                  <Input
                    id="key"
                    name="key"
                    type="text"
                    placeholder="site_title"
                    value={form?.formData?.key || ""}
                    required
                  />
                  <p class="text-xs text-muted-foreground">Unique identifier (e.g., site_title)</p>
                </div>
                <div class="grid gap-2">
                  <Label for="label">Label *</Label>
                  <Input
                    id="label"
                    name="label"
                    type="text"
                    placeholder="Site Title"
                    value={form?.formData?.label || ""}
                    required
                  />
                </div>
              </div>

              <div class="grid gap-2">
                <Label for="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Help text shown to users"
                  value={form?.formData?.description || ""}
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="inputType">Input Type *</Label>
                  <select
                    id="inputType"
                    name="inputType"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Select</option>
                    <option value="multiselect">Multi-select</option>
                    <option value="json">JSON</option>
                    <option value="color">Color</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <div class="grid gap-2">
                  <Label for="groupKey">Group *</Label>
                  <Input
                    id="groupKey"
                    name="groupKey"
                    type="text"
                    placeholder="general"
                    value={form?.formData?.groupKey || "general"}
                    required
                  />
                </div>
              </div>

              <div class="grid gap-2">
                <Label for="defaultValue">Default Value</Label>
                <Input
                  id="defaultValue"
                  name="defaultValue"
                  type="text"
                  placeholder="Default value for this setting"
                  value={form?.formData?.defaultValue || ""}
                />
              </div>

              <div class="grid gap-2">
                <Label>View Roles</Label>
                <div class="space-y-2">
                  {#each data.roles as role}
                    <label class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="viewRoles"
                        value={role.name}
                        checked={role.name === "admin"}
                        class="rounded border-gray-300"
                      />
                      <span class="text-sm">{role.name}</span>
                    </label>
                  {/each}
                </div>
              </div>

              <div class="grid gap-2">
                <Label>Edit Roles</Label>
                <div class="space-y-2">
                  {#each data.roles as role}
                    <label class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="editRoles"
                        value={role.name}
                        checked={role.name === "admin"}
                        class="rounded border-gray-300"
                      />
                      <span class="text-sm">{role.name}</span>
                    </label>
                  {/each}
                </div>
              </div>
            </div>
            <Dialog.Footer>
              <Button type="button" variant="outline" onclick={() => createDialogOpen = false}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Setting"}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
        </Dialog.Root>
      {/if}
    {/snippet}
  </PageHeader>

  <!-- Edit Setting Dialog -->
  {#if isAdmin && editingSetting}
    <Dialog.Root bind:open={editDialogOpen}>
      <Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
          <Dialog.Title>Edit Setting</Dialog.Title>
          <Dialog.Description>
            Update the configuration for this setting.
          </Dialog.Description>
        </Dialog.Header>
        <form
          method="POST"
          action="?/updateSetting"
          use:enhance={() => {
            isSubmitting = true
            return async ({ update }) => {
              await update()
              isSubmitting = false
            }
          }}
        >
          <input type="hidden" name="settingId" value={editingSetting.id} />
          <div class="grid gap-4 py-4">
            {#if form?.errorMessage && form?.settingId === editingSetting.id}
              <div class="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {form.errorMessage}
              </div>
            {/if}

            <div class="grid gap-2">
              <Label>Key</Label>
              <Input type="text" value={editingSetting.key} disabled class="bg-muted" />
              <p class="text-xs text-muted-foreground">Key cannot be changed</p>
            </div>

            <div class="grid gap-2">
              <Label for="edit-label">Label *</Label>
              <Input
                id="edit-label"
                name="label"
                type="text"
                bind:value={editingSetting.label}
                required
              />
            </div>

            <div class="grid gap-2">
              <Label for="edit-description">Description</Label>
              <Input
                id="edit-description"
                name="description"
                type="text"
                bind:value={editingSetting.description}
              />
            </div>

            <div class="grid gap-2">
              <Label for="edit-value">Value</Label>
              {#if editingSetting.input_type === "boolean"}
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-value"
                    name="value"
                    checked={editingSetting.value ?? editingSetting.default_value}
                    class="rounded border-gray-300"
                  />
                  <span class="text-sm">Enabled</span>
                </div>
              {:else if editingSetting.input_type === "textarea" || editingSetting.input_type === "json"}
                <textarea
                  id="edit-value"
                  name="value"
                  bind:value={editingSetting.value}
                  rows="4"
                  class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              {:else if editingSetting.input_type === "color"}
                <input
                  type="color"
                  id="edit-value"
                  name="value"
                  bind:value={editingSetting.value}
                  class="h-10 w-20 rounded border border-input"
                />
              {:else}
                <Input
                  id="edit-value"
                  name="value"
                  type={editingSetting.input_type === "number" ? "number" : editingSetting.input_type === "date" ? "date" : "text"}
                  bind:value={editingSetting.value}
                />
              {/if}
            </div>
          </div>
          <Dialog.Footer class="gap-2">
            <form method="POST" action="?/deleteSetting" use:enhance>
              <input type="hidden" name="settingId" value={editingSetting.id} />
              <Button
                type="submit"
                variant="destructive"
                onclick={(e) => {
                  if (!confirm(`Are you sure you want to delete "${editingSetting.label}"?`)) {
                    e.preventDefault()
                  }
                }}
              >
                <Trash2 class="h-4 w-4 mr-2" />
                Delete
              </Button>
            </form>
            <div class="flex-1"></div>
            <Button type="button" variant="outline" onclick={() => editDialogOpen = false}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Setting"}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  {/if}

  {#if data.settings.length === 0}
    <Card>
      <CardContent class="pt-6">
        <div class="text-center text-muted-foreground py-12">
          <Settings2 class="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p class="text-lg font-medium">No settings found</p>
          <p class="text-sm mt-2">
            {#if isAdmin}
              Create your first setting to get started.
            {:else}
              There are no settings available for your role.
            {/if}
          </p>
        </div>
      </CardContent>
    </Card>
  {:else}
    {#each groups as group}
      <Card>
        <CardHeader>
          <CardTitle>{group.label}</CardTitle>
          <CardDescription>{group.settings.length} setting{group.settings.length !== 1 ? "s" : ""}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          {#each group.settings as setting}
            {@const canEdit = canEditSetting(setting, data.userRole)}
            {@const isReadonly = setting.is_readonly || !canEdit}

            <div class="pb-4 border-b last:border-0 last:pb-0">
              <div class="mb-3">
                <div class="flex items-center gap-2">
                  <Label for={setting.id} class="text-base font-medium">
                    {setting.label}
                  </Label>
                  {#if isReadonly}
                    <span class="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Read-only</span>
                  {/if}
                </div>
                {#if setting.description}
                  <p class="text-sm text-muted-foreground mt-1">
                    {setting.description}
                  </p>
                {/if}
              </div>

              <form
                method="POST"
                action="?/updateSetting"
                use:enhance={() => {
                  isSubmitting = true
                  return async ({ update }) => {
                    await update()
                    isSubmitting = false
                  }
                }}
              >
                <input type="hidden" name="settingId" value={setting.id} />

                <div class="flex items-center gap-2">
                  {#if setting.input_type === "boolean"}
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={setting.id}
                        name="value"
                        checked={setting.value ?? setting.default_value}
                        disabled={isReadonly}
                        class="rounded border-gray-300"
                        onchange={(e) => {
                          if (!isReadonly) {
                            e.currentTarget.form?.requestSubmit()
                          }
                        }}
                      />
                      <span class="text-sm text-muted-foreground">Enabled</span>
                    </div>
                  {:else if setting.input_type === "textarea" || setting.input_type === "json"}
                    <div class="flex-1 flex gap-2">
                      <textarea
                        id={setting.id}
                        name="value"
                        bind:value={editingValues[setting.id]}
                        disabled={isReadonly}
                        rows="3"
                        class="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <div class="flex flex-col gap-2">
                        {#if !isReadonly}
                          <Button type="submit" size="sm" disabled={isSubmitting} class="self-start">
                            <Save class="h-4 w-4" />
                          </Button>
                        {/if}
                        {#if isAdmin}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onclick={() => openEditDialog(setting)}
                            title="Edit setting"
                            class="self-start"
                          >
                            <Pencil class="h-4 w-4" />
                          </Button>
                        {/if}
                      </div>
                    </div>
                  {:else if setting.input_type === "select"}
                    <div class="flex-1 flex gap-2">
                      <select
                        id={setting.id}
                        name="value"
                        bind:value={editingValues[setting.id]}
                        disabled={isReadonly}
                        class="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {#if setting.options}
                          {#each setting.options as option}
                            <option value={option.value}>{option.label}</option>
                          {/each}
                        {/if}
                      </select>
                      {#if !isReadonly}
                        <Button type="submit" size="sm" disabled={isSubmitting}>
                          <Save class="h-4 w-4" />
                        </Button>
                      {/if}
                      {#if isAdmin}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onclick={() => openEditDialog(setting)}
                          title="Edit setting"
                        >
                          <Pencil class="h-4 w-4" />
                        </Button>
                      {/if}
                    </div>
                  {:else if setting.input_type === "color"}
                    <div class="flex gap-2">
                      <input
                        type="color"
                        id={setting.id}
                        name="value"
                        bind:value={editingValues[setting.id]}
                        disabled={isReadonly}
                        class="h-9 w-20 rounded border border-input"
                      />
                      {#if !isReadonly}
                        <Button type="submit" size="sm" disabled={isSubmitting}>
                          <Save class="h-4 w-4" />
                        </Button>
                      {/if}
                      {#if isAdmin}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onclick={() => openEditDialog(setting)}
                          title="Edit setting"
                        >
                          <Pencil class="h-4 w-4" />
                        </Button>
                      {/if}
                    </div>
                  {:else}
                    <div class="flex-1 flex gap-2">
                      <Input
                        id={setting.id}
                        name="value"
                        type={setting.input_type === "number" ? "number" : setting.input_type === "date" ? "date" : "text"}
                        bind:value={editingValues[setting.id]}
                        disabled={isReadonly}
                        class="flex-1"
                      />
                      {#if !isReadonly}
                        <Button type="submit" size="sm" disabled={isSubmitting}>
                          <Save class="h-4 w-4" />
                        </Button>
                      {/if}
                      {#if isAdmin}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onclick={() => openEditDialog(setting)}
                          title="Edit setting"
                        >
                          <Pencil class="h-4 w-4" />
                        </Button>
                      {/if}
                    </div>
                  {/if}
                </div>
              </form>

              {#if setting.default_value !== null}
                <p class="text-xs text-muted-foreground mt-2">
                  Default: <code class="px-1 py-0.5 bg-muted rounded">{formatSettingValue(setting.default_value, setting.input_type)}</code>
                </p>
              {/if}
            </div>
          {/each}
        </CardContent>
      </Card>
    {/each}
  {/if}
</div>
