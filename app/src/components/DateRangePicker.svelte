<script lang="ts">
	import { Calendar } from 'svelte-radix';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('de-DE', {
		dateStyle: 'medium'
	});

	const start = today('Europe/Berlin');
	const end = start.add({ days: 7 });

	let value = $state({
		start,
		end
	});

	let startValue: DateValue | undefined = $state(new CalendarDate(start.year, start.month, start.day));

	const onSubmit = (event: Event) => {
		event.preventDefault();

		new FormData(event.target as HTMLFormElement);
	};
</script>

<div class="grid gap-2 pt-4" onsubmit={onSubmit}>
	<Popover.Root openFocus>
		<Popover.Trigger asChild >
			{#snippet children({ builder })}
						<Button
					variant="input"
					class={cn(
						' input justify-start text-left font-normal w-full bg-base-100',
						!value && 'text-muted-foreground'
					)}
					builders={[builder]}
				>
					<Calendar class="mr-2 h-4 w-4" />
					{#if value && value.start}
						{#if value.end}
							{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
								value.end.toDate(getLocalTimeZone())
							)}
						{:else}
							{df.format(value.start.toDate(getLocalTimeZone()))}
						{/if}
					{:else if startValue}
						{df.format(startValue.toDate(getLocalTimeZone()))}
					{:else}
						Pick a date
					{/if}
				</Button>
								{/snippet}
				</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar
				bind:value
				bind:startValue
				placeholder={value?.start}
				initialFocus
				numberOfMonths={2}
			/>
		</Popover.Content>
	</Popover.Root>
	<input type="hidden" name="date_start" value={value.start} />
	<input type="hidden" name="date_end" value={value.end} />
</div>
