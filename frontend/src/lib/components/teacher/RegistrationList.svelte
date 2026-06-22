<!-- Clean list of all registrations for the teacher. Replaces the temporary
     public list from Phase 3. Only rendered once the teacher is logged in. -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
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

<h2>{$_('registrations.title')}</h2>

{#if loading}
	<p>{$_('common.loading')}</p>
{:else if registrations.length === 0}
	<p>{$_('registrations.empty')}</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>{$_('registrations.name')}</th>
				<th>{$_('registrations.course')}</th>
				<th>{$_('registrations.time')}</th>
				<th>{$_('registrations.date')}</th>
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
