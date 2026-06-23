<!-- Landing page ( / ). An elegant dark hero: Samira's welcome + marketing copy
     and a call-to-action on one side, a scan-to-register QR card on the other.
     Full-bleed (opts out of the app `.container`). The QR encodes /register —
     regenerate with: npx qrcode -o static/register-qr.svg -t svg "<url>/register" -->
<script>
	import { _ } from 'svelte-i18n';
</script>

<section class="hero">
	<div class="glow" aria-hidden="true"></div>

	<div class="hero-inner">
		<div class="content">
			<h1 class="wordmark"><span class="sami">Sami</span><span class="sphere">Sphere</span></h1>
			<p class="greeting">{$_('landing.greeting')}</p>
			<h2 class="headline">{$_('landing.headline')}</h2>
			<p class="intro">{$_('landing.intro')}</p>

			<a class="cta" href="/register">{$_('landing.cta')} →</a>

			<p class="dash-link"><a href="/dashboard">{$_('nav.toDashboard')}</a></p>
		</div>

		<aside class="qr-card">
			<img class="qr" src="/register-qr.svg" alt={$_('landing.qrNote')} width="150" height="150" />
			<p class="qr-note">{$_('landing.qrNote')}</p>
		</aside>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: calc(100vh - 62px);
		background:
			radial-gradient(1100px 600px at 75% -5%, rgba(59, 130, 246, 0.2), transparent 60%),
			radial-gradient(800px 500px at 5% 105%, rgba(56, 189, 248, 0.12), transparent 60%),
			var(--color-dark-bg);
		color: var(--color-dark-text);
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1040px;
		margin: 0 auto;
		padding: var(--space-8) var(--space-6);
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: var(--space-8);
	}

	.wordmark {
		font-size: clamp(2.5rem, 7vw, 3.75rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		margin: 0 0 var(--space-6);
		line-height: 1;
	}
	.sami {
		color: var(--color-brand-blue);
	}
	.sphere {
		color: var(--color-brand-cyan);
	}

	.greeting {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-brand-cyan);
		margin: 0 0 var(--space-2);
	}
	.headline {
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		font-weight: 800;
		line-height: 1.15;
		margin: 0 0 var(--space-4);
		max-width: 18ch;
		color: var(--color-dark-text); /* override global dark h2 color on the dark hero */
	}
	.intro {
		font-size: 1.1rem;
		line-height: 1.7;
		color: var(--color-dark-muted);
		margin: 0 0 var(--space-6);
		max-width: 52ch;
	}

	.cta {
		display: inline-block;
		padding: var(--space-3) var(--space-8);
		font-size: 1.1rem;
		font-weight: 700;
		color: #fff;
		background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-cyan));
		border-radius: 999px;
		text-decoration: none;
		box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.cta:hover {
		text-decoration: none;
		transform: translateY(-2px);
		box-shadow: 0 12px 30px rgba(59, 130, 246, 0.45);
	}

	.dash-link {
		margin: var(--space-8) 0 0;
		font-size: 0.95rem;
	}
	.dash-link a {
		color: var(--color-dark-muted);
	}
	.dash-link a:hover {
		color: var(--color-dark-text);
	}

	/* QR card — white so the code scans cleanly against the dark hero. */
	.qr-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: #fff;
		border-radius: 16px;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
	}
	.qr {
		display: block;
		width: 150px;
		height: 150px;
	}
	.qr-note {
		margin: 0;
		max-width: 16ch;
		text-align: center;
		font-size: 0.85rem;
		font-weight: 600;
		color: #1f2937;
	}

	/* Stack on small screens; QR moves above the text and stays prominent. */
	@media (max-width: 720px) {
		.hero-inner {
			grid-template-columns: 1fr;
			justify-items: start;
			gap: var(--space-6);
			padding: var(--space-8) var(--space-4);
		}
		.qr-card {
			order: -1;
			align-self: center;
		}
	}
</style>
