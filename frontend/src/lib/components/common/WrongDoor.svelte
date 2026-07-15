<!-- "You're at the wrong door" (Phase 13, Task 13.7). Shown when someone signs in
     successfully but on the other dashboard's page: the teacher landing on /my,
     or a student landing on /dashboard.

     Their login worked — nothing is broken and nothing is denied — so this is a
     signpost, not an error. It must never surface a raw Firebase message.
     Shared by both pages so the two directions stay symmetrical.

     `tone` picks the surface: "dark" on the student page, "light" on the
     teacher's dashboard. -->
<script>
	import { _ } from 'svelte-i18n';

	/** @type {{ message: string, linkHref: string, linkLabel: string, email?: string | null, tone?: 'dark' | 'light', onLogout: () => void }} */
	let { message, linkHref, linkLabel, email, tone = 'dark', onLogout } = $props();
</script>

<div class="wrong-door {tone}">
	{#if email}
		<p class="who">{$_('studentArea.signedInAs', { values: { email } })}</p>
	{/if}
	<p class="message">{message}</p>
	<div class="actions">
		<a class="go" href={linkHref}>{linkLabel} →</a>
		<button type="button" class="logout" onclick={onLogout}>
			{$_('studentArea.logout')}
		</button>
	</div>
</div>

<style>
	.wrong-door {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		align-items: start;
		max-width: 460px;
		padding: var(--space-6);
		border-radius: var(--radius);
		text-align: start;
	}
	.who {
		margin: 0;
		font-size: 0.9rem;
	}
	.message {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.6;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-4);
	}
	.go {
		font-weight: 700;
	}
	.logout {
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		font-size: 0.9rem;
		text-decoration: underline;
		cursor: pointer;
	}

	/* On the dark student page. */
	.dark {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--color-dark-border);
	}
	.dark .who,
	.dark .logout {
		color: var(--color-dark-muted);
	}
	.dark .message {
		color: var(--color-dark-text);
	}
	.dark .go {
		color: var(--color-brand-cyan);
	}
	.dark .logout:hover {
		color: var(--color-dark-text);
	}

	/* On the light teacher dashboard. */
	.light {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow);
	}
	.light .who,
	.light .logout {
		color: var(--color-text-muted);
	}
	.light .message {
		color: var(--color-text);
	}
	.light .go {
		color: var(--color-primary);
	}
	.light .logout:hover {
		color: var(--color-text);
	}
</style>
