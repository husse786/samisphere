<!-- Public student page ( / ).
     The registration form (name + course dropdown). Registrations are viewed
     only in the protected teacher dashboard — students don't see other
     students' data. -->
<script>
	import { _ } from 'svelte-i18n';
	import RegistrationForm from '$lib/components/student/RegistrationForm.svelte';
</script>

<p class="subtitle">{$_('student.subtitle')}</p>

<RegistrationForm />

<p class="nav"><a href="/dashboard">{$_('nav.toDashboard')}</a></p>

<style>
	.subtitle {
		font-size: 1.1rem;
		color: var(--color-text-muted);
		margin-top: 0;
	}
	.nav {
		margin-top: var(--space-8);
	}
</style>
