// Centralized i18n setup. Loads the three translation files and initializes
// svelte-i18n synchronously (messages are bundled, so $_ is ready immediately,
// no async loading state). Default language is English.
import { init, addMessages } from 'svelte-i18n';
import en from './en.json';
import ru from './ru.json';
import fa from './fa.json';

addMessages('en', en);
addMessages('ru', ru);
addMessages('fa', fa);

init({
	fallbackLocale: 'en',
	initialLocale: 'en'
});
