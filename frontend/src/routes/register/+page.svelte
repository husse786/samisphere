<!-- Registration page ( /register ). The student fills in their details and
     chooses a course. Dark hero background matching the landing page. -->
<script>
	import { _ } from 'svelte-i18n';
	import RegistrationForm from '$lib/components/student/RegistrationForm.svelte';
</script>

<section class="register-page">
	<div class="glow" aria-hidden="true"></div>

	<div class="register-inner">
		<h1>{$_('form.register')}</h1>
		<p class="subtitle">{$_('student.subtitle')}</p>

		<RegistrationForm />

		<p class="nav"><a href="/">{$_('nav.toHome')}</a></p>
	</div>
</section>

<style>
	.register-page {
		position: relative;
		min-height: calc(100vh - 62px);
		background:
			radial-gradient(900px 500px at 80% -10%, rgba(59, 130, 246, 0.18), transparent 60%),
			radial-gradient(700px 500px at 0% 110%, rgba(56, 189, 248, 0.12), transparent 60%),
			var(--color-dark-bg);
		overflow: hidden;
	}
	.register-inner {
		position: relative;
		z-index: 1;
		max-width: 560px;
		margin: 0 auto;
		padding: var(--space-8) var(--space-4);
		text-align: center;
	}
	.register-inner h1 {
		color: var(--color-dark-text);
		margin-bottom: var(--space-2);
	}
	.subtitle {
		font-size: 1.1rem;
		color: var(--color-dark-muted);
		margin-top: 0;
		margin-bottom: var(--space-6);
	}
	/* Center the (left-aligned) form card within the page. */
	.register-inner :global(.reg-form) {
		margin: 0 auto;
		text-align: start;
	}
	.nav {
		margin-top: var(--space-8);
	}
	.nav a {
		color: var(--color-dark-muted);
	}
	.nav a:hover {
		color: var(--color-dark-text);
	}
</style>
