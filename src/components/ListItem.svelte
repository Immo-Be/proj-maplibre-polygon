<script lang="ts">
	import EditIcon from '$lib/icons/edit-icon.svelte';
	export let name: string;
	export let id: string;

	const initViewTransition = (event) => {
		event.target.style.viewTransitionName = 'active-ship';
	};
</script>

<li class="group flex justify-between items-center hover:bg-base-300 focus:bg-base-300 p-4">
	<a on:mousedown={initViewTransition} href={`${id}`} class="block w-full">
		<div>
			{name}
		</div>
	</a>
	<EditIcon styles="hidden  group-hover:block" />
</li>
