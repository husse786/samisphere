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
		gap: 0.25rem;
	}
	.lang {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.6rem;
		border: 2px solid transparent;
		border-radius: 6px;
		background: none;
		cursor: pointer;
		font: inherit;
	}
	.lang.active {
		border-color: currentColor;
		font-weight: 700;
	}
	.flag {
		font-size: 1.1rem;
	}
</style>
