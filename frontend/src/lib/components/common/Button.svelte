<!-- Shared button. Variants: primary (default), secondary, danger.
     Uses theme tokens so every button matches site-wide. -->
<script>
	/** @type {{
	 *   variant?: 'primary' | 'secondary' | 'danger',
	 *   type?: 'button' | 'submit' | 'reset',
	 *   disabled?: boolean,
	 *   onclick?: (event: MouseEvent) => void,
	 *   children: import('svelte').Snippet
	 * }} */
	let {
		variant = 'primary',
		type = 'button',
		disabled = false,
		onclick = undefined,
		children
	} = $props();
</script>

<button class="btn {variant}" {type} {disabled} {onclick}>
	{@render children()}
</button>

<style>
	.btn {
		font: inherit;
		font-weight: 600;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius);
		border: 1px solid transparent;
		cursor: pointer;
		transition: background 0.15s ease, border-color 0.15s ease;
	}
	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.primary {
		background: var(--color-primary);
		color: var(--color-on-primary);
	}
	.primary:hover:not(:disabled) {
		background: var(--color-primary-hover);
	}

	.secondary {
		background: var(--color-surface);
		color: var(--color-text);
		border-color: var(--color-border);
	}
	.secondary:hover:not(:disabled) {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.danger {
		background: var(--color-surface);
		color: var(--color-danger);
		border-color: var(--color-border);
	}
	.danger:hover:not(:disabled) {
		border-color: var(--color-danger);
	}
</style>
