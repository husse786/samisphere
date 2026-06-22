<!-- Teacher login form. On success, the dashboard page's auth listener swaps
     this view for the dashboard content. -->
<script>
	import { _ } from 'svelte-i18n';
	import { signIn } from '$lib/services/auth.js';

	let email = $state('');
	let password = $state('');
	let error = $state(false);
	let busy = $state(false);

	async function handleSubmit(/** @type {SubmitEvent} */ event) {
		event.preventDefault();
		error = false;
		busy = true;
		try {
			await signIn(email.trim(), password);
			// The dashboard's onAuthChange listener handles the redirect to content.
		} catch (err) {
			console.error('Login failed:', err);
			error = true;
		} finally {
			busy = false;
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<h2>{$_('login.title')}</h2>
	<label>
		{$_('login.email')}
		<input type="email" bind:value={email} autocomplete="username" />
	</label>
	<label>
		{$_('login.password')}
		<input type="password" bind:value={password} autocomplete="current-password" />
	</label>
	<button type="submit" disabled={busy}>
		{busy ? $_('login.submitting') : $_('login.submit')}
	</button>
	{#if error}
		<p>{$_('login.error')}</p>
	{/if}
</form>
