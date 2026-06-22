<!-- Teacher dashboard ( /dashboard ).
     Phase 5: login gate + registration list. Phase 6 adds course management.
     Content is shown only when the teacher is logged in; logged-out visitors
     see only the login form. (Real data protection comes from the Firestore
     security rules in Phase 10 — this gating is the UX layer.) -->
<script>
	import { onMount } from 'svelte';
	import { onAuthChange, signOutTeacher } from '$lib/services/auth.js';
	import LoginForm from '$lib/components/teacher/LoginForm.svelte';
	import RegistrationList from '$lib/components/teacher/RegistrationList.svelte';
	import CourseManager from '$lib/components/teacher/CourseManager.svelte';

	// undefined = still checking auth; null = logged out; User = logged in.
	let user = $state(
		/** @type {import('firebase/auth').User | null | undefined} */ (undefined)
	);

	// Subscribe on mount; onMount's returned fn unsubscribes on destroy.
	onMount(() => onAuthChange((u) => (user = u)));
</script>

<h1>SamiSphere — Teacher Dashboard</h1>

{#if user === undefined}
	<p>Loading…</p>
{:else if user === null}
	<LoginForm />
{:else}
	<p>
		Signed in as {user.email}
		<button onclick={signOutTeacher}>Log out</button>
	</p>
	<CourseManager />
	<RegistrationList />
{/if}

<p><a href="/">← Back to student page</a></p>
