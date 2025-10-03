<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Pencil } from "lucide-svelte"
  import { getContext } from "svelte"
  import type { Role } from "./columns"

  type Props = {
    role: Role
  }

  let { role }: Props = $props()

  const openEditDialog = getContext<(role: Role) => void>('openEditDialog')
</script>

<Button
  variant="ghost"
  size="sm"
  onclick={() => openEditDialog(role)}
  title="Edit colour"
>
  <Pencil class="h-4 w-4" />
</Button>
