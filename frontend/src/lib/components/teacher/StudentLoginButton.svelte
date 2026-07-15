<!-- The one-click control Samira uses to confirm a student and give them access
     (Phase 13, Task 13.6). Clicking calls the `createStudentLogin` Cloud
     Function, which creates the student's Firebase Auth account — or resets its
     password if the email already has one — and returns a fresh password.

     Login IS the confirmation: there is no separate confirm step.

     The password is shown ONCE, here, and is never stored: not in Firestore, not
     in this component beyond the open reveal. Samira copies it and sends it to
     the student over Telegram herself — the site never sends it.

     On the label: it reads "Create login" until we know an account exists, then
     "Reset password". Only the server knows for sure, and asking it about every
     row on every load would cost a round trip per student to decide one word —
     so we learn it from the response instead. The Phase 13 spec explicitly
     allows this simpler path, and the reveal always names what really happened,
     so the label can never mislead Samira into the wrong action. -->
<script>
	import { _ } from 'svelte-i18n';
	import { createStudentLogin } from '$lib/services/auth.js';
	import Button from '$lib/components/common/Button.svelte';

	/** @type {{ email?: string }} */
	let { email } = $props();

	let busy = $state(false);
	let error = $state(false);
	// The open one-time reveal: null when nothing to show.
	let result = $state(
		/** @type {{ action: 'created' | 'reset', password: string } | null} */ (null)
	);
	let copied = $state(false);
	// Set once the server confirms this email has an account, so the button stops
	// offering to "create" one it just made. Resets on reload — harmless, since
	// the next response corrects it again.
	let hasLogin = $state(false);

	async function handleClick() {
		if (!email) return;
		busy = true;
		error = false;
		copied = false;
		try {
			const r = await createStudentLogin(email);
			result = { action: r.action, password: r.password };
			hasLogin = true; // either way, the account exists now
		} catch (err) {
			console.error('createStudentLogin failed:', err);
			error = true;
		} finally {
			busy = false;
		}
	}

	async function copy() {
		if (!result) return;
		try {
			await navigator.clipboard.writeText(result.password);
			copied = true;
		} catch (err) {
			// Clipboard blocked (permissions, insecure origin) — the password is
			// selectable on screen anyway, so this is not worth an error state.
			console.error('Copy failed:', err);
		}
	}

	// Dismissing is deliberate: it makes "you won't see this again" true.
	function dismiss() {
		result = null;
		copied = false;
	}
</script>

{#if email}
	<div class="login-cell">
		<Button variant="secondary" disabled={busy} onclick={handleClick}>
			{#if busy}
				{$_('studentLogin.working')}
			{:else if hasLogin}
				{$_('studentLogin.reset')}
			{:else}
				{$_('studentLogin.create')}
			{/if}
		</Button>

		{#if error}
			<p class="error">{$_('studentLogin.error')}</p>
		{/if}

		{#if result}
			<div class="reveal">
				<p class="reveal-title">
					{result.action === 'created'
						? $_('studentLogin.created')
						: $_('studentLogin.resetDone')}
				</p>
				<code class="password">{result.password}</code>
				<div class="reveal-actions">
					<Button onclick={copy}>
						{copied ? $_('studentLogin.copied') : $_('studentLogin.copy')}
					</Button>
					<Button variant="secondary" onclick={dismiss}>{$_('studentLogin.done')}</Button>
				</div>
				<p class="warning">{$_('studentLogin.onceNotice')}</p>
			</div>
		{/if}
	</div>
{:else}
	<span class="muted">—</span>
{/if}

<style>
	.login-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		align-items: start;
	}
	/* The reveal is loud on purpose: this is the only time the password exists
	   anywhere Samira can see it. */
	.reveal {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		align-items: start;
		padding: var(--space-3);
		background: var(--color-bg);
		border: 2px solid var(--color-accent);
		border-radius: var(--radius);
		min-width: 15rem;
	}
	.reveal-title {
		margin: 0;
		font-weight: 700;
		font-size: 0.9rem;
	}
	.password {
		align-self: stretch;
		padding: var(--space-2) var(--space-3);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-align: center;
		/* One click selects the whole password — it is meant to be copied. */
		user-select: all;
	}
	.reveal-actions {
		display: flex;
		gap: var(--space-2);
	}
	.warning {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--color-text-muted);
		max-width: 24ch;
	}
	.error {
		margin: 0;
		font-size: 0.8rem;
		color: var(--color-danger);
		font-weight: 600;
	}
	.muted {
		color: var(--color-text-muted);
	}
</style>
