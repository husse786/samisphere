<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/i18n'; // side-effect: configure svelte-i18n (default English)
	import { isLoading } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { initLanguage } from '$lib/stores/language.js';
	import LanguageSwitcher from '$lib/components/common/LanguageSwitcher.svelte';

	let { children } = $props();

	// Apply the saved language (and RTL for Persian) once in the browser.
	onMount(initLanguage);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Switcher sits on every page. The branded header wrapping it comes in Phase 8. -->
<header>
	<LanguageSwitcher />
</header>

{#if $isLoading}
	<p>…</p>
{:else}
	{@render children()}
{/if}
