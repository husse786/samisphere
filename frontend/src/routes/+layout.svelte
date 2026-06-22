<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/theme.css'; // centralized colors / fonts / spacing
	import '$lib/i18n'; // side-effect: configure svelte-i18n (default English)
	import { isLoading } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { initLanguage } from '$lib/stores/language.js';
	import Header from '$lib/components/common/Header.svelte';

	let { children } = $props();

	// Apply the saved language (and RTL for Persian) once in the browser.
	onMount(initLanguage);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

<main class="container">
	{#if $isLoading}
		<p>…</p>
	{:else}
		{@render children()}
	{/if}
</main>

<style>
	.container {
		max-width: var(--container-width);
		margin: 0 auto;
		padding: var(--space-6) var(--space-4);
	}
</style>
