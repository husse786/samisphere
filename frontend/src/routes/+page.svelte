<!-- Landing page ( / ). An elegant dark hero: Samira's welcome + marketing copy
     and a call-to-action on one side, a scan-to-register QR card on the other.
     Full-bleed (opts out of the app `.container`). Decorative animated blobs +
     dot grid give it depth. The QR encodes /register — regenerate with:
     npx qrcode -o static/register-qr.svg -t svg "<url>/register" -->
<script>
	import { _ } from 'svelte-i18n';
</script>

<section class="hero">
	<div class="bg" aria-hidden="true">
		<div class="blob blob-1"></div>
		<div class="blob blob-2"></div>
		<div class="blob blob-3"></div>
		<div class="dots"></div>
	</div>

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
			<img class="qr" src="/register-qr.svg" alt={$_('landing.qrNote')} width="200" height="200" />
			<p class="qr-note">{$_('landing.qrNote')}</p>
		</aside>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: calc(100vh - 62px);
		background: var(--color-dark-bg);
		color: var(--color-dark-text);
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	/* Decorative background layer */
	.bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
		opacity: 0.55;
	}
	.blob-1 {
		width: 420px;
		height: 420px;
		top: -90px;
		right: 6%;
		background: radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent 70%);
		animation: float-a 16s ease-in-out infinite;
	}
	.blob-2 {
		width: 360px;
		height: 360px;
		bottom: -80px;
		left: 2%;
		background: radial-gradient(circle, rgba(56, 189, 248, 0.5), transparent 70%);
		animation: float-b 20s ease-in-out infinite;
	}
	.blob-3 {
		width: 300px;
		height: 300px;
		top: 35%;
		left: 42%;
		background: radial-gradient(circle, rgba(99, 102, 241, 0.35), transparent 70%);
		animation: float-a 24s ease-in-out infinite;
	}
	.dots {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
		background-size: 26px 26px;
		-webkit-mask-image: radial-gradient(ellipse at center, #000 35%, transparent 75%);
		mask-image: radial-gradient(ellipse at center, #000 35%, transparent 75%);
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: var(--space-8) clamp(var(--space-4), 5vw, 4rem);
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: clamp(var(--space-6), 6vw, 5rem);
	}

	.wordmark {
		font-size: clamp(2.5rem, 7vw, 4rem);
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
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--color-brand-cyan);
		margin: 0 0 var(--space-2);
	}
	.headline {
		font-size: clamp(1.7rem, 4vw, 2.6rem);
		font-weight: 800;
		line-height: 1.15;
		margin: 0 0 var(--space-4);
		max-width: 20ch;
		color: var(--color-dark-text);
	}
	.intro {
		font-size: 1.12rem;
		line-height: 1.75;
		color: var(--color-dark-muted);
		margin: 0 0 var(--space-6);
		max-width: 54ch;
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
		padding: var(--space-5);
		background: #fff;
		border-radius: 22px;
		border: 1px solid rgba(255, 255, 255, 0.5);
		box-shadow: 0 18px 55px rgba(0, 0, 0, 0.45);
	}
	.qr {
		display: block;
		width: 200px;
		height: 200px;
	}
	.qr-note {
		margin: 0;
		max-width: 18ch;
		text-align: center;
		font-size: 0.9rem;
		font-weight: 600;
		color: #1f2937;
	}

	/* Stack on small screens; QR moves above the text and stays prominent. */
	@media (max-width: 760px) {
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
		.qr {
			width: 170px;
			height: 170px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blob {
			animation: none;
		}
	}

	@keyframes float-a {
		50% {
			transform: translate(22px, -24px);
		}
	}
	@keyframes float-b {
		50% {
			transform: translate(-20px, 20px);
		}
	}
</style>
