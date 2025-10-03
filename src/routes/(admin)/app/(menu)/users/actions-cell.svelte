<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Pencil, UserRound } from "lucide-svelte"
  import { enhance } from "$app/forms"
  import { getContext } from "svelte"
  import type { User } from "./columns"

  type Props = {
    user: User
  }

  let { user }: Props = $props()

  const openEditDialog = getContext<(user: User) => void>('openEditDialog')
  const currentUserId = getContext<string>('currentUserId')
</script>

<div class="flex items-center gap-1">
  <Button
    variant="ghost"
    size="sm"
    onclick={() => openEditDialog(user)}
    title="Edit user"
  >
    <Pencil class="h-4 w-4" />
  </Button>
  {#if user.id !== currentUserId}
    <form method="POST" action="?/impersonateUser" use:enhance>
      <input type="hidden" name="userId" value={user.id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        title="Impersonate user"
      >
        <UserRound class="h-4 w-4" />
      </Button>
    </form>
  {/if}
</div>
