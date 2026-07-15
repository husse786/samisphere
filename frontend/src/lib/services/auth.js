// Centralized auth logic — the only place that talks to Firebase Auth. Covers
// both doors: the teacher's dashboard login and the student dashboard login
// (Phase 13). Components call these instead of importing Firebase directly.
import { auth, functions } from '$lib/config/firebase.js';
import {
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

/**
 * The one teacher account. Pinned here to mirror `firestore.rules` and the
 * Cloud Function — the three must always agree. In the browser this is only
 * used to tell the two dashboards apart (the "wrong door" message); it grants
 * nothing. Real enforcement lives in the rules and the function.
 */
export const TEACHER_EMAIL = 'samira@samisphere.com';

/**
 * Is this signed-in user the teacher? Anyone else is treated as a student.
 * @param {import('firebase/auth').User | null | undefined} user
 */
export function isTeacher(user) {
	return user?.email === TEACHER_EMAIL;
}

/**
 * Sign in with email + password. Used by both the teacher and student logins —
 * Firebase does not care which; the page decides what to show afterwards.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export function signIn(email, password) {
	return signInWithEmailAndPassword(auth, email, password);
}

/** Sign the current user out — teacher or student, it is the same session. */
export function signOutUser() {
	return signOut(auth);
}

/**
 * Observe auth state. Calls `callback` with the current user (or null) now and
 * on every change. Returns an unsubscribe function.
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {import('firebase/auth').Unsubscribe}
 */
export function onAuthChange(callback) {
	return onAuthStateChanged(auth, callback);
}

/**
 * Create a student's login, or reset it if the email already has an account
 * (Phase 13). Wraps the `createStudentLogin` Cloud Function: creating auth
 * users needs the Admin SDK, which can never run in a browser.
 *
 * The returned password is shown to Samira ONCE and is never stored anywhere —
 * not in Firestore, not here. She sends it to the student over Telegram
 * herself. Calling this again for the same email simply issues a new one.
 *
 * Teacher-only: the function verifies the caller's own auth token, so a student
 * calling this directly is rejected server-side.
 *
 * @param {string} email the student's email, as it appears on the registration
 * @returns {Promise<{ action: 'created' | 'reset', email: string, password: string }>}
 */
export async function createStudentLogin(email) {
	const call = /** @type {import('firebase/functions').HttpsCallable<{ email: string }, { action: 'created' | 'reset', email: string, password: string }>} */ (
		httpsCallable(functions, 'createStudentLogin')
	);
	const result = await call({ email });
	return result.data;
}
