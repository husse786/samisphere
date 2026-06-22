<!-- Student registration form. Name + course/time-slot dropdown.
     Saves name + chosen course + time as one registration. -->
<script>
	import { createRegistration } from '$lib/services/registrations.js';
	import CourseDropdown from './CourseDropdown.svelte';

	// Parent passes a callback so the temporary list can refresh after a save.
	let { onsaved } = $props();

	let name = $state('');
	let selectedCourse = $state(
		/** @type {{ course: string, time: string } | null} */ (null)
	);
	let status = $state('idle'); // 'idle' | 'incomplete' | 'saving' | 'saved' | 'error'

	async function handleSubmit(/** @type {SubmitEvent} */ event) {
		event.preventDefault();
		if (!name.trim() || !selectedCourse) {
			status = 'incomplete';
			return;
		}
		status = 'saving';
		try {
			await createRegistration({
				name: name.trim(),
				course: selectedCourse.course,
				time: selectedCourse.time
			});
			name = '';
			status = 'saved';
			onsaved?.();
		} catch (err) {
			console.error('Registration failed:', err);
			status = 'error';
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<label>
		Name
		<input bind:value={name} placeholder="Your name" />
	</label>
	<CourseDropdown bind:selected={selectedCourse} />
	<button type="submit" disabled={status === 'saving'}>
		{status === 'saving' ? 'Saving…' : 'Register'}
	</button>
</form>

{#if status === 'saved'}
	<p>Registration saved.</p>
{:else if status === 'incomplete'}
	<p>Please enter your name and choose a course.</p>
{:else if status === 'error'}
	<p>Something went wrong. Please try again.</p>
{/if}
