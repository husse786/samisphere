// Centralized data logic for courses / time slots — the only place that reads
// the `courses` collection. (Write operations — add/edit/hide — are added in
// Phase 6 for the teacher dashboard.)
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
import { collection, query, where, getDocs } from 'firebase/firestore';

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
