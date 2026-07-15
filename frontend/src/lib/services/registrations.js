// Centralized data logic for student registrations — the only place that
// reads/writes the `registrations` collection. UI components call these
// functions and never touch Firestore directly (the "scalability gem" from
// doc 02: swap Firestore for a backend later by changing only this file).
//
// Registration data shape (matches doc 01 §4):
//   {
//     firstName: "Anna",
//     lastName:  "Ivanova",
//     email:     "anna@example.com",     // also the key the student dashboard
//                                        // matches on (Phase 13): a student
//                                        // sees every registration whose email
//                                        // equals their auth email.
//     phone:     "+994 50 123 45 67",
//     city:      "Baku",
//     country:   "Azerbaijan",
//     course:    "Math 101",
//     time:      "Monday 10:00",
//     comment:   "Prefer evenings!",     // optional (Phase 12) — ≤ 500 chars,
//                                        // stored only when non-empty.
//     paid:      true,                   // optional (Phase 13) — has the student
//                                        // paid for THIS registration? Payment
//                                        // is per registration, not per student.
//                                        // ABSENT means NOT PAID (old records).
//     paidAt:    "2026-07-15",           // optional (Phase 13) — the day `paid`
//                                        // was flipped to true (YYYY-MM-DD, same
//                                        // convention as `date`). Removed again
//                                        // when the teacher flips back to unpaid,
//                                        // so a stale date can never linger.
//     date:      "2026-06-22",           // the day the student registered
//     createdAt: <serverTimestamp>
//   }
//
// Note: payment NEVER gates anything (deliberate decision, doc 03 Phase 13).
// It is a status Samira tracks — the class join link does not depend on it.
import { db } from '$lib/config/firebase.js';
import {
	collection,
	addDoc,
	getDocs,
	deleteDoc,
	updateDoc,
	deleteField,
	doc,
	query,
	where,
	orderBy,
	serverTimestamp
} from 'firebase/firestore';

const COLLECTION = 'registrations';

/**
 * Create one registration. The `date` (YYYY-MM-DD) is stamped automatically.
 * The student's details + chosen course/time are passed in by the caller
 * (see the registration data model in doc 01 §4). The optional `comment`
 * (Phase 12) is a short student note; it is stored only when non-empty.
 * `paid` is intentionally NOT set here — an absent field reads as not paid,
 * so a new registration starts unpaid without storing anything (Phase 13).
 *
 * The email is stored LOWERCASED. Firebase Auth normalizes addresses to
 * lowercase, and from Phase 13 the student dashboard finds a student's courses
 * by matching this field against their auth email — so a student who typed
 * "Anna@Example.com" would otherwise never match their own registration and
 * would see an empty dashboard. Normalizing here, at the one place that writes
 * the collection, keeps the two sides comparable.
 * @param {{
 *   firstName: string, lastName: string, email: string, phone: string,
 *   city: string, country: string, course: string, time: string,
 *   comment?: string
 * }} registration
 */
export async function createRegistration(registration) {
	const date = new Date().toISOString().slice(0, 10);
	const { comment, email, ...rest } = registration;
	/** @type {Record<string, unknown>} */
	const data = {
		...rest,
		email: String(email ?? '').trim().toLowerCase(),
		date,
		createdAt: serverTimestamp()
	};
	if (comment && comment.trim()) data.comment = comment.trim(); // store only when provided
	return addDoc(collection(db, COLLECTION), data);
}

/**
 * Read all registrations, newest first. Teacher-only (security rules).
 * @returns {Promise<Array<{ id: string, firstName?: string, lastName?: string, name?: string, email?: string, phone?: string, city?: string, country?: string, course?: string, time?: string, comment?: string, paid?: boolean, paidAt?: string, date: string }>>}
 */
export async function getRegistrations() {
	const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
	const snap = await getDocs(q);
	return snap.docs.map(
		(d) =>
			/** @type {{ id: string, firstName?: string, lastName?: string, name?: string, email?: string, phone?: string, city?: string, country?: string, course?: string, time?: string, comment?: string, paid?: boolean, paidAt?: string, date: string }} */ ({
				id: d.id,
				...d.data()
			})
	);
}

/**
 * Read every registration belonging to ONE student, by email — what the student
 * dashboard shows (Phase 13). The `where` clause is not just a filter: the
 * security rules only permit a query constrained to the caller's own auth email,
 * so an unconstrained read of this collection is rejected outright.
 * @param {string} email the logged-in student's auth email
 * @returns {Promise<Array<{ id: string, firstName?: string, lastName?: string, name?: string, email?: string, course?: string, time?: string, comment?: string, paid?: boolean, paidAt?: string, date: string }>>}
 */
export async function getRegistrationsByEmail(email) {
	// Lowercased to match how the email is stored (see createRegistration) and how
	// Firebase Auth reports it.
	const normalized = String(email ?? '').trim().toLowerCase();
	const q = query(collection(db, COLLECTION), where('email', '==', normalized));
	const snap = await getDocs(q);
	const rows = snap.docs.map(
		(d) =>
			/** @type {{ id: string, firstName?: string, lastName?: string, name?: string, email?: string, course?: string, time?: string, comment?: string, paid?: boolean, paidAt?: string, date: string }} */ ({
				id: d.id,
				...d.data()
			})
	);
	// Newest first, like the teacher's list. Sorted here rather than in the query
	// so no composite index is needed for the email + createdAt combination.
	rows.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
	return rows;
}

/**
 * Set a registration's paid status (Phase 13). Flipping to paid stamps `paidAt`
 * with today's date; flipping back to unpaid REMOVES `paidAt` entirely rather
 * than leaving a stale date behind. Teacher-only, enforced by the rules.
 * @param {string} id
 * @param {boolean} paid the new status
 */
export function setRegistrationPaid(id, paid) {
	const paidAt = paid ? new Date().toISOString().slice(0, 10) : deleteField();
	return updateDoc(doc(db, COLLECTION, id), { paid, paidAt });
}

/**
 * Permanently delete a registration. Irreversible — the UI must confirm first
 * (doc 03, Phase 12). Teacher-only, enforced by the security rules.
 * @param {string} id
 */
export function deleteRegistration(id) {
	return deleteDoc(doc(db, COLLECTION, id));
}
