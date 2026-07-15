<!-- About page ( /about ). A PLACEHOLDER only (Phase 13, Task 13.2): it exists so
     the header's four-item shell is complete. The real introduction is a later,
     human-written step by Samira — do not invent bio or marketing copy here.
     Dark background, matching the other public pages (landing, register). -->
<script>
	import { _ } from 'svelte-i18n';
</script>

<section class="about-page">
	<div class="about-inner">
		<h1>{$_('about.title')}</h1>
		<p class="placeholder">{$_('about.placeholder')}</p>
	</div>
</section>

<style>
	.about-page {
		position: relative;
		min-height: calc(100vh - 62px);
		background:
			radial-gradient(900px 500px at 80% -10%, rgba(59, 130, 246, 0.18), transparent 60%),
			radial-gradient(700px 500px at 0% 110%, rgba(56, 189, 248, 0.12), transparent 60%),
			var(--color-dark-bg);
		overflow: hidden;
	}
	.about-inner {
		max-width: 560px;
		margin: 0 auto;
		padding: clamp(var(--space-8), 12vh, 6rem) var(--space-4);
		text-align: center;
	}
	.about-inner h1 {
		color: var(--color-dark-text);
		margin-bottom: var(--space-4);
	}
	.placeholder {
		font-size: 1.15rem;
		line-height: 1.7;
		color: var(--color-dark-muted);
		margin: 0;
	}
</style>
