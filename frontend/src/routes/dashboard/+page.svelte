<!-- Teacher dashboard ( /dashboard ).
     Phase 5: login gate + registration list. Phase 6 adds course management.
     Content is shown only when the teacher is logged in; logged-out visitors
     see only the login form. (Real data protection comes from the Firestore
     security rules in Phase 10 — this gating is the UX layer.) -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { onAuthChange, signOutTeacher } from '$lib/services/auth.js';
	import LoginForm from '$lib/components/teacher/LoginForm.svelte';
	import RegistrationList from '$lib/components/teacher/RegistrationList.svelte';
	import CourseManager from '$lib/components/teacher/CourseManager.svelte';
	import Button from '$lib/components/common/Button.svelte';

	// undefined = still checking auth; null = logged out; User = logged in.
	let user = $state(
		/** @type {import('firebase/auth').User | null | undefined} */ (undefined)
	);

	// Subscribe on mount; onMount's returned fn unsubscribes on destroy.
	onMount(() => onAuthChange((u) => (user = u)));
</script>

<h1>{$_('dashboard.title')}</h1>

{#if user === undefined}
	<p>{$_('common.loading')}</p>
{:else if user === null}
	<LoginForm />
{:else}
	<div class="signed-in">
		<span>{$_('dashboard.signedInAs', { values: { email: user.email } })}</span>
		<Button variant="secondary" onclick={signOutTeacher}>{$_('dashboard.logout')}</Button>
	</div>
	<CourseManager />
	<RegistrationList />
{/if}

<p class="nav"><a href="/">{$_('nav.toStudent')}</a></p>

<style>
	.signed-in {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		margin-bottom: var(--space-6);
		color: var(--color-text-muted);
	}
	.nav {
		margin-top: var(--space-8);
	}
</style>
