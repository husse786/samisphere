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
		/** @type {Array<{ id: string, course: string, time: string, status: string, capacity?: number, meetingLink?: string }>} */ ([])
	);
	let loading = $state(true);

	// Add-form fields.
	let newCourse = $state('');
	let newTime = $state('');
	let newMeetingLink = $state('');

	// Inline edit state.
	let editingId = $state(/** @type {string | null} */ (null));
	let editCourse = $state('');
	let editTime = $state('');
	let editMeetingLink = $state('');

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
			meetingLink: newMeetingLink.trim()
		});
		newCourse = '';
		newTime = '';
		newMeetingLink = '';
		await load();
	}

	async function toggle(/** @type {{ id: string, status: string }} */ c) {
		await setCourseStatus(c.id, c.status === 'available' ? 'hidden' : 'available');
		await load();
	}

	function startEdit(
		/** @type {{ id: string, course: string, time: string, meetingLink?: string }} */ c
	) {
		editingId = c.id;
		editCourse = c.course;
		editTime = c.time;
		editMeetingLink = c.meetingLink ?? '';
	}

	function cancelEdit() {
		editingId = null;
	}

	async function saveEdit(/** @type {string} */ id) {
		if (!editCourse.trim() || !editTime.trim()) return;
		await updateCourse(id, {
			course: editCourse.trim(),
			time: editTime.trim(),
			meetingLink: editMeetingLink.trim() // empty string clears the link
		});
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
