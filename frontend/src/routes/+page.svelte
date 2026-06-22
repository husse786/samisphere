<!-- Public student page ( / ).
     The registration form (name + course dropdown). Registrations are viewed
     only in the protected teacher dashboard — students don't see other
     students' data. -->
<script>
	import { _ } from 'svelte-i18n';
	import RegistrationForm from '$lib/components/student/RegistrationForm.svelte';
</script>

<h1>SamiSphere</h1>
<p>{$_('student.subtitle')}</p>

<RegistrationForm />

<p><a href="/dashboard">{$_('nav.toDashboard')}</a></p>
