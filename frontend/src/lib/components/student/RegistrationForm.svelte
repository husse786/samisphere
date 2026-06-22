<!-- Student registration form. Name + course/time-slot dropdown.
     Saves name + chosen course + time as one registration. -->
<script>
	import { _ } from 'svelte-i18n';
	import { createRegistration } from '$lib/services/registrations.js';
	import CourseDropdown from './CourseDropdown.svelte';

	// Optional callback so a parent can react to a successful save.
	let { onsaved = () => {} } = $props();

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
		{$_('form.name')}
		<input bind:value={name} placeholder={$_('form.namePlaceholder')} />
	</label>
	<CourseDropdown bind:selected={selectedCourse} />
	<button type="submit" disabled={status === 'saving'}>
		{status === 'saving' ? $_('form.saving') : $_('form.register')}
	</button>
</form>

{#if status === 'saved'}
	<p>{$_('form.saved')}</p>
{:else if status === 'incomplete'}
	<p>{$_('form.incomplete')}</p>
{:else if status === 'error'}
	<p>{$_('form.error')}</p>
{/if}
