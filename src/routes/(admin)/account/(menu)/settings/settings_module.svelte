<script lang="ts">
  import { enhance, applyAction } from "$app/forms"
  import { page } from "$app/stores"
  import type { SubmitFunction } from "@sveltejs/kit"
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card"
  import { Button } from "$lib/components/ui/button"
  import { Alert, AlertDescription } from "$lib/components/ui/alert"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"

  const fieldError = (liveForm: FormAccountUpdateResult, name: string) => {
    let errors = liveForm?.errorFields ?? []
    return errors.includes(name)
  }

  // Page state
  let loading = $state(false)
  let showSuccess = $state(false)

  type Field = {
    inputType?: string // default is "text"
    id: string
    label?: string
    initialValue: string | boolean
    placeholder?: string
    maxlength?: number
  }

  interface Props {
    // Module context
    editable?: boolean
    dangerous?: boolean
    title?: string
    message?: string
    fields: Field[]
    formTarget?: string
    successTitle?: string
    successBody?: string
    editButtonTitle?: string | null
    editLink?: string | null
    saveButtonTitle?: string
  }

  let {
    editable = false,
    dangerous = false,
    title = "",
    message = "",
    fields,
    formTarget = "",
    successTitle = "Success",
    successBody = "",
    editButtonTitle = null,
    editLink = null,
    saveButtonTitle = "Save",
  }: Props = $props()

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false
      if (result.type === "success") {
        showSuccess = true
      }
    }
  }
</script>

<Card class="mb-6">
  <CardHeader class="flex flex-row items-start justify-between space-y-0 pb-4">
    {#if title}
      <CardTitle class="text-xl">{title}</CardTitle>
    {/if}
  </CardHeader>

  <CardContent>
    {#if !showSuccess}
      {#if message}
        <Alert variant={dangerous ? "destructive" : "default"} class="mb-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      {/if}

      <form
        class="space-y-4"
        method="POST"
        action={formTarget}
        use:enhance={handleSubmit}
      >
        {#each fields as field}
          <div class="space-y-2">
            {#if field.label}
              <Label for={field.id}>{field.label}</Label>
            {/if}
            {#if editable}
              <Input
                id={field.id}
                name={field.id}
                type={field.inputType ?? "text"}
                disabled={!editable}
                placeholder={field.placeholder ?? field.label ?? ""}
                class={fieldError($page?.form, field.id) ? "border-destructive" : ""}
                value={$page.form ? $page.form[field.id] : field.initialValue}
                maxlength={field.maxlength ? field.maxlength : undefined}
              />
            {:else}
              <div class="text-sm font-medium">{field.initialValue}</div>
            {/if}
          </div>
        {/each}

        {#if $page?.form?.errorMessage}
          <p class="text-destructive text-sm font-medium">
            {$page?.form?.errorMessage}
          </p>
        {/if}

        {#if editable}
          <div class="flex justify-end pt-2">
            <Button
              type="submit"
              variant={dangerous ? "destructive" : "default"}
              disabled={loading}
              class="min-w-[145px]"
            >
              {#if loading}
                <span class="mr-2">Loading...</span>
              {:else}
                {saveButtonTitle}
              {/if}
            </Button>
          </div>
        {:else if editButtonTitle && editLink}
          <div class="flex justify-end pt-2">
            <Button
              href={editLink}
              variant={dangerous ? "destructive" : "outline"}
              class="min-w-[145px]"
            >
              {editButtonTitle}
            </Button>
          </div>
        {/if}
      </form>
    {:else}
      <div class="space-y-4">
        <div>
          <div class="font-semibold">{successTitle}</div>
          <div class="text-sm text-muted-foreground">{successBody}</div>
        </div>
        <Button href="/account/settings" variant="outline">
          Return to Settings
        </Button>
      </div>
    {/if}
  </CardContent>
</Card>
