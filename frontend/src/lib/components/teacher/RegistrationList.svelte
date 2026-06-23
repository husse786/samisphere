<!-- Clean list of all registrations for the teacher. Shows each student's
     details and chosen course. Only rendered once the teacher is logged in. -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { getRegistrations } from '$lib/services/registrations.js';

	let registrations = $state(
		/** @type {Array<{ id: string, firstName?: string, lastName?: string, name?: string, email?: string, phone?: string, city?: string, country?: string, course?: string, time?: string, date: string }>} */ ([])
	);
	let loading = $state(true);

	onMount(async () => {
		try {
			registrations = await getRegistrations();
		} finally {
			loading = false;
		}
	});

	// Full name from first+last, falling back to the legacy single `name` field.
	function fullName(/** @type {{ firstName?: string, lastName?: string, name?: string }} */ r) {
		const joined = [r.firstName, r.lastName].filter(Boolean).join(' ');
		return joined || r.name || '—';
	}

	// "City, Country" — whatever parts are present.
	function location(/** @type {{ city?: string, country?: string }} */ r) {
		return [r.city, r.country].filter(Boolean).join(', ') || '—';
	}
</script>

<h2>{$_('registrations.title')}</h2>

{#if loading}
	<p>{$_('common.loading')}</p>
{:else if registrations.length === 0}
	<p>{$_('registrations.empty')}</p>
{:else}
	<div class="table-scroll">
		<table>
			<thead>
				<tr>
					<th>{$_('registrations.name')}</th>
					<th>{$_('registrations.email')}</th>
					<th>{$_('registrations.phone')}</th>
					<th>{$_('registrations.location')}</th>
					<th>{$_('registrations.course')}</th>
					<th>{$_('registrations.time')}</th>
					<th>{$_('registrations.date')}</th>
				</tr>
			</thead>
			<tbody>
				{#each registrations as r (r.id)}
					<tr>
						<td>{fullName(r)}</td>
						<td>{r.email ?? '—'}</td>
						<td>{r.phone ?? '—'}</td>
						<td>{location(r)}</td>
						<td>{r.course ?? '—'}</td>
						<td>{r.time ?? '—'}</td>
						<td>{r.date}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	/* Many columns — let the table scroll horizontally on narrow screens. */
	.table-scroll {
		overflow-x: auto;
	}
	table {
		min-width: 640px;
	}
</style>
