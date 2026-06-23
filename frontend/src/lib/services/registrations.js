// Centralized data logic for student registrations — the only place that
// reads/writes the `registrations` collection. UI components call these
// functions and never touch Firestore directly (the "scalability gem" from
// doc 02: swap Firestore for a backend later by changing only this file).
import { db } from '$lib/config/firebase.js';
import {
	collection,
	addDoc,
	getDocs,
	query,
	orderBy,
	serverTimestamp
} from 'firebase/firestore';

const COLLECTION = 'registrations';

/**
 * Create one registration. The `date` (YYYY-MM-DD) is stamped automatically.
 * The student's details + chosen course/time are passed in by the caller
 * (see the registration data model in doc 01 §4).
 * @param {{
 *   firstName: string, lastName: string, email: string, phone: string,
 *   city: string, country: string, course: string, time: string
 * }} registration
 */
export async function createRegistration(registration) {
	const date = new Date().toISOString().slice(0, 10);
	return addDoc(collection(db, COLLECTION), {
		...registration,
		date,
		createdAt: serverTimestamp()
	});
}

/**
 * Read all registrations, newest first.
 * @returns {Promise<Array<{ id: string, firstName?: string, lastName?: string, name?: string, email?: string, phone?: string, city?: string, country?: string, course?: string, time?: string, date: string }>>}
 */
export async function getRegistrations() {
	const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
	const snap = await getDocs(q);
	return snap.docs.map(
		(d) =>
			/** @type {{ id: string, firstName?: string, lastName?: string, name?: string, email?: string, phone?: string, city?: string, country?: string, course?: string, time?: string, date: string }} */ ({
				id: d.id,
				...d.data()
			})
	);
}
