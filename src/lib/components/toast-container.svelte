<script lang="ts">
  import { toast } from "$lib/stores/toast.svelte"
  import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-svelte"
  import { fly } from "svelte/transition"

  const iconMap = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const colorMap = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  }

  const iconColorMap = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
    warning: "text-amber-600",
  }
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
  {#each toast.toasts as item (item.id)}
    {@const Icon = iconMap[item.type]}
    <div
      transition:fly={{ x: 300, duration: 300 }}
      class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md {colorMap[item.type]}"
    >
      <Icon class="h-5 w-5 flex-shrink-0 mt-0.5 {iconColorMap[item.type]}" />
      <p class="flex-1 text-sm font-medium">{item.message}</p>
      <button
        onclick={() => toast.remove(item.id)}
        class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  {/each}
</div>
