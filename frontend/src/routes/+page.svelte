<!-- Landing page ( / ). A welcoming hero with the SamiSphere wordmark, a short
     intro, and a prominent call-to-action to the registration form. The
     language switcher lives in the header (visible here too). -->
<script>
	import { _ } from 'svelte-i18n';
</script>

<section class="hero">
	<div class="orb" aria-hidden="true"></div>

	<h1 class="wordmark"><span class="sami">Sami</span><span class="sphere">Sphere</span></h1>

	<p class="welcome">{$_('landing.welcome')}</p>
	<p class="intro">{$_('landing.intro')}</p>

	<a class="cta" href="/register">{$_('landing.cta')} →</a>

	<p class="dash-link"><a href="/dashboard">{$_('nav.toDashboard')}</a></p>
</section>

<style>
	.hero {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-4);
		padding: var(--space-8) var(--space-4);
		min-height: 60vh;
		justify-content: center;
		overflow: hidden;
	}

	/* Soft decorative "sphere" glow behind the wordmark. */
	.orb {
		position: absolute;
		top: 8%;
		width: min(440px, 80vw);
		height: min(440px, 80vw);
		border-radius: 50%;
		background: radial-gradient(
			circle at 50% 40%,
			rgba(79, 70, 229, 0.18),
			rgba(13, 148, 136, 0.12) 45%,
			transparent 70%
		);
		filter: blur(6px);
		z-index: 0;
	}

	.hero > :not(.orb) {
		position: relative;
		z-index: 1;
	}

	.wordmark {
		font-size: clamp(2.75rem, 9vw, 4.5rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		margin: 0;
		line-height: 1;
	}
	.sami {
		color: var(--color-primary);
	}
	.sphere {
		color: var(--color-accent);
	}

	.welcome {
		font-size: clamp(1.25rem, 3.5vw, 1.75rem);
		font-weight: 700;
		color: var(--color-text);
		margin: var(--space-2) 0 0;
		max-width: 30ch;
	}
	.intro {
		font-size: 1.05rem;
		color: var(--color-text-muted);
		margin: 0;
		max-width: 48ch;
		line-height: 1.6;
	}

	.cta {
		display: inline-block;
		margin-top: var(--space-4);
		padding: var(--space-3) var(--space-8);
		background: var(--color-primary);
		color: var(--color-on-primary);
		font-size: 1.1rem;
		font-weight: 700;
		border-radius: 999px;
		text-decoration: none;
		box-shadow: var(--shadow);
		transition: background 0.15s ease, transform 0.15s ease;
	}
	.cta:hover {
		background: var(--color-primary-hover);
		text-decoration: none;
		transform: translateY(-1px);
	}

	.dash-link {
		margin-top: var(--space-6);
		font-size: 0.95rem;
	}
	.dash-link a {
		color: var(--color-text-muted);
	}
</style>
