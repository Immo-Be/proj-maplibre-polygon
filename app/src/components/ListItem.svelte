<script lang="ts">
	import EditIcon from '$lib/icons/edit-icon.svelte';
	import getColorDot from '$lib/get-color-dot';

	import { hoveredFeaturedId } from '../stores/featureCollection';
	export let name: string;
	export let id: string;
	export let color: string;
	import { page } from '$app/stores';

	const initViewTransition = (event) => {
		event.target.style.viewTransitionName = 'active-ship';
	};

	const colorDot = getColorDot(color);
</script>

<li
	class="group flex justify-between items-center hover:bg-base-300 focus:bg-base-300 p-4"
	on:mouseenter={() => hoveredFeaturedId.update(() => id)}
	on:mouseleave={() => hoveredFeaturedId.update(() => null)}
>
	<a
		on:mousedown={initViewTransition}
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
