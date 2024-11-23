<script lang="ts">
	import EditIcon from '$lib/icons/edit-icon.svelte';
	import getColorDot from '$lib/get-color-dot';
	import { cn } from '$lib/utils.js';

	import { hoveredFeaturedId } from '../stores/featureCollection';
	import { page } from '$app/stores';
	interface Props {
		name: string;
		id: string;
		color: string;
	}

	let { name, id, color }: Props = $props();

	const initViewTransition = (event) => {
		event.target.style.viewTransitionName = 'active-ship';
	};

	const colorDot = getColorDot(color);
</script>

<li
	class={cn(
		'group flex justify-between items-center hover:bg-base-300 focus:bg-base-300 p-4',
		$hoveredFeaturedId === id && 'bg-base-300'
	)}
	onmouseenter={() => hoveredFeaturedId.update(() => id)}
	onmouseleave={() => hoveredFeaturedId.update(() => null)}
>
	<a
		onmousedown={initViewTransition}
		href={`${$page.url.href}/${id}`}
		class="block w-full relative"
	>
		<div class="flex gap-4">
			{name}
		</div>
	</a>
	<a href={`${$page.url.href}/${id}`} class="flex">
		<EditIcon styles="hidden  group-hover:block" />
		<span
			class={`w-5 h-5 rounded-full before:content-[--dot] mt-[1.5px]`}
			style={`--dot: ${colorDot};`}
		></span>
	</a>
</li>
