<!-- Teacher course management: add a course/slot, edit it, and toggle each one
     on/off. Hiding a slot removes it from the student dropdown (doc 01 §6). -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import {
		getAllCourses,
		addCourse,
		updateCourse,
		setCourseStatus
	} from '$lib/services/courses.js';
	import Button from '$lib/components/common/Button.svelte';

	let courses = $state(
		/** @type {Array<{ id: string, course: string, time: string, status: string, capacity?: number }>} */ ([])
	);
	let loading = $state(true);

	// Add-form fields.
	let newCourse = $state('');
	let newTime = $state('');

	// Inline edit state.
	let editingId = $state(/** @type {string | null} */ (null));
	let editCourse = $state('');
	let editTime = $state('');

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
		await addCourse({ course: newCourse.trim(), time: newTime.trim() });
		newCourse = '';
		newTime = '';
		await load();
	}

	async function toggle(/** @type {{ id: string, status: string }} */ c) {
		await setCourseStatus(c.id, c.status === 'available' ? 'hidden' : 'available');
		await load();
	}

	function startEdit(/** @type {{ id: string, course: string, time: string }} */ c) {
		editingId = c.id;
		editCourse = c.course;
		editTime = c.time;
	}

	function cancelEdit() {
		editingId = null;
	}

	async function saveEdit(/** @type {string} */ id) {
		if (!editCourse.trim() || !editTime.trim()) return;
		await updateCourse(id, { course: editCourse.trim(), time: editTime.trim() });
		editingId = null;
		await load();
	}
</script>

<h2>{$_('courses.title')}</h2>

<form onsubmit={handleAdd} class="add-form">
	<input bind:value={newCourse} placeholder={$_('courses.coursePlaceholder')} />
	<input bind:value={newTime} placeholder={$_('courses.timePlaceholder')} />
	<Button type="submit">{$_('courses.add')}</Button>
</form>

{#if loading}
	<p>{$_('common.loading')}</p>
{:else if courses.length === 0}
	<p>{$_('courses.empty')}</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>{$_('courses.course')}</th>
				<th>{$_('courses.time')}</th>
				<th>{$_('courses.status')}</th>
				<th>{$_('courses.actions')}</th>
			</tr>
		</thead>
		<tbody>
			{#each courses as c (c.id)}
				<tr>
					{#if editingId === c.id}
						<td><input bind:value={editCourse} /></td>
						<td><input bind:value={editTime} /></td>
						<td>{c.status === 'available' ? $_('courses.statusAvailable') : $_('courses.statusHidden')}</td>
						<td class="actions">
							<Button onclick={() => saveEdit(c.id)}>{$_('courses.save')}</Button>
							<Button variant="secondary" onclick={cancelEdit}>{$_('courses.cancel')}</Button>
						</td>
					{:else}
						<td>{c.course}</td>
						<td>{c.time}</td>
						<td>
							<span class="badge" class:hidden={c.status !== 'available'}>
								{c.status === 'available' ? $_('courses.statusAvailable') : $_('courses.statusHidden')}
							</span>
						</td>
						<td class="actions">
							<Button variant="secondary" onclick={() => toggle(c)}>
								{c.status === 'available' ? $_('courses.hide') : $_('courses.show')}
							</Button>
							<Button variant="secondary" onclick={() => startEdit(c)}>{$_('courses.edit')}</Button>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
	.add-form {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}
	.add-form input {
		flex: 1 1 12rem;
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
</style>
