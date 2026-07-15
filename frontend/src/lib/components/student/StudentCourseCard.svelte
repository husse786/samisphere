<!-- One course card on the student dashboard (Phase 13, Task 13.8) — one per
     registration. The card the student actually came for, so the "Join class"
     button is the loudest thing on it: full width, big, thumb-sized on a phone.

     THE JOIN BUTTON ALWAYS SHOWS WHEN THE COURSE HAS A `meetingLink` — paid or
     not. Payment gates nothing here; it is a status Samira tracks, never
     leverage over a student. This is a deliberate human decision: do not add
     gating. (doc 03, Phase 13.)

     With no link, the same space holds a dashed "available soon" placeholder,
     so the cards keep their shape and a student never meets a dead button. -->
<script>
	import { _ } from 'svelte-i18n';
	import { formatMoney } from '$lib/services/courses.js';

	/** @type {{
	 *   registration: { course?: string, time?: string, paid?: boolean, paidAt?: string },
	 *   course?: { meetingLink?: string, price?: number, priceUnit?: string, currency?: string }
	 * }} */
	let { registration, course } = $props();

	// "₽400.00 / month" — money formatted by the service, period word translated
	// here. Same formatting as the homepage, so a price reads identically
	// wherever the student meets it.
	let priceLabel = $derived.by(() => {
		const money = course ? formatMoney(course) : null;
		if (!money) return null;
		const unit =
			course?.priceUnit === 'month' ? $_('courses.unitMonth') : $_('courses.unitHour');
		return `${money} / ${unit}`;
	});
</script>

<article class="card">
	<header class="card-head">
		<div class="titles">
			<h3 class="course">{registration.course ?? '—'}</h3>
			<p class="time">{registration.time ?? '—'}</p>
		</div>
		<!-- Absent `paid` (old records) reads as not paid. -->
		<span class="badge" class:paid={registration.paid}>
			{registration.paid ? $_('registrations.paid') : $_('registrations.notPaid')}
		</span>
	</header>

	{#if course?.meetingLink}
		<a class="join" href={course.meetingLink} target="_blank" rel="noopener">
			{$_('studentArea.joinClass')}
		</a>
	{:else}
		<div class="join-placeholder">{$_('studentArea.linkSoon')}</div>
	{/if}

	<!-- Under the button: the paid date, or what it costs. Nothing if the course
	     carries no price. -->
	{#if registration.paid && registration.paidAt}
		<p class="foot paid-on">
			{$_('studentArea.paidOn', { values: { date: registration.paidAt } })}
		</p>
	{:else if !registration.paid && priceLabel}
		<p class="foot price">{priceLabel}</p>
	{/if}
</article>

<style>
	.card {
		/* The join button and its no-link placeholder share this height, so a card
		   with a link and one without keep exactly the same shape. */
		--join-height: 3.75rem;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-6);
		border-radius: 22px;
		background: linear-gradient(160deg, rgb(32, 44, 79), rgb(16, 25, 49));
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
	}

	.card-head {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: var(--space-4);
	}
	.titles {
		min-width: 0; /* let a long course name wrap instead of pushing the badge */
	}
	.course {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: -0.01em;
		color: var(--color-brand-cyan);
		overflow-wrap: anywhere;
	}
	.time {
		margin: var(--space-1) 0 0;
		font-size: 1rem;
		color: var(--color-dark-muted);
	}

	.badge {
		flex: none;
		padding: 0.15rem var(--space-3);
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 700;
		white-space: nowrap;
		background: var(--color-unpaid-bg-dark);
		color: var(--color-unpaid-text-dark);
	}
	.badge.paid {
		background: var(--color-paid-bg-dark);
		color: var(--color-paid-text-dark);
	}

	/* The point of the card. Same gradient as the landing page's CTA, so the
	   product reads as one piece. */
	.join {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 100%;
		min-height: var(--join-height);
		padding: var(--space-2) var(--space-4);
		border-radius: 14px;
		background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-cyan));
		color: #fff;
		font-size: 1.15rem;
		font-weight: 700;
		text-align: center;
		text-decoration: none;
		box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.join:hover {
		text-decoration: none;
		transform: translateY(-2px);
		box-shadow: 0 14px 34px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
	}

	/* No link yet: same footprint as the button, obviously not pressable. */
	.join-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 100%;
		min-height: var(--join-height);
		padding: var(--space-2) var(--space-4);
		border-radius: 14px;
		border: 2px dashed rgba(255, 255, 255, 0.18);
		color: var(--color-dark-muted);
		font-size: 1rem;
		font-weight: 600;
		text-align: center;
	}

	.foot {
		margin: 0;
		font-size: 0.95rem;
		text-align: center;
	}
	.paid-on {
		color: var(--color-paid-text-dark);
		font-weight: 600;
	}
	.price {
		color: var(--color-dark-muted);
		font-weight: 700;
	}

	@media (prefers-reduced-motion: reduce) {
		.join {
			transition: none;
		}
		.join:hover {
			transform: none;
		}
	}
</style>
