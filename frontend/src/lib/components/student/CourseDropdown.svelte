<!-- Course/time-slot dropdown for the student form. Lists ONLY available slots
     (hidden ones are filtered out by the service query, so they never appear).
     Binds `selected` — the chosen { course, time } object, or null. -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { getAvailableCourses } from '$lib/services/courses.js';

	let {
		selected = $bindable(
			/** @type {{ id: string, course: string, time: string } | null} */ (null)
		)
	} = $props();

	let courses = $state(
		/** @type {Array<{ id: string, course: string, time: string }>} */ ([])
	);
	let selectedId = $state('');

	onMount(async () => {
		courses = await getAvailableCourses();
	});

	// Keep the bound `selected` object in sync with the chosen id.
	$effect(() => {
		selected = courses.find((c) => c.id === selectedId) ?? null;
	});
</script>

<label>
	{$_('form.course')}
	<select bind:value={selectedId}>
		<option value="" disabled>{$_('form.chooseCourse')}</option>
		{#each courses as c (c.id)}
			<option value={c.id}>{c.course} — {c.time}</option>
		{/each}
	</select>
</label>
