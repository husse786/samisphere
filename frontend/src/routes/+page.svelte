<!-- Public student page ( / ).
     The registration form (name + course dropdown). Registrations are viewed
     only in the protected teacher dashboard — students don't see other
     students' data. -->
<script>
	import RegistrationForm from '$lib/components/student/RegistrationForm.svelte';
</script>

<h1>SamiSphere</h1>
<p>Course registration — student page.</p>

<RegistrationForm />

<p><a href="/dashboard">Teacher dashboard →</a></p>
