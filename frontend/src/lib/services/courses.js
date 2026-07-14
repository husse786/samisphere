// Centralized data logic for courses / time slots — the only place that reads
// and writes the `courses` collection. The student form reads only available
// slots; the teacher dashboard reads all of them and can add / edit / hide /
// delete. The homepage reads a grouped, price-only showcase (see
// getShowcaseCourses).
//
// Course / time-slot data shape (matches doc 01 §4):
//   {
//     course:      "Math 101",            // the course name
//     time:        "Monday 10:00",        // the time slot
//     status:      "available",           // "available" → shown to students;
//                                         // "hidden"    → never shown
//     capacity:    20,                    // optional, reserved for a future
//                                         // auto-full feature (not used in v1)
//     meetingLink: "https://meet…"        // optional static online-class URL
//                                         // (Google Meet / Teams / Jitsi). May
//                                         // be empty or absent.
//     price:       12.5,                  // optional (Phase 12) — a number,
//                                         // decimals allowed. Absent on legacy
//                                         // courses. Price is PER COURSE (it
//                                         // does not vary between time slots of
//                                         // the same course).
//     priceUnit:   "hour",                // optional — "hour" | "month".
//     currency:    "USD"                  // optional — "RUB" | "USD".
//   }
import { db } from '$lib/config/firebase.js';
import {
	collection,
	query,
	where,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc
} from 'firebase/firestore';

const COLLECTION = 'courses';

// Currency symbols for display (Phase 12). Only RUB / USD are supported.
export const CURRENCY_SYMBOLS = /** @type {const} */ ({ RUB: '₽', USD: '$' });

/**
 * Format a course's money amount for display, e.g. `$12.50` or `₽800.00`.
 * Returns `null` when the course has no valid price set (so callers can show a
 * "No price set" / skip it). The billing period word (/ hour, / month) is added
 * by the UI from the i18n files, since it must be translatable.
 * @param {{ price?: number, currency?: string }} course
 * @returns {string | null}
 */
export function formatMoney({ price, currency }) {
	if (typeof price !== 'number' || Number.isNaN(price)) return null;
	const symbol = CURRENCY_SYMBOLS[/** @type {'RUB' | 'USD'} */ (currency)] ?? '';
	return `${symbol}${price.toFixed(2)}`;
}

/**
 * Read the course/slots a student is allowed to see — only `status:
 * "available"`. Hidden slots are filtered out by the query itself, so they
 * never reach the browser. Sorted by course then time for a tidy dropdown.
 * @returns {Promise<Array<{ id: string, course: string, time: string, status: string, capacity?: number, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }>>}
 */
export async function getAvailableCourses() {
	const q = query(collection(db, COLLECTION), where('status', '==', 'available'));
	const snap = await getDocs(q);
	const courses = snap.docs.map(
		(d) =>
			/** @type {{ id: string, course: string, time: string, status: string, capacity?: number, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }} */ ({
				id: d.id,
				...d.data()
			})
	);
	courses.sort((a, b) => a.course.localeCompare(b.course) || a.time.localeCompare(b.time));
	return courses;
}

/**
 * Read the homepage showcase list — one entry per unique course NAME, with only
 * marketing-safe fields (name + price). Built on top of getAvailableCourses so
 * it can never read hidden data. Courses with no valid `price` are excluded.
 *
 * Known, accepted limitation (doc 03, Phase 12): if two available slots share a
 * course name but differ in price, the FIRST one (by the getAvailableCourses
 * sort — course then time) wins deterministically. Price is meant to be per
 * course, so this is not expected in practice.
 * @returns {Promise<Array<{ course: string, price: number, priceUnit?: string, currency?: string }>>}
 */
export async function getShowcaseCourses() {
	const available = await getAvailableCourses();
	const byName = new Map();
	for (const c of available) {
		if (typeof c.price !== 'number' || Number.isNaN(c.price)) continue; // price-less → excluded
		if (byName.has(c.course)) continue; // first (deterministic) wins
		byName.set(c.course, {
			course: c.course,
			price: c.price,
			priceUnit: c.priceUnit,
			currency: c.currency
		});
	}
	return [...byName.values()];
}

/**
 * Read ALL course/slots — including hidden ones — for the teacher dashboard.
 * Sorted by course then time.
 * @returns {Promise<Array<{ id: string, course: string, time: string, status: string, capacity?: number, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }>>}
 */
export async function getAllCourses() {
	const snap = await getDocs(collection(db, COLLECTION));
	const courses = snap.docs.map(
		(d) =>
			/** @type {{ id: string, course: string, time: string, status: string, capacity?: number, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }} */ ({
				id: d.id,
				...d.data()
			})
	);
	courses.sort((a, b) => a.course.localeCompare(b.course) || a.time.localeCompare(b.time));
	return courses;
}

/**
 * Add a new course/slot. Starts `available` so it shows to students right away.
 * Price is only stored when a valid number is given (mirrors the `meetingLink`
 * pattern of only persisting meaningful values); the period and currency ride
 * along with it.
 * @param {{ course: string, time: string, capacity?: number, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }} fields
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export function addCourse({ course, time, capacity, meetingLink, price, priceUnit, currency }) {
	/** @type {{ course: string, time: string, status: string, capacity?: number, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }} */
	const data = { course, time, status: 'available' };
	if (capacity !== undefined) data.capacity = capacity;
	if (meetingLink) data.meetingLink = meetingLink; // only store a non-empty link
	if (typeof price === 'number' && !Number.isNaN(price)) {
		data.price = price;
		if (priceUnit) data.priceUnit = priceUnit;
		if (currency) data.currency = currency;
	}
	return addDoc(collection(db, COLLECTION), data);
}

/**
 * Edit an existing course/slot's fields (e.g. course name, time, meeting link,
 * price / period / currency). Callers pass exactly the fields they want to
 * change; adding a price to an old course later simply passes `price`,
 * `priceUnit`, `currency`.
 * @param {string} id
 * @param {{ course?: string, time?: string, capacity?: number, meetingLink?: string, price?: number, priceUnit?: string, currency?: string }} fields
 */
export function updateCourse(id, fields) {
	return updateDoc(doc(db, COLLECTION, id), fields);
}

/**
 * Permanently delete a course/slot. Irreversible — the UI must confirm first
 * (doc 03, Phase 12). Teacher-only, enforced by the security rules.
 * @param {string} id
 */
export function deleteCourse(id) {
	return deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Flip a slot's visibility. `"available"` shows it to students; `"hidden"`
 * removes it from the student dropdown (the manual-hide feature, doc 01 §6).
 * @param {string} id
 * @param {'available' | 'hidden'} status
 */
export function setCourseStatus(id, status) {
	return updateDoc(doc(db, COLLECTION, id), { status });
}
