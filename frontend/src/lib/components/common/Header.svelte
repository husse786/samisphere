<!-- Site header: the SamiSphere text wordmark (no logo image in v1, doc 02), the
     permanent four-item navigation, and the prominent language switcher.
     Appears on every page via the layout.

     The nav is a deliberately STABLE shell (Phase 13): Homepage · About ·
     Teacher dashboard · Student dashboard. Future features (homework, AI agents,
     …) live INSIDE one of the dashboards — they never become a fifth item here.
     Layout is plain flexbox, so Persian/RTL mirrors the order for free. -->
<script>
	import { page } from '$app/state';
	import { _ } from 'svelte-i18n';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	// The four permanent doors. Labels are i18n keys, resolved at render time so
	// they follow the language switcher live.
	const LINKS = [
		{ href: '/', key: 'nav.home' },
		{ href: '/about', key: 'nav.about' },
		{ href: '/dashboard', key: 'nav.teacherDashboard' },
		{ href: '/my', key: 'nav.studentDashboard' }
	];

	// The homepage only matches exactly; the others also match their sub-paths.
	function isActive(/** @type {string} */ href) {
		const path = page.url.pathname;
		return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
	}
</script>

<header class="site-header">
	<a class="wordmark" href="/" aria-label="SamiSphere home">
		<span class="sami">Sami</span><span class="sphere">Sphere</span>
	</a>

	<nav class="site-nav" aria-label={$_('nav.label')}>
		{#each LINKS as link (link.href)}
			<a
				href={link.href}
				class="nav-link"
				class:active={isActive(link.href)}
				aria-current={isActive(link.href) ? 'page' : undefined}
			>
				{$_(link.key)}
			</a>
		{/each}
	</nav>

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

	.site-nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-1);
	}
	.nav-link {
		position: relative;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius);
		color: var(--color-dark-muted);
		font-size: 0.95rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
		transition: background 0.15s ease, color 0.15s ease;
	}
	.nav-link:hover {
		background: rgba(255, 255, 255, 0.06);
		color: var(--color-dark-text);
		text-decoration: none;
	}
	/* The active page: brighter text plus a cyan underline that matches the
	   switcher's active border, so the two controls read as one system. */
	.nav-link.active {
		color: var(--color-dark-text);
		background: rgba(255, 255, 255, 0.06);
	}
	.nav-link.active::after {
		content: '';
		position: absolute;
		left: var(--space-3);
		right: var(--space-3);
		bottom: 4px;
		height: 2px;
		border-radius: 999px;
		background: var(--color-brand-cyan);
	}

	/* Narrow phones: the nav drops to its own full-width row below the wordmark
	   and switcher, so both of those stay on the first row and visible. The row
	   scrolls sideways if four labels still don't fit (long Russian words). */
	@media (max-width: 720px) {
		.site-nav {
			order: 3;
			width: 100%;
			flex-wrap: nowrap;
			overflow-x: auto;
			gap: var(--space-1);
			/* Keep the focus ring / underline from being clipped by the scroller. */
			padding-bottom: 2px;
			scrollbar-width: none;
		}
		.site-nav::-webkit-scrollbar {
			display: none;
		}
		.nav-link {
			font-size: 0.9rem;
			padding: var(--space-2);
		}
		.nav-link.active::after {
			left: var(--space-2);
			right: var(--space-2);
		}
	}
</style>
