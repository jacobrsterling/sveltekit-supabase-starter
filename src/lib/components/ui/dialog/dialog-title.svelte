<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: {
		ref?: HTMLHeadingElement | null;
		class?: string;
		[key: string]: any;
	} = $props();
</script>

<DialogPrimitive.Title
	bind:ref
	class={cn("text-lg font-semibold leading-none tracking-tight", className)}
	{...restProps}
>
	{@render restProps.children?.()}
</DialogPrimitive.Title>
