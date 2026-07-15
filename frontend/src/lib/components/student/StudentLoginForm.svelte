<!-- Student login form ( /my ). Mirrors the teacher's LoginForm in structure and
     styling — same card, same fields, same error handling — because it is the
     same kind of door (Phase 13, Task 13.7).

     Students never sign themselves up: Samira creates the account from her
     dashboard and sends the password over Telegram. So there is no "register"
     or "forgot password" link here — she reissues a password instead. -->
<script>
	import { _ } from 'svelte-i18n';
	import { signIn } from '$lib/services/auth.js';
	import Button from '$lib/components/common/Button.svelte';

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
			// The /my page's onAuthChange listener swaps this for the profile.
		} catch (err) {
			// Every failure reason (wrong password, unknown email, malformed email)
			// becomes ONE friendly message. Firebase's raw codes are unhelpful to a
			// student and would leak whether an account exists.
			console.error('Student login failed:', err);
			error = true;
		} finally {
			busy = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="login-form">
	<h2>{$_('studentArea.loginTitle')}</h2>
	<p class="hint">{$_('studentArea.loginHint')}</p>
	<label>
		{$_('login.email')}
		<input type="email" bind:value={email} autocomplete="username" />
	</label>
	<label>
		{$_('login.password')}
		<input type="password" bind:value={password} autocomplete="current-password" />
	</label>
	<Button type="submit" disabled={busy}>
		{busy ? $_('login.submitting') : $_('login.submit')}
	</Button>
	{#if error}
		<p class="error">{$_('login.error')}</p>
	{/if}
</form>

<style>
	.login-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 360px;
		background: var(--color-surface);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		text-align: start;
	}
	.login-form h2 {
		margin: 0;
	}
	.hint {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-text-muted);
	}
	.login-form :global(label),
	.login-form input,
	.login-form :global(.btn) {
		width: 100%;
	}
	.error {
		margin: 0;
		color: var(--color-danger);
		font-weight: 600;
	}
</style>
