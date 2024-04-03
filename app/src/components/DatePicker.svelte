<script lang="ts">
	import { page } from '$app/stores';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import type { Version } from '../stores/featureCollection';
	import { versionsOnSelectedData, versions } from '../stores/featureCollection';

	const df = new DateFormatter('de-DE', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined = undefined;

	function getVersionsOnDate(versions, dateObj) {
		if (!versions || !dateObj) {
			console.warn('No versions or date object provided');
			return;
		}
		// Convert the date object to a Date instance
		const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day);

		// Filter the versions array
		return versions.filter((version) => {
			// Convert the start and end dates to Date instances
			const startDate = new Date(version.date_start);
			const endDate = new Date(version.date_end);

			// Check if the date falls within the start and end dates
			return date >= startDate && date <= endDate;
		});
	}

	$: versionWithDates = $versions.filter((version) => version.date_end && version.date_start);

	$: versionsOnSelectedData.update(() => {
		if (value && versionWithDates.length > 0) {
			return getVersionsOnDate(versionWithDates, value);
		}
		return [];
	});
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="input"
			class={cn(
				' justify-start text-left font-normal w-full my-4',
				!value && 'text-muted-foreground'
			)}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{value ? df.format(value.toDate(getLocalTimeZone())) : 'Wähle ein Datum'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar bind:value />
	</Popover.Content>
</Popover.Root>
