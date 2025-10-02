<script lang="ts">
  import { cn } from "$lib/utils"

  interface Props {
    name: string
    colour?: string | null
    class?: string
  }

  let { name, colour = null, class: className = "" }: Props = $props()

  // Function to calculate text color based on background color for better contrast
  function getTextColor(bgColor: string | null): string {
    if (!bgColor) return "white"

    // Remove # if present
    const hex = bgColor.replace("#", "")

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? "black" : "white"
  }

  const backgroundColor = $derived(colour || "#6b7280")
  const textColor = $derived(getTextColor(backgroundColor))
</script>

<span
  style="background-color: {backgroundColor}; color: {textColor};"
  class={cn(
    "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    className
  )}
>
  {name}
</span>
