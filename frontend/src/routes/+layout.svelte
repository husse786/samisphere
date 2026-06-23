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

<!-- Pages control their own width: app pages wrap in `.container`; the landing
     page goes full-bleed for its dark hero. -->
{#if $isLoading}
	<p class="container">…</p>
{:else}
	{@render children()}
{/if}
