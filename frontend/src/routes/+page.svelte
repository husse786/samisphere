<!-- Public student page ( / ).
     Phase 3: registration form + temporary list to confirm the save→read loop.
     Phase 4 adds the course dropdown; the temporary list is removed in Phase 5. -->
<script>
	import { onMount } from 'svelte';
	import RegistrationForm from '$lib/components/student/RegistrationForm.svelte';
	import { getRegistrations } from '$lib/services/registrations.js';

	let registrations = $state(
		/** @type {Array<{ id: string, name: string, date: string, course?: string, time?: string }>} */ ([])
	);

	async function load() {
		registrations = await getRegistrations();
	}

	onMount(load);
</script>

<h1>SamiSphere</h1>
<p>Course registration — student page.</p>

<RegistrationForm onsaved={load} />

<!-- TEMPORARY (Phase 3): proves type → save → see. Students should not see other
     students' data — this moves to the protected dashboard in Phase 5. -->
<h2>Registrations (temporary)</h2>
{#if registrations.length === 0}
	<p>No registrations yet.</p>
{:else}
	<ul>
		{#each registrations as r (r.id)}
			<li>{r.name} — {r.course ?? '—'} {r.time ?? ''} — {r.date}</li>
		{/each}
	</ul>
{/if}

<p><a href="/dashboard">Teacher dashboard →</a></p>
