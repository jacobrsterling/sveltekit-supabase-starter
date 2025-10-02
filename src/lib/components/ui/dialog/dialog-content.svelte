<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils";
	import { X } from "lucide-svelte";
	import DialogOverlay from "./dialog-overlay.svelte";

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

<DialogPrimitive.Portal>
	<DialogOverlay />
	<DialogPrimitive.Content
		bind:ref
		{transition}
		{transitionConfig}
		class={cn(
			"fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
			className
		)}
		{...restProps}
	>
		{@render restProps.children?.()}
		<DialogPrimitive.Close
			class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</DialogPrimitive.Portal>
