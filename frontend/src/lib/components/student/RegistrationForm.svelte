<!-- Student registration form. Phase 3: bare-bones (name + submit).
     Phase 4 adds the course/time-slot dropdown. -->
<script>
	import { createRegistration } from '$lib/services/registrations.js';

	// Parent passes a callback so the temporary list can refresh after a save.
	let { onsaved } = $props();

	let name = $state('');
	let status = $state('idle'); // 'idle' | 'saving' | 'saved' | 'error'

	async function handleSubmit(/** @type {SubmitEvent} */ event) {
		event.preventDefault();
		if (!name.trim()) return;
		status = 'saving';
		try {
			await createRegistration({ name: name.trim() });
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
	<button type="submit" disabled={status === 'saving'}>
		{status === 'saving' ? 'Saving…' : 'Register'}
	</button>
</form>

{#if status === 'saved'}
	<p>Registration saved.</p>
{:else if status === 'error'}
	<p>Something went wrong. Please try again.</p>
{/if}
