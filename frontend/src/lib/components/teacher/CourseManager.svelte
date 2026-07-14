<!-- Teacher course management: add a course/slot, edit it, toggle each one
     on/off, and delete it. Hiding a slot removes it from the student dropdown
     (doc 01 §6). Each course can carry an optional price + period + currency
     (Phase 12). -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import {
		getAllCourses,
		addCourse,
		updateCourse,
		setCourseStatus,
		deleteCourse,
		formatMoney
	} from '$lib/services/courses.js';
	import Button from '$lib/components/common/Button.svelte';

	let courses = $state(
		/** @type {Array<{ id: string, course: string, time: string, status: string, capacity?: number, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }>} */ ([])
	);
	let loading = $state(true);

	// Add-form fields.
	let newCourse = $state('');
	let newTime = $state('');
	let newMeetingLink = $state('');
	let newPrice = $state('');
	let newPriceUnit = $state('hour');
	let newCurrency = $state('RUB');

	// Inline edit state.
	let editingId = $state(/** @type {string | null} */ (null));
	let editCourse = $state('');
	let editTime = $state('');
	let editMeetingLink = $state('');
	let editPrice = $state('');
	let editPriceUnit = $state('hour');
	let editCurrency = $state('RUB');

	// Parse a price input into a number, or undefined when blank/invalid.
	function parsePrice(/** @type {string} */ v) {
		const t = String(v ?? '').trim();
		if (t === '') return undefined;
		const n = Number(t);
		return Number.isNaN(n) ? undefined : n;
	}

	// Translated billing-period word shown after the price ("/ hour", "/ month").
	function unitLabel(/** @type {string | undefined} */ unit) {
		return unit === 'month' ? $_('courses.unitMonth') : $_('courses.unitHour');
	}

	// Full formatted price for the table, e.g. "$12.50 / hour", or null.
	function priceLabel(
		/** @type {{ price?: number, priceUnit?: string, currency?: string }} */ c
	) {
		const money = formatMoney(c);
		return money ? `${money} / ${unitLabel(c.priceUnit)}` : null;
	}

	async function load() {
		courses = await getAllCourses();
	}

	onMount(async () => {
		try {
			await load();
		} finally {
			loading = false;
		}
	});

	async function handleAdd(/** @type {SubmitEvent} */ event) {
		event.preventDefault();
		if (!newCourse.trim() || !newTime.trim()) return;
		await addCourse({
			course: newCourse.trim(),
			time: newTime.trim(),
			meetingLink: newMeetingLink.trim(),
			price: parsePrice(newPrice),
			priceUnit: newPriceUnit,
			currency: newCurrency
		});
		newCourse = '';
		newTime = '';
		newMeetingLink = '';
		newPrice = '';
		newPriceUnit = 'hour';
		newCurrency = 'RUB';
		await load();
	}

	async function toggle(/** @type {{ id: string, status: string }} */ c) {
		await setCourseStatus(c.id, c.status === 'available' ? 'hidden' : 'available');
		await load();
	}

	async function remove(/** @type {{ id: string }} */ c) {
		// Irreversible → confirm first; cancelling does nothing (doc 03, Phase 12).
		if (!confirm($_('courses.confirmDelete'))) return;
		await deleteCourse(c.id);
		await load();
	}

	function startEdit(
		/** @type {{ id: string, course: string, time: string, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }} */ c
	) {
		editingId = c.id;
		editCourse = c.course;
		editTime = c.time;
		editMeetingLink = c.meetingLink ?? '';
		editPrice = typeof c.price === 'number' ? String(c.price) : '';
		editPriceUnit = c.priceUnit ?? 'hour';
		editCurrency = c.currency ?? 'RUB';
	}

	function cancelEdit() {
		editingId = null;
	}

	async function saveEdit(/** @type {string} */ id) {
		if (!editCourse.trim() || !editTime.trim()) return;
		/** @type {{ course: string, time: string, meetingLink: string, price?: number, priceUnit?: string, currency?: string }} */
		const fields = {
			course: editCourse.trim(),
			time: editTime.trim(),
			meetingLink: editMeetingLink.trim() // empty string clears the link
		};
		const priceNum = parsePrice(editPrice);
		if (priceNum !== undefined) {
			// Only send price when set — Firestore rejects undefined values, and a
			// blank field leaves any existing price untouched.
			fields.price = priceNum;
			fields.priceUnit = editPriceUnit;
			fields.currency = editCurrency;
		}
		await updateCourse(id, fields);
		editingId = null;
		await load();
	}
</script>

<h2>{$_('courses.title')}</h2>

