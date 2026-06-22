<!-- Clean list of all registrations for the teacher. Replaces the temporary
     public list from Phase 3. Only rendered once the teacher is logged in. -->
<script>
	import { onMount } from 'svelte';
	import { getRegistrations } from '$lib/services/registrations.js';

	let registrations = $state(
		/** @type {Array<{ id: string, name: string, date: string, course?: string, time?: string }>} */ ([])
	);
	let loading = $state(true);

	onMount(async () => {
		try {
			registrations = await getRegistrations();
		} finally {
			loading = false;
		}
	});
</script>

<h2>Registrations</h2>

{#if loading}
	<p>Loading…</p>
{:else if registrations.length === 0}
	<p>No registrations yet.</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Course</th>
				<th>Time</th>
				<th>Date</th>
			</tr>
		</thead>
		<tbody>
			{#each registrations as r (r.id)}
				<tr>
					<td>{r.name}</td>
					<td>{r.course ?? '—'}</td>
					<td>{r.time ?? '—'}</td>
					<td>{r.date}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
