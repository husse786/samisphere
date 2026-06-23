<!-- Registration page ( /register ). The student fills in their details and
     chooses a course. Reached from the landing page's call-to-action. -->
<script>
	import { _ } from 'svelte-i18n';
	import RegistrationForm from '$lib/components/student/RegistrationForm.svelte';
</script>

<div class="container">
	<h1>{$_('form.register')}</h1>
	<p class="subtitle">{$_('student.subtitle')}</p>

	<RegistrationForm />

	<p class="nav"><a href="/">{$_('nav.toHome')}</a></p>
</div>

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
