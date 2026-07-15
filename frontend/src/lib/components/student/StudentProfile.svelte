<!-- The student's page (Phase 13, Task 13.8): who they are, then one card per
     course they registered for.

     A student registers PER COURSE, so one email can have several registrations
     — they all show here as separate cards, each with its own payment status.

     Data: every registration whose `email` matches the logged-in user's email.
     The security rules enforce that too — this query is not the protection, it
     is the request the rules happen to permit. -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { getRegistrationsByEmail } from '$lib/services/registrations.js';
	import { getAvailableCourses } from '$lib/services/courses.js';
	import StudentCourseCard from './StudentCourseCard.svelte';

	/** @type {{ email: string, onLogout: () => void }} */
	let { email, onLogout } = $props();

	let registrations = $state(
		/** @type {Array<{ id: string, firstName?: string, lastName?: string, name?: string, course?: string, time?: string, paid?: boolean, paidAt?: string, date: string }>} */ ([])
	);
	let courses = $state(
		/** @type {Array<{ course: string, time: string, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }>} */ ([])
	);
	let loading = $state(true);
	let failed = $state(false);

	onMount(async () => {
		try {
			// The registrations are the student's own; the courses are the public
			// "available" list, which is where the meeting link and price live.
			[registrations, courses] = await Promise.all([
				getRegistrationsByEmail(email),
				getAvailableCourses()
			]);
		} catch (err) {
			console.error('Failed to load the student dashboard:', err);
			failed = true;
		} finally {
			loading = false;
		}
	});

	// The student's display name, taken from their registrations (the auth account
	// only knows an email). Falls back to the legacy single `name` field, then to
	// nothing — the email below always identifies them anyway.
	let studentName = $derived.by(() => {
		const r = registrations[0];
		if (!r) return '';
		return [r.firstName, r.lastName].filter(Boolean).join(' ') || r.name || '';
	});

	/**
	 * Find the course slot a registration refers to, for its meeting link + price.
	 * Exact course + time first. If that slot is gone — the teacher renamed a time
	 * or hid the slot — fall back to any available slot of the same course, since
	 * price is per course by design and the link is normally shared too. No match
	 * (hidden course) simply means no link and no price: the card shows its dashed
	 * placeholder rather than breaking.
	 * @param {{ course?: string, time?: string }} r
	 */
	function courseFor(r) {
		return (
			courses.find((c) => c.course === r.course && c.time === r.time) ??
			courses.find((c) => c.course === r.course)
		);
	}
</script>

<section class="profile">
	<header class="who">
		<div class="identity">
			{#if studentName}
				<h1 class="name">{studentName}</h1>
			{:else}
				<h1 class="name">{$_('studentArea.title')}</h1>
			{/if}
			<p class="email">{email}</p>
		</div>
		<button type="button" class="logout" onclick={onLogout}>
			{$_('studentArea.logout')}
		</button>
	</header>

	{#if loading}
		<p class="state">{$_('common.loading')}</p>
	{:else if failed}
		<p class="state error">{$_('studentArea.loadError')}</p>
	{:else if registrations.length === 0}
		<!-- Edge case: an account exists but no registration carries this email
		     (e.g. Samira made the login before the registration, or with a typo). -->
		<div class="empty">
			<p class="empty-title">{$_('studentArea.emptyTitle')}</p>
			<p class="empty-body">{$_('studentArea.emptyBody')}</p>
			<a class="empty-cta" href="/register">{$_('landing.cta')} →</a>
		</div>
	{:else}
		<h2 class="section-label">{$_('studentArea.yourCourses')}</h2>
		<div class="cards">
			{#each registrations as r (r.id)}
				<StudentCourseCard registration={r} course={courseFor(r)} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.profile {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		text-align: start;
	}

	.who {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding-bottom: var(--space-4);
		margin-bottom: var(--space-8);
		border-bottom: 1px solid var(--color-dark-border);
	}
	.name {
		margin: 0;
		font-size: clamp(1.6rem, 4vw, 2.1rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--color-dark-text);
	}
	.email {
		margin: var(--space-1) 0 0;
		font-size: 0.95rem;
		color: var(--color-dark-muted);
	}
	.logout {
		padding: var(--space-2) var(--space-4);
		border: 1px solid var(--color-dark-border);
		border-radius: var(--radius);
		background: rgba(255, 255, 255, 0.04);
		color: var(--color-dark-muted);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition: color 0.15s ease, border-color 0.15s ease;
	}
	.logout:hover {
		color: var(--color-dark-text);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.section-label {
		margin: 0 0 var(--space-4);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-dark-muted);
	}

	/* One column on a phone, two once there is room. */
	.cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}
	@media (min-width: 720px) {
		.cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.state {
		color: var(--color-dark-muted);
	}
	.state.error {
		color: var(--color-danger);
		font-weight: 600;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: var(--space-3);
		padding: var(--space-8);
		border-radius: 22px;
		border: 2px dashed rgba(255, 255, 255, 0.18);
		background: rgba(255, 255, 255, 0.02);
	}
	.empty-title {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--color-dark-text);
	}
	.empty-body {
		margin: 0;
		line-height: 1.6;
		color: var(--color-dark-muted);
		max-width: 46ch;
	}
	.empty-cta {
		margin-top: var(--space-2);
		font-weight: 700;
		color: var(--color-brand-cyan);
	}
</style>
