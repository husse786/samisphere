// Centralized auth logic for the teacher login — the only place that talks to
// Firebase Auth. Components call these instead of importing Firebase directly.
import { auth } from '$lib/config/firebase.js';
import {
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged
} from 'firebase/auth';

/**
 * Sign the teacher in with email + password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export function signIn(email, password) {
	return signInWithEmailAndPassword(auth, email, password);
}

/** Sign the teacher out. */
export function signOutTeacher() {
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
