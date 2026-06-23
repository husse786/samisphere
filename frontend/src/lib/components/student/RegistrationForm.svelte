<!-- Student registration form. Collects the student's details (first/last name,
     email, phone, city, country) plus a course/time slot, and saves them as one
     registration. -->
<script>
	import { _ } from 'svelte-i18n';
	import { createRegistration } from '$lib/services/registrations.js';
	import CourseDropdown from './CourseDropdown.svelte';
	import Button from '$lib/components/common/Button.svelte';

	// Optional callback so a parent can react to a successful save.
	let { onsaved = () => {} } = $props();

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state('');
	let city = $state('');
	let country = $state('');
	let selectedCourse = $state(
		/** @type {{ course: string, time: string } | null} */ (null)
	);
	let status = $state('idle'); // 'idle' | 'incomplete' | 'invalidEmail' | 'saving' | 'saved' | 'error'

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	async function handleSubmit(/** @type {SubmitEvent} */ event) {
		event.preventDefault();

		const allFilled =
			firstName.trim() &&
			lastName.trim() &&
			email.trim() &&
			phone.trim() &&
			city.trim() &&
			country.trim() &&
			selectedCourse;
		if (!allFilled || !selectedCourse) {
			status = 'incomplete';
			return;
		}
		if (!emailPattern.test(email.trim())) {
			status = 'invalidEmail';
			return;
		}

		status = 'saving';
		try {
			await createRegistration({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				phone: phone.trim(),
				city: city.trim(),
				country: country.trim(),
				course: selectedCourse.course,
				time: selectedCourse.time
			});
			firstName = '';
			lastName = '';
			email = '';
			phone = '';
			city = '';
			country = '';
			status = 'saved';
			onsaved?.();
		} catch (err) {
			console.error('Registration failed:', err);
			status = 'error';
		}
	}
</script>

<form onsubmit={handleSubmit} class="reg-form">
	<div class="row">
		<label>
			{$_('form.firstName')}
			<input bind:value={firstName} placeholder={$_('form.firstNamePlaceholder')} />
		</label>
		<label>
			{$_('form.lastName')}
			<input bind:value={lastName} placeholder={$_('form.lastNamePlaceholder')} />
		</label>
	</div>

	<label>
		{$_('form.email')}
		<input type="email" bind:value={email} placeholder={$_('form.emailPlaceholder')} />
	</label>

	<label>
		{$_('form.phone')}
		<input type="tel" bind:value={phone} placeholder={$_('form.phonePlaceholder')} />
	</label>

	<div class="row">
		<label>
			{$_('form.city')}
			<input bind:value={city} placeholder={$_('form.cityPlaceholder')} />
		</label>
		<label>
			{$_('form.country')}
			<input bind:value={country} placeholder={$_('form.countryPlaceholder')} />
		</label>
	</div>

	<CourseDropdown bind:selected={selectedCourse} />

	<Button type="submit" disabled={status === 'saving'}>
		{status === 'saving' ? $_('form.saving') : $_('form.register')}
	</Button>
</form>

{#if status === 'saved'}
	<p class="msg success">{$_('form.saved')}</p>
{:else if status === 'incomplete'}
	<p class="msg">{$_('form.incomplete')}</p>
{:else if status === 'invalidEmail'}
	<p class="msg error">{$_('form.invalidEmail')}</p>
{:else if status === 'error'}
	<p class="msg error">{$_('form.error')}</p>
{/if}

<style>
	.reg-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 460px;
		background: var(--color-surface);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}
	.row {
		display: flex;
		gap: var(--space-4);
		flex-wrap: wrap;
	}
	.row label {
		flex: 1 1 12rem;
	}
	.reg-form :global(label),
	.reg-form :global(input),
	.reg-form :global(select),
	.reg-form :global(.btn) {
		width: 100%;
	}
	.msg {
		margin-top: var(--space-4);
		font-weight: 600;
	}
	.msg.success {
		color: var(--color-accent);
	}
	.msg.error {
		color: var(--color-danger);
	}
</style>
