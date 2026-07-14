<!-- Landing page ( / ). An elegant dark hero: Samira's welcome + marketing copy
     and a call-to-action on one side, a scan-to-register QR card on the other.
     Full-bleed (opts out of the app `.container`). Decorative animated blobs +
     dot grid give it depth. The QR encodes /register — regenerate with:
     npx qrcode -o static/register-qr.svg -t svg "<url>/register" -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { getShowcaseCourses, formatMoney } from '$lib/services/courses.js';

	// Homepage course showcase (Phase 12): each unique available course shown
	// once as name + price only — no times, links, or capacity. Priced courses
	// only; a placeholder shows when there are none. Reads public "available"
	// data only, so it works for a logged-out visitor.
	let showcase = $state(
		/** @type {Array<{ course: string, price: number, priceUnit?: string, currency?: string }>} */ ([])
	);
	let showcaseLoaded = $state(false);

	onMount(async () => {
		try {
			showcase = await getShowcaseCourses();
		} catch (err) {
			console.error('Failed to load course showcase:', err);
		} finally {
			showcaseLoaded = true;
		}
	});

	// "$12.50 / hour" — money from the service, period word translated here.
	function priceLabel(
		/** @type {{ price?: number, priceUnit?: string, currency?: string }} */ c
	) {
		const money = formatMoney(c);
		if (!money) return '';
		const unit = c.priceUnit === 'month' ? $_('courses.unitMonth') : $_('courses.unitHour');
		return `${money} / ${unit}`;
	}
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

<!-- Course showcase — marketing list of what's on offer (name + price only). -->
<section class="showcase">
	<div class="showcase-inner">
		<h2 class="showcase-heading">{$_('showcase.heading')}</h2>

		{#if showcaseLoaded && showcase.length > 0}
			<ul class="course-grid">
				{#each showcase as c (c.course)}
					<li class="course-card">
						<span class="course-name">{c.course}</span>
						<span class="course-price">{priceLabel(c)}</span>
					</li>
				{/each}
			</ul>
		{:else if showcaseLoaded}
			<p class="coming-soon">{$_('showcase.comingSoon')}</p>
		{/if}
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

	/* Course showcase — sits below the hero on the light app background. */
	.showcase {
		background: var(--color-bg);
		padding: clamp(var(--space-8), 6vw, 4rem) var(--space-4);
	}
	.showcase-inner {
		max-width: 1000px;
		margin: 0 auto;
		text-align: center;
	}
	.showcase-heading {
		font-size: clamp(1.5rem, 3.5vw, 2.1rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		margin: 0 0 var(--space-6);
		color: var(--color-text);
	}
	.course-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: var(--space-4);
	}
	.course-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-6);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-top: 3px solid var(--color-primary);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		text-align: start;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.course-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);
	}
	.course-name {
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--color-text);
	}
	.course-price {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--color-accent);
	}
	.coming-soon {
		font-size: 1.1rem;
		color: var(--color-text-muted);
		padding: var(--space-8) 0;
	}
</style>