<form onsubmit={handleAdd} class="add-form">
	<input bind:value={newCourse} placeholder={$_('courses.coursePlaceholder')} />
	<input bind:value={newTime} placeholder={$_('courses.timePlaceholder')} />
	<input
		bind:value={newMeetingLink}
		placeholder={$_('courses.meetingLinkPlaceholder')}
		type="url"
	/>
	<input
		bind:value={newPrice}
		placeholder={$_('courses.pricePlaceholder')}
		type="number"
		step="0.01"
		min="0"
	/>
	<select bind:value={newPriceUnit} aria-label={$_('courses.price')}>
		<option value="hour">{$_('courses.perHour')}</option>
		<option value="month">{$_('courses.perMonth')}</option>
	</select>
	<select bind:value={newCurrency} aria-label={$_('courses.price')}>
		<option value="RUB">{$_('courses.currencyRub')}</option>
		<option value="USD">{$_('courses.currencyUsd')}</option>
	</select>
	<Button type="submit">{$_('courses.add')}</Button>
</form>

{#if loading}
	<p>{$_('common.loading')}</p>
{:else if courses.length === 0}
	<p>{$_('courses.empty')}</p>
{:else}
	<div class="table-scroll">
	<table>
		<thead>
			<tr>
				<th>{$_('courses.course')}</th>
				<th>{$_('courses.time')}</th>
				<th>{$_('courses.price')}</th>
				<th>{$_('courses.status')}</th>
				<th>{$_('courses.link')}</th>
					<th>{$_('courses.actions')}</th>
			</tr>
		</thead>
		<tbody>
			{#each courses as c (c.id)}
				<tr>
					{#if editingId === c.id}
						<td><input bind:value={editCourse} /></td>
						<td><input bind:value={editTime} /></td>
						<td>
							<div class="price-edit">
								<input
									bind:value={editPrice}
									placeholder={$_('courses.pricePlaceholder')}
									type="number"
									step="0.01"
									min="0"
								/>
								<select bind:value={editPriceUnit} aria-label={$_('courses.price')}>
									<option value="hour">{$_('courses.perHour')}</option>
									<option value="month">{$_('courses.perMonth')}</option>
								</select>
								<select bind:value={editCurrency} aria-label={$_('courses.price')}>
									<option value="RUB">{$_('courses.currencyRub')}</option>
									<option value="USD">{$_('courses.currencyUsd')}</option>
								</select>
							</div>
						</td>
						<td>{c.status === 'available' ? $_('courses.statusAvailable') : $_('courses.statusHidden')}</td>
						<td>
							<input
								bind:value={editMeetingLink}
								placeholder={$_('courses.meetingLinkPlaceholder')}
								type="url"
							/>
						</td>
						<td class="actions">
							<Button onclick={() => saveEdit(c.id)}>{$_('courses.save')}</Button>
							<Button variant="secondary" onclick={cancelEdit}>{$_('courses.cancel')}</Button>
						</td>
					{:else}
						<td>{c.course}</td>
						<td>{c.time}</td>
						<td>
							{#if priceLabel(c)}
								<span class="price">{priceLabel(c)}</span>
							{:else}
								<span class="muted">{$_('courses.noPrice')}</span>
							{/if}
						</td>
						<td>
							<span class="badge" class:hidden={c.status !== 'available'}>
								{c.status === 'available' ? $_('courses.statusAvailable') : $_('courses.statusHidden')}
							</span>
						</td>
						<td>
							{#if c.meetingLink}
								<a class="start-link" href={c.meetingLink} target="_blank" rel="noopener">
									{$_('courses.startClass')}
								</a>
								<span class="raw-url">{c.meetingLink}</span>
							{:else}
								<span class="muted">{$_('courses.noLink')}</span>
							{/if}
						</td>
						<td class="actions">
							<Button variant="secondary" onclick={() => toggle(c)}>
								{c.status === 'available' ? $_('courses.hide') : $_('courses.show')}
							</Button>
							<Button variant="secondary" onclick={() => startEdit(c)}>{$_('courses.edit')}</Button>
							<Button variant="danger" onclick={() => remove(c)}>{$_('courses.delete')}</Button>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
	</div>
{/if}

<style>
	.table-scroll {
		overflow-x: auto;
	}
	.table-scroll table {
		min-width: 820px;
	}
	.add-form {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}
	.add-form input {
		flex: 1 1 12rem;
	}
	.add-form input[type='number'] {
		flex: 1 1 7rem;
	}
	.price-edit {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}
	.price-edit input[type='number'] {
		width: 6rem;
	}
	.price {
		white-space: nowrap;
		font-weight: 600;
	}
	.actions {
		display: flex;
		gap: var(--space-2);
	}
	.badge {
		display: inline-block;
		padding: 0.1rem var(--space-2);
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
		background: #d1fae5;
		color: #047857;
	}
	.badge.hidden {
		background: #e5e7eb;
		color: var(--color-text-muted);
	}
	.start-link {
		display: inline-block;
		padding: 0.2rem var(--space-3);
		border-radius: var(--radius);
		background: var(--color-primary);
		color: var(--color-on-primary);
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}
	.start-link:hover {
		background: var(--color-primary-hover);
		text-decoration: none;
	}
	.raw-url {
		display: block;
		margin-top: var(--space-1);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		word-break: break-all;
		user-select: all;
	}
	.muted {
		color: var(--color-text-muted);
		font-size: 0.85rem;
	}
</style>
