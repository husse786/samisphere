<!-- Teacher login form. On success, the dashboard page's auth listener swaps
     this view for the dashboard content. -->
<script>
	import { signIn } from '$lib/services/auth.js';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let busy = $state(false);

	async function handleSubmit(/** @type {SubmitEvent} */ event) {
		event.preventDefault();
		error = '';
		busy = true;
		try {
			await signIn(email.trim(), password);
			// The dashboard's onAuthChange listener handles the redirect to content.
		} catch (err) {
			console.error('Login failed:', err);
			error = 'Incorrect email or password.';
		} finally {
			busy = false;
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<h2>Teacher login</h2>
	<label>
		Email
		<input type="email" bind:value={email} autocomplete="username" />
	</label>
	<label>
		Password
		<input type="password" bind:value={password} autocomplete="current-password" />
	</label>
	<button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
	{#if error}
		<p>{error}</p>
	{/if}
</form>
