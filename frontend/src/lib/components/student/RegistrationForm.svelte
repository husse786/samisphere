<!-- Student registration form. Name + course/time-slot dropdown.
     Saves name + chosen course + time as one registration. -->
<script>
	import { _ } from 'svelte-i18n';
	import { createRegistration } from '$lib/services/registrations.js';
	import CourseDropdown from './CourseDropdown.svelte';
	import Button from '$lib/components/common/Button.svelte';

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

<form onsubmit={handleSubmit} class="reg-form">
	<label>
		{$_('form.name')}
		<input bind:value={name} placeholder={$_('form.namePlaceholder')} />
	</label>
	<CourseDropdown bind:selected={selectedCourse} />
	<Button type="submit" disabled={status === 'saving'}>
		{status === 'saving' ? $_('form.saving') : $_('form.register')}
	</Button>
</form>

{#if status === 'saved'}
	<p class="msg success">{$_('form.saved')}</p>
{:else if status === 'incomplete'}
	<p class="msg">{$_('form.incomplete')}</p>
{:else if status === 'error'}
	<p class="msg error">{$_('form.error')}</p>
{/if}

<style>
	.reg-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		align-items: stretch;
		max-width: 360px;
		background: var(--color-surface);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}
	.reg-form :global(label),
	.reg-form :global(input),
	.reg-form :global(select),
	.reg-form :global(.btn) {
		width: 100%;
	}
	.msg {
		margin-top: var(--space-4);
		font-weight: 600;
	}
	.msg.success {
		color: var(--color-accent);
	}
	.msg.error {
		color: var(--color-danger);
	}
</style>
