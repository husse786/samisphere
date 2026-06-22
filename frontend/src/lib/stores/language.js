// App-wide language state: the list of supported languages, plus helpers to
// switch language, persist the choice, and set page direction (RTL for Persian).
// Wraps svelte-i18n's `locale` store so components have one place to call.
import { locale } from 'svelte-i18n';
import { browser } from '$app/environment';

/** The three supported languages, shown in the prominent switcher. */
export const LANGUAGES = [
	{ code: 'en', label: 'English', flag: '🇬🇧' },
	{ code: 'ru', label: 'Русский', flag: '🇷🇺' },
	{ code: 'fa', label: 'فارسی', flag: '🇮🇷' }
];

const STORAGE_KEY = 'samisphere-lang';

/**
 * Switch the whole site to a language: update svelte-i18n, persist the choice,
 * and flip the page direction (Persian = RTL, others = LTR).
 * @param {string} code
 */
export function setLanguage(code) {
	locale.set(code);
	if (browser) {
		localStorage.setItem(STORAGE_KEY, code);
		document.documentElement.lang = code;
		document.documentElement.dir = code === 'fa' ? 'rtl' : 'ltr';
	}
}

/**
 * Apply the previously chosen language on load (browser only). Falls back to
 * the default (English) when nothing is stored. Call once on mount.
 */
export function initLanguage() {
	if (!browser) return;
	const saved = localStorage.getItem(STORAGE_KEY);
	setLanguage(saved && LANGUAGES.some((l) => l.code === saved) ? saved : 'en');
}
