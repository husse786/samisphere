<!-- Student dashboard ( /my ) — the student's door and their page (Phase 13).

     Three states:
       logged out          → the login screen
       logged in (teacher) → a friendly signpost to /dashboard (wrong door)
       logged in (student) → their profile

     A logged-out visitor never sees student data: there is nothing to see until
     `user` is a real account, and the security rules refuse the read regardless
     of what this page renders. -->
<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { onAuthChange, signOutUser, isTeacher } from '$lib/services/auth.js';
	import StudentLoginForm from '$lib/components/student/StudentLoginForm.svelte';
	import StudentProfile from '$lib/components/student/StudentProfile.svelte';
	import WrongDoor from '$lib/components/common/WrongDoor.svelte';

	// undefined = still checking auth; null = logged out; User = logged in.
	let user = $state(
		/** @type {import('firebase/auth').User | null | undefined} */ (undefined)
	);

	// Subscribe on mount; onMount's returned fn unsubscribes on destroy.
	onMount(() => onAuthChange((u) => (user = u)));
</script>

<section class="my-page">
	<div class="my-inner">
		{#if user === undefined}
			<p class="state">{$_('common.loading')}</p>
		{:else if user === null}
			<h1 class="page-title">{$_('studentArea.title')}</h1>
			<div class="login-slot">
				<StudentLoginForm />
			</div>
		{:else if isTeacher(user)}
			<!-- Samira signed in here by mistake. Her login worked — just point her
			     at her own dashboard. -->
			<h1 class="page-title">{$_('studentArea.title')}</h1>
			<div class="login-slot">
				<WrongDoor
					message={$_('studentArea.teacherHere')}
					linkHref="/dashboard"
					linkLabel={$_('nav.teacherDashboard')}
					email={user.email}
					tone="dark"
					onLogout={signOutUser}
				/>
			</div>
		{:else}
			<StudentProfile email={user.email ?? ''} onLogout={signOutUser} />
		{/if}
	</div>
</section>

<style>
	.my-page {
		position: relative;
		min-height: calc(100vh - 62px);
		background:
			radial-gradient(900px 500px at 80% -10%, rgba(59, 130, 246, 0.18), transparent 60%),
			radial-gradient(700px 500px at 0% 110%, rgba(56, 189, 248, 0.12), transparent 60%),
			var(--color-dark-bg);
		overflow: hidden;
	}
	.my-inner {
		position: relative;
		z-index: 1;
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-8) var(--space-4);
	}
	.page-title {
		color: var(--color-dark-text);
		text-align: center;
		margin-bottom: var(--space-6);
	}
	/* The login card and the wrong-door notice both sit centered in the page. */
	.login-slot {
		display: flex;
		justify-content: center;
	}
	.state {
		color: var(--color-dark-muted);
		text-align: center;
	}
</style>
