<!-- Site header: the SamiSphere text wordmark (no logo image in v1, doc 02) next
     to the prominent language switcher. Appears on every page via the layout. -->
<script>
	import LanguageSwitcher from './LanguageSwitcher.svelte';
</script>

<header class="site-header">
	<a class="wordmark" href="/" aria-label="SamiSphere home">
		<span class="sami">Sami</span><span class="sphere">Sphere</span>
	</a>
	<LanguageSwitcher />
</header>

<style>
	.site-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-dark-bg);
		border-bottom: 1px solid var(--color-dark-border);
	}
	.wordmark {
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		text-decoration: none;
	}
	.wordmark:hover {
		text-decoration: none;
	}
	.sami {
		color: var(--color-brand-blue);
	}
	.sphere {
		color: var(--color-brand-cyan);
	}
</style>
