<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { flyAndScale } from "$lib/utils";

	let {
		ref = $bindable(null),
		class: className,
		transition = flyAndScale,
		transitionConfig,
		...restProps
	}: {
		ref?: HTMLDivElement | null;
		class?: string;
		transition?: any;
		transitionConfig?: any;
		[key: string]: any;
	} = $props();
</script>

<DialogPrimitive.Overlay
	bind:ref
	{transition}
	{transitionConfig}
	class={cn(
		"fixed inset-0 z-50 bg-black/80",
		className
	)}
	{...restProps}
/>
