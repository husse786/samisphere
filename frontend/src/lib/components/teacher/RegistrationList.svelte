<!-- Clean list of all registrations for the teacher. Shows each student's
     details, chosen course, optional comment, a payment toggle, and a Delete
     control. Only rendered once the teacher is logged in. -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import {
		getRegistrations,
		deleteRegistration,
		setRegistrationPaid
	} from '$lib/services/registrations.js';
	import Button from '$lib/components/common/Button.svelte';
	import StudentLoginButton from './StudentLoginButton.svelte';

	let registrations = $state(
		/** @type {Array<{ id: string, firstName?: string, lastName?: string, name?: string, email?: string, phone?: string, city?: string, country?: string, course?: string, time?: string, comment?: string, paid?: boolean, paidAt?: string, date: string }>} */ ([])
	);
	let loading = $state(true);

	async function load() {
		registrations = await getRegistrations();
	}

	onMount(async () => {
		try {
			await load();
		} finally {
			loading = false;
		}
	});

	async function remove(/** @type {{ id: string }} */ r) {
		// Irreversible → confirm first; cancelling does nothing (doc 03, Phase 12).
		if (!confirm($_('registrations.confirmDelete'))) return;
		await deleteRegistration(r.id);
		await load();
	}

	// Flip one registration's paid status (Phase 13). Payment is per registration,
	// so a student can be paid for one course and unpaid for another. The row
	// updates optimistically, then the list reloads to pick up the stamped date.
	async function togglePaid(
		/** @type {{ id: string, paid?: boolean }} */ r
	) {
		const next = !r.paid;
		r.paid = next; // instant feedback, like the course show/hide toggle
		await setRegistrationPaid(r.id, next);
		await load();
	}

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
					<th>{$_('registrations.comment')}</th>
					<th>{$_('registrations.payment')}</th>
					<th>{$_('registrations.date')}</th>
					<th>{$_('studentLogin.column')}</th>
					<th>{$_('registrations.actions')}</th>
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
						<td>
							{#if r.comment}
								<span class="comment">{r.comment}</span>
							{:else}
								<span class="muted">—</span>
							{/if}
						</td>
						<td>
							<!-- Absent `paid` (old records) reads as not paid. -->
							<span class="badge" class:paid={r.paid}>
								{r.paid ? $_('registrations.paid') : $_('registrations.notPaid')}
							</span>
							{#if r.paid && r.paidAt}
								<span class="paid-at">{r.paidAt}</span>
							{/if}
							<Button variant="secondary" onclick={() => togglePaid(r)}>
								{r.paid ? $_('registrations.markUnpaid') : $_('registrations.markPaid')}
							</Button>
						</td>
						<td>{r.date}</td>
						<td>
							<!-- Creating the login IS confirming the student (Phase 13). -->
							<StudentLoginButton email={r.email} />
						</td>
						<td>
							<Button variant="danger" onclick={() => remove(r)}>
								{$_('registrations.delete')}
							</Button>
						</td>
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
		min-width: 940px;
	}
	/* Payment cell: badge, the date it was paid, then the one-click toggle. */
	.badge {
		display: inline-block;
		padding: 0.1rem var(--space-2);
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
		background: var(--color-unpaid-bg);
		color: var(--color-unpaid-text);
	}
	.badge.paid {
		background: var(--color-paid-bg);
		color: var(--color-paid-text);
	}
	.paid-at {
		display: block;
		margin: var(--space-1) 0;
		font-size: 0.75rem;
		color: var(--color-text-muted);
		white-space: nowrap;
	}
	.comment {
		display: inline-block;
		max-width: 22ch;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.muted {
		color: var(--color-text-muted);
	}
</style>
