<script lang="ts">
	const handleToggleClick = () => {
		const drawer = document.querySelector('#my-drawer') as HTMLInputElement;
		drawer.checked = !drawer.checked;
	};
</script>

<label class="swap swap-rotate absolute top-2 w-[0.75rem] h-[2rem] right-[-3rem] btn bg-base-100">
	<!-- this hidden checkbox controls the state -->
	<input type="checkbox" onclick={handleToggleClick} />

	<!-- sun icon -->
	<svg
		class="swap-off fill-current w-10 h-10"
		xmlns="http://www.w3.org/2000/svg"
		height="24"
		viewBox="0 -960 960 960"
		width="24"
	>
		<path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
	</svg>

	<!-- moon icon -->
	<svg
		class="swap-on fill-current w-10 h-10"
		xmlns="http://www.w3.org/2000/svg"
		height="24"
		viewBox="0 -960 960 960"
		width="24"
	>
		<path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
	</svg>
</label>
