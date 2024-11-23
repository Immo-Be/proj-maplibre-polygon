<script lang="ts">
	import { run } from 'svelte/legacy';

	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { versionsOnSelectedData, versions } from '../stores/featureCollection';
	import { isWithinInterval } from 'date-fns';

	const df = new DateFormatter('de-DE', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined = $state(undefined);

	function getVersionsOnDate(versions, dateObj) {
		if (!versions || !dateObj) {
			console.warn('No versions or date object provided');
			return;
		}
		// Convert the date object to a Date instance
		// (For some reason, when saving the date object to the store, the hour is set to 2am)
		// Like here Thu Apr 04 2024 02:00:00 GMT+0200 (Central European Summer Time)
		// So we need to set the hour to 2am -> It would be better to fix this in the store
		const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day, 2);

		// Filter the versions array
		return versions.filter((version) => {
			// Check if the date falls within the start and end dates
			return isWithinInterval(date, { start: version.date_start, end: version.date_end });
		});
	}

	let versionWithDates = $derived($versions.filter((version) => version.date_end && version.date_start));

	run(() => {
		versionsOnSelectedData.update(() => {
			if (value && versionWithDates.length > 0) {
				return getVersionsOnDate(versionWithDates, value);
			}
			return [];
		});
	});
</script>

<Popover.Root>
	<Popover.Trigger asChild >
		{#snippet children({ builder })}
				<Button
				variant="input"
				class={cn(
					' justify-start text-left font-normal w-full my-4 bg-base-100',
					!value && 'text-muted-foreground'
				)}
				builders={[builder]}
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				{value ? df.format(value.toDate(getLocalTimeZone())) : 'Wähle ein Datum'}
			</Button>
					{/snippet}
		</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar bind:value />
	</Popover.Content>
</Popover.Root>
