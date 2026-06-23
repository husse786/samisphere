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

	// Close the success popup and let the student register again.
	function dismiss() {
		status = 'idle';
	}

	function handleKeydown(/** @type {KeyboardEvent} */ event) {
		if (status === 'saved' && event.key === 'Escape') dismiss();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

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

{#if status === 'incomplete'}
	<p class="msg">{$_('form.incomplete')}</p>
{:else if status === 'invalidEmail'}
	<p class="msg error">{$_('form.invalidEmail')}</p>
{:else if status === 'error'}
	<p class="msg error">{$_('form.error')}</p>
{/if}

{#if status === 'saved'}
	<!-- Success popup -->
	<div class="modal-overlay">
		<button type="button" class="backdrop" aria-label={$_('form.stayHere')} onclick={dismiss}></button>
		<div class="modal" role="dialog" aria-modal="true" aria-labelledby="success-title" tabindex="-1">
			<div class="emoji">🎉</div>
			<h3 id="success-title">{$_('form.successTitle')}</h3>
			<p class="modal-body">{$_('form.successBody')}</p>
			<div class="modal-actions">
				<Button onclick={dismiss}>{$_('form.stayHere')}</Button>
				<a class="home-btn" href="/">{$_('form.goHome')}</a>
			</div>
		</div>
	</div>
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
	.msg.error {
		color: var(--color-danger);
	}

	/* Success popup */
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
		background: rgba(10, 15, 30, 0.72);
		backdrop-filter: blur(4px);
		animation: fade-in 0.18s ease;
	}
	.backdrop {
		position: absolute;
		inset: 0;
		z-index: 0;
		background: transparent;
		border: none;
		cursor: pointer;
	}
	.modal {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 420px;
		background: var(--color-surface);
		border-radius: 18px;
		padding: var(--space-8) var(--space-6);
		text-align: center;
		box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
		animation: pop-in 0.22s cubic-bezier(0.18, 0.9, 0.32, 1.2);
	}
	.emoji {
		font-size: 3rem;
		line-height: 1;
		margin-bottom: var(--space-3);
	}
	.modal h3 {
		margin: 0 0 var(--space-2);
		font-size: 1.5rem;
	}
	.modal-body {
		margin: 0 0 var(--space-6);
		color: var(--color-text-muted);
		line-height: 1.6;
	}
	.modal-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		justify-content: center;
	}
	.home-btn {
		display: inline-flex;
		align-items: center;
		padding: var(--space-2) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-weight: 600;
		color: var(--color-text);
		text-decoration: none;
	}
	.home-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
		text-decoration: none;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}
	@keyframes pop-in {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.96);
		}
	}
</style>
