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
 * Create one registration. The `date` (YYYY-MM-DD) is stamped automatically,
 * matching the data model in doc 01. Extra fields (course, time) are added by
 * the caller — Phase 4 wires in the course/slot selection.
 * @param {{ name: string, course?: string, time?: string }} registration
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
 * @returns {Promise<Array<{ id: string, name: string, date: string, course?: string, time?: string }>>}
 */
export async function getRegistrations() {
	const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
	const snap = await getDocs(q);
	return snap.docs.map(
		(d) =>
			/** @type {{ id: string, name: string, date: string, course?: string, time?: string }} */ ({
				id: d.id,
				...d.data()
			})
	);
}
