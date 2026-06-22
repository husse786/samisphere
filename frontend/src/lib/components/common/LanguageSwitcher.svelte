<!-- Prominent language switcher: 🇬🇧 🇷🇺 🇮🇷. The active language is highlighted.
     Clicking one switches all text site-wide and (for Persian) flips to RTL.
     Visual styling lands in Phase 8; this is the working mechanism. -->
<script>
	import { locale } from 'svelte-i18n';
	import { LANGUAGES, setLanguage } from '$lib/stores/language.js';
</script>

<nav class="language-switcher" aria-label="Language">
	{#each LANGUAGES as lang (lang.code)}
		<button
			type="button"
			class="lang"
			class:active={$locale === lang.code}
			aria-pressed={$locale === lang.code}
			title={lang.label}
			onclick={() => setLanguage(lang.code)}
		>
			<span class="flag">{lang.flag}</span>
			<span class="label">{lang.label}</span>
		</button>
	{/each}
</nav>

<style>
	.language-switcher {
		display: inline-flex;
		gap: var(--space-1);
	}
	.lang {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-3);
		border: 2px solid transparent;
		border-radius: var(--radius);
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
		font: inherit;
	}
	.lang:hover {
		background: var(--color-bg);
	}
	.lang.active {
		border-color: var(--color-primary);
		color: var(--color-primary);
		font-weight: 700;
	}
	.flag {
		font-size: 1.1rem;
	}
	/* On small screens, show flags only to keep the switcher compact + visible. */
	@media (max-width: 480px) {
		.label {
			display: none;
		}
	}
</style>
