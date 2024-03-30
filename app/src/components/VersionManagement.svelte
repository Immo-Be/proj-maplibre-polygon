<script>
	import BaseFormInputSelect from './BaseFormInputSelect.svelte';
	import { versions } from '../stores/featureCollection';
	import { page } from '$app/stores';

	$: selectedVersion = $page.data.selectedVersion;
</script>

<div class="p-4">
	<p class="text-center">Füge eine neue Version hinzu</p>

	<BaseFormInputSelect options={$versions} name="version" value={selectedVersion} />
</div>
