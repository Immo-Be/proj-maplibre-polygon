<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = RangeCalendarPrimitive.HeadingProps;

	interface Props {
		class?: $$Props["class"];
		children?: import('svelte').Snippet<[any]>;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<RangeCalendarPrimitive.Heading
	
	class={cn("text-sm font-medium", className)}
	{...rest}
>
	{#snippet children({ headingValue })}
		{#if children}{@render children({ headingValue, })}{:else}
			{headingValue}
		{/if}
	{/snippet}
</RangeCalendarPrimitive.Heading>
