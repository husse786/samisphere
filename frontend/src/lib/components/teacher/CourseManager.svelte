<!-- Teacher course management: add a course/slot, edit it, and toggle each one
     on/off. Hiding a slot removes it from the student dropdown (doc 01 §6). -->
<script>
	import { onMount } from 'svelte';
	import {
		getAllCourses,
		addCourse,
		updateCourse,
		setCourseStatus
	} from '$lib/services/courses.js';

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

<h2>Manage courses</h2>

<form onsubmit={handleAdd}>
	<input bind:value={newCourse} placeholder="Course (e.g. Math 101)" />
	<input bind:value={newTime} placeholder="Time (e.g. Monday 10:00)" />
	<button type="submit">Add course</button>
</form>

{#if loading}
	<p>Loading…</p>
{:else if courses.length === 0}
	<p>No courses yet. Add one above.</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>Course</th>
				<th>Time</th>
				<th>Status</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each courses as c (c.id)}
				<tr>
					{#if editingId === c.id}
						<td><input bind:value={editCourse} /></td>
						<td><input bind:value={editTime} /></td>
						<td>{c.status}</td>
						<td>
							<button onclick={() => saveEdit(c.id)}>Save</button>
							<button onclick={cancelEdit}>Cancel</button>
						</td>
					{:else}
						<td>{c.course}</td>
						<td>{c.time}</td>
						<td>{c.status}</td>
						<td>
							<button onclick={() => toggle(c)}>
								{c.status === 'available' ? 'Hide' : 'Show'}
							</button>
							<button onclick={() => startEdit(c)}>Edit</button>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
