// Centralized data logic for courses / time slots — the only place that reads
// and writes the `courses` collection. The student form reads only available
// slots; the teacher dashboard reads all of them and can add / edit / hide.
//
// Course / time-slot data shape (matches doc 01 §4):
//   {
//     course:   "Math 101",        // the course name
//     time:     "Monday 10:00",    // the time slot
//     status:   "available",       // "available" → shown to students;
//                                  // "hidden"    → never shown
//     capacity: 20                 // optional, reserved for a future auto-full
//                                  // feature (not used in v1)
//   }
import { db } from '$lib/config/firebase.js';
import {
	collection,
	query,
	where,
	getDocs,
	addDoc,
	updateDoc,
	doc
} from 'firebase/firestore';

const COLLECTION = 'courses';

/**
 * Read the course/slots a student is allowed to see — only `status:
 * "available"`. Hidden slots are filtered out by the query itself, so they
 * never reach the browser. Sorted by course then time for a tidy dropdown.
 * @returns {Promise<Array<{ id: string, course: string, time: string, status: string, capacity?: number }>>}
 */
export async function getAvailableCourses() {
	const q = query(collection(db, COLLECTION), where('status', '==', 'available'));
	const snap = await getDocs(q);
	const courses = snap.docs.map(
		(d) =>
			/** @type {{ id: string, course: string, time: string, status: string, capacity?: number }} */ ({
				id: d.id,
				...d.data()
			})
	);
	courses.sort((a, b) => a.course.localeCompare(b.course) || a.time.localeCompare(b.time));
	return courses;
}

/**
 * Read ALL course/slots — including hidden ones — for the teacher dashboard.
 * Sorted by course then time.
 * @returns {Promise<Array<{ id: string, course: string, time: string, status: string, capacity?: number }>>}
 */
export async function getAllCourses() {
	const snap = await getDocs(collection(db, COLLECTION));
	const courses = snap.docs.map(
		(d) =>
			/** @type {{ id: string, course: string, time: string, status: string, capacity?: number }} */ ({
				id: d.id,
				...d.data()
			})
	);
	courses.sort((a, b) => a.course.localeCompare(b.course) || a.time.localeCompare(b.time));
	return courses;
}

/**
 * Add a new course/slot. Starts `available` so it shows to students right away.
 * @param {{ course: string, time: string, capacity?: number }} fields
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export function addCourse({ course, time, capacity }) {
	/** @type {{ course: string, time: string, status: string, capacity?: number }} */
	const data = { course, time, status: 'available' };
	if (capacity !== undefined) data.capacity = capacity;
	return addDoc(collection(db, COLLECTION), data);
}

/**
 * Edit an existing course/slot's fields (e.g. course name or time).
 * @param {string} id
 * @param {{ course?: string, time?: string, capacity?: number }} fields
 */
export function updateCourse(id, fields) {
	return updateDoc(doc(db, COLLECTION, id), fields);
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
