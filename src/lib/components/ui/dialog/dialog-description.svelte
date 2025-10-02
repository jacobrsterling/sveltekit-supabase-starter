<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: {
		ref?: HTMLParagraphElement | null;
		class?: string;
		[key: string]: any;
	} = $props();
</script>

<DialogPrimitive.Description
	bind:ref
	class={cn("text-sm text-muted-foreground", className)}
	{...restProps}
>
	{@render restProps.children?.()}
</DialogPrimitive.Description>
