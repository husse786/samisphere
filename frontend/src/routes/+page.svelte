<!-- Landing page ( / ). An elegant dark hero: Samira's welcome + marketing copy
     and a call-to-action on the left, an auto-shuffling deck of course cards on
     the right. A small scan-to-register QR chip sits under the CTA. Full-bleed
     (opts out of the app `.container`). Decorative animated blobs + dot grid +
     a soft sheen give it depth. The QR encodes /register — regenerate with:
     npx qrcode -o static/register-qr.svg -t svg "<url>/register" -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { getShowcaseCourses, formatMoney } from '$lib/services/courses.js';

	// Homepage course showcase (Phase 12): each unique available course shown
	// once as name + price only — no times, links, or capacity. Priced courses
	// only. Reads public "available" data only, so it works logged-out. The cards
	// are dealt into an auto-shuffling deck in the hero (Phase 13 redesign).
	let showcase = $state(
		/** @type {Array<{ course: string, price: number, priceUnit?: string, currency?: string }>} */ ([])
	);
	let showcaseLoaded = $state(false);

	// Which card is on top of the deck; advanced on a timer to reshuffle.
	let front = $state(0);
	let reducedMotion = $state(false);

	onMount(() => {
		reducedMotion =
			typeof matchMedia !== 'undefined' &&
			matchMedia('(prefers-reduced-motion: reduce)').matches;

		getShowcaseCourses()
			.then((c) => (showcase = c))
			.catch((err) => console.error('Failed to load course showcase:', err))
			.finally(() => (showcaseLoaded = true));
	});

	// Auto-shuffle: every few seconds the top card slides to the back. Paused for
	// a single card, an empty deck, or when the visitor prefers reduced motion.
	$effect(() => {
		if (reducedMotion || showcase.length <= 1) return;
		const id = setInterval(() => {
			front = (front + 1) % showcase.length;
		}, 2600);
		return () => clearInterval(id);
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

	// A card's position in the stack relative to the current front (0 = on top).
	function rel(/** @type {number} */ i) {
		return (i - front + showcase.length) % showcase.length;
	}
</script>

<section class="hero">
	<div class="bg" aria-hidden="true">
		<div class="blob blob-1"></div>
		<div class="blob blob-2"></div>
		<div class="blob blob-3"></div>
		<div class="dots"></div>
		<div class="sheen"></div>
	</div>

	<div class="hero-inner">
		<div class="content">
			<h1 class="wordmark"><span class="sami">Sami</span><span class="sphere">Sphere</span></h1>
			<p class="greeting">{$_('landing.greeting')}</p>
			<h2 class="headline">{$_('landing.headline')}</h2>
			<p class="intro">{$_('landing.intro')}</p>

			<div class="actions">
				<a class="cta" href="/register">{$_('landing.cta')} →</a>

				<a class="qr-chip" href="/register" aria-label={$_('landing.qrNote')}>
					<img class="qr" src="/register-qr.svg" alt="" width="72" height="72" />
					<span class="qr-note">{$_('landing.qrNote')}</span>
				</a>
			</div>

			<p class="dash-link"><a href="/dashboard">{$_('nav.toDashboard')}</a></p>
		</div>

		<!-- Course deck — the hero's living centrepiece. Cards are stacked and
		     reshuffle on a timer; each is a glossy glass tile. -->
		<aside class="deck-wrap" aria-label={$_('showcase.heading')}>
			<p class="deck-label">{$_('showcase.heading')}</p>

			{#if showcaseLoaded && showcase.length > 0}
				<div class="deck" class:single={showcase.length === 1}>
					{#each showcase as c, i (c.course)}
						<article
							class="deal-card"
							class:top={rel(i) === 0}
							style="--rel:{rel(i)}; z-index:{showcase.length - rel(i)};"
						>
							<span class="deal-name">{c.course}</span>
							<span class="deal-price">{priceLabel(c)}</span>
							<span class="deal-shine" aria-hidden="true"></span>
						</article>
					{/each}
				</div>
			{:else if showcaseLoaded}
				<div class="deck">
					<article class="deal-card top empty">
						<span class="deal-name">{$_('showcase.comingSoon')}</span>
						<span class="deal-shine" aria-hidden="true"></span>
					</article>
				</div>
			{:else}
				<div class="deck" aria-hidden="true">
					<article class="deal-card top skeleton"></article>
				</div>
			{/if}
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
		width: 460px;
		height: 460px;
		top: -110px;
		right: 4%;
		background: radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent 70%);
		animation: float-a 16s ease-in-out infinite;
	}
	.blob-2 {
		width: 380px;
		height: 380px;
		bottom: -90px;
		left: 0%;
		background: radial-gradient(circle, rgba(56, 189, 248, 0.5), transparent 70%);
		animation: float-b 20s ease-in-out infinite;
	}
	.blob-3 {
		width: 320px;
		height: 320px;
		top: 30%;
		left: 46%;
		background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent 70%);
		animation: float-a 24s ease-in-out infinite;
	}
	.dots {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
		background-size: 26px 26px;
		-webkit-mask-image: radial-gradient(ellipse at center, #000 35%, transparent 78%);
		mask-image: radial-gradient(ellipse at center, #000 35%, transparent 78%);
	}
	/* A soft diagonal sheen sweeping the top of the hero for a premium finish. */
	.sheen {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			125deg,
			rgba(255, 255, 255, 0.06) 0%,
			transparent 32%,
			transparent 100%
		);
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: clamp(var(--space-8), 6vh, 4.5rem) clamp(var(--space-6), 4vw, 3.5rem);
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		align-items: center;
		gap: clamp(var(--space-8), 5vw, 4rem);
	}

	.wordmark {
		font-size: clamp(2.4rem, 6.5vw, 3.8rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		margin: 0 0 var(--space-4);
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
		font-size: clamp(1.9rem, 4.4vw, 3rem);
		font-weight: 800;
		line-height: 1.12;
		letter-spacing: -0.02em;
		margin: 0 0 var(--space-4);
		max-width: 22ch;
		color: var(--color-dark-text);
	}
	.intro {
		font-size: 1.1rem;
		line-height: 1.7;
		color: var(--color-dark-muted);
		margin: 0 0 var(--space-6);
		max-width: 50ch;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: var(--space-6);
		flex-wrap: wrap;
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
		box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.cta:hover {
		text-decoration: none;
		transform: translateY(-2px);
		box-shadow: 0 14px 34px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
	}

	/* Compact scan-to-register chip — the QR is now a secondary affordance. */
	.qr-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		padding: 6px 14px 6px 6px;
		background: rgba(255, 255, 255, 0.96);
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.5);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
		text-decoration: none;
		transition: transform 0.15s ease;
	}
	.qr-chip:hover {
		text-decoration: none;
		transform: translateY(-2px);
	}
	.qr {
		display: block;
		width: 56px;
		height: 56px;
		border-radius: 8px;
	}
	.qr-note {
		max-width: 12ch;
		font-size: 0.82rem;
		font-weight: 600;
		line-height: 1.25;
		color: #1f2937;
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

	/* ── Course deck ─────────────────────────────────────────────────────── */
	.deck-wrap {
		justify-self: center;
		width: 100%;
		max-width: 380px;
	}
	.deck-label {
		margin: 0 0 var(--space-4);
		text-align: center;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-dark-muted);
	}
	.deck {
		position: relative;
		height: 230px;
		perspective: 1200px;
	}

	.deal-card {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 100%;
		height: 200px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-8);
		border-radius: 22px;
		background: linear-gradient(160deg, rgb(32, 44, 79), rgb(16, 25, 49));
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
		overflow: hidden;
		/* Deal each card down and back, scaled + faded by its stack position. */
		transform: translateY(calc(var(--rel) * 16px)) scale(calc(1 - var(--rel) * 0.05));
		opacity: calc(1 - var(--rel) * 0.28);
		transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease;
	}
	/* Cards deeper than the third are hidden behind the stack. */
	.deal-card:not(.top) {
		pointer-events: none;
	}
	.deal-card.top {
		border-color: rgba(56, 189, 248, 0.4);
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.15),
			0 0 40px rgba(56, 189, 248, 0.12);
	}
	.deck.single .deal-card,
	.deal-card.empty,
	.deal-card.skeleton {
		transform: none;
		opacity: 1;
	}

	.deal-name {
		font-size: 1.6rem;
		font-weight: 800;
		letter-spacing: -0.01em;
		color: var(--color-dark-text);
	}
	.deal-price {
		font-size: 1.2rem;
		font-weight: 700;
		color: #fff;
	}
	/* A diagonal gloss that sits over the card face. */
	.deal-shine {
		position: absolute;
		top: -60%;
		left: -30%;
		width: 80%;
		height: 200%;
		background: linear-gradient(
			100deg,
			transparent 30%,
			rgba(255, 255, 255, 0.13) 50%,
			transparent 70%
		);
		transform: rotate(8deg);
		pointer-events: none;
	}
	.deal-card.empty .deal-name {
		font-size: 1.3rem;
		color: var(--color-dark-muted);
	}
	.deal-card.skeleton {
		background: linear-gradient(160deg, rgba(30, 41, 74, 0.55), rgba(17, 26, 51, 0.55));
		border-color: rgba(255, 255, 255, 0.06);
	}

	/* Stack on small screens; the deck sits above the text, QR chip stays inline. */
	@media (max-width: 860px) {
		.hero-inner {
			grid-template-columns: 1fr;
			justify-items: start;
			gap: var(--space-8);
			padding: var(--space-8) var(--space-6);
		}
		.deck-wrap {
			order: -1;
			justify-self: center;
			max-width: 340px;
		}
		.headline {
			max-width: 26ch;
		}
	}

	@media (max-width: 480px) {
		.actions {
			gap: var(--space-4);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blob {
			animation: none;
		}
		.deal-card {
			transition: none;
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
