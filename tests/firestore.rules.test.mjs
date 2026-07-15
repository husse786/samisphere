// SamiSphere Firestore security-rules tests (run against the emulator).
//
// Run with:  npm test        (from this tests/ folder — starts the emulator,
//                              runs this script, shuts it down)
// or manually, from the repo root:
//   firebase emulators:exec --only firestore --project demo-samisphere \
//     "node tests/firestore.rules.test.mjs"
//
// Covers the Phase 12 additions on top of the existing rules:
//   - courses: optional price (number) / priceUnit / currency; non-number price
//     denied; anonymous create denied; public read limited to available slots.
//   - registrations: anonymous create with/without comment; comment >500 denied;
//     non-string comment denied; anonymous read denied; teacher delete allowed.
//
// …plus the Phase 13 student-access rules, the security-sensitive part of that
// phase — a student may read ONLY their own registrations, and may never write:
//   - student reads own registration ✅ / someone else's ❌
//   - student lists all registrations ❌ / lists own (constrained query) ✅
//   - student writes `paid` on their own row ❌ (and on someone else's ❌)
//   - teacher keeps full access ✅; anonymous create ✅; anonymous read ❌
import {
	initializeTestEnvironment,
	assertSucceeds,
	assertFails
} from '@firebase/rules-unit-testing';
import {
	doc,
	getDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	collection,
	getDocs,
	query,
	where
} from 'firebase/firestore';
import { readFileSync } from 'node:fs';

const TEACHER_EMAIL = 'samira@samisphere.com';
const STUDENT_EMAIL = 'anna@example.com';
const OTHER_STUDENT_EMAIL = 'bob@example.com';

const testEnv = await initializeTestEnvironment({
	projectId: 'demo-samisphere',
	firestore: {
		rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8')
	}
});

// Contexts: the logged-in teacher, two logged-in students, and an anonymous
// (logged-out) visitor. The students are ordinary auth accounts — exactly what
// `createStudentLogin` makes — with no special claims of any kind.
const teacherDb = testEnv
	.authenticatedContext('teacher-uid', { email: TEACHER_EMAIL })
	.firestore();
const studentDb = testEnv
	.authenticatedContext('student-uid', { email: STUDENT_EMAIL })
	.firestore();
const otherStudentDb = testEnv
	.authenticatedContext('other-uid', { email: OTHER_STUDENT_EMAIL })
	.firestore();
const anonDb = testEnv.unauthenticatedContext().firestore();

// --- tiny test runner ---------------------------------------------------------
let passed = 0;
let failed = 0;
async function test(name, fn) {
	try {
		await fn();
		passed++;
		console.log(`  ✓ ${name}`);
	} catch (err) {
		failed++;
		console.error(`  ✗ ${name}\n      ${err.message}`);
	}
}

// Seed data straight into the store, bypassing rules (for read tests).
await testEnv.withSecurityRulesDisabled(async (ctx) => {
	const db = ctx.firestore();
	await setDoc(doc(db, 'courses/available-1'), {
		course: 'Russian A1',
		time: 'Monday 10:00',
		status: 'available',
		price: 12.5,
		priceUnit: 'hour',
		currency: 'USD'
	});
	await setDoc(doc(db, 'courses/hidden-1'), {
		course: 'Secret',
		time: 'Tuesday 09:00',
		status: 'hidden'
	});
	await setDoc(doc(db, 'registrations/reg-1'), {
		firstName: 'Anna',
		lastName: 'Ivanova',
		email: STUDENT_EMAIL,
		course: 'Russian A1',
		time: 'Monday 10:00'
	});
	// Anna's second course — payment is per registration, so she can be paid for
	// one and unpaid for another. Both must be readable by her.
	await setDoc(doc(db, 'registrations/reg-anna-2'), {
		firstName: 'Anna',
		lastName: 'Ivanova',
		email: STUDENT_EMAIL,
		course: 'Russian A2',
		time: 'Thursday 15:00',
		paid: true,
		paidAt: '2026-07-15'
	});
	// Someone else's registration — Anna must never see this one.
	await setDoc(doc(db, 'registrations/reg-bob'), {
		firstName: 'Bob',
		lastName: 'Jones',
		email: OTHER_STUDENT_EMAIL,
		course: 'Russian A1',
		time: 'Monday 10:00',
		paid: true,
		paidAt: '2026-07-10'
	});
	// A legacy row whose email was stored with capitals (the form used to only
	// trim). Firebase Auth reports lowercase, so the rules compare lowercased —
	// this student should still reach their own row.
	await setDoc(doc(db, 'registrations/reg-mixedcase'), {
		firstName: 'Anna',
		lastName: 'Ivanova',
		email: 'Anna@Example.COM',
		course: 'Russian A1',
		time: 'Friday 09:00'
	});
});

console.log('Courses — create/update:');

await test('teacher creates a course with NO price (legacy shape) → allowed', () =>
	assertSucceeds(
		setDoc(doc(teacherDb, 'courses/c-legacy'), {
			course: 'Math 101',
			time: 'Wed 14:00',
			status: 'available'
		})
	));

await test('teacher creates a course WITH numeric price + unit + currency → allowed', () =>
	assertSucceeds(
		setDoc(doc(teacherDb, 'courses/c-priced'), {
			course: 'Russian A2',
			time: 'Thu 15:00',
			status: 'available',
			price: 800,
			priceUnit: 'month',
			currency: 'RUB'
		})
	));

await test('teacher creates a course with non-number price → denied', () =>
	assertFails(
		setDoc(doc(teacherDb, 'courses/c-badprice'), {
			course: 'Bad',
			time: 'Fri 16:00',
			status: 'available',
			price: '800'
		})
	));

await test('teacher creates a course with invalid priceUnit → denied', () =>
	assertFails(
		setDoc(doc(teacherDb, 'courses/c-badunit'), {
			course: 'Bad',
			time: 'Fri 16:00',
			status: 'available',
			price: 10,
			priceUnit: 'week'
		})
	));

await test('teacher creates a course with invalid currency → denied', () =>
	assertFails(
		setDoc(doc(teacherDb, 'courses/c-badcur'), {
			course: 'Bad',
			time: 'Fri 16:00',
			status: 'available',
			price: 10,
			currency: 'EUR'
		})
	));

await test('anonymous creates a course → denied', () =>
	assertFails(
		setDoc(doc(anonDb, 'courses/c-anon'), {
			course: 'Hack',
			time: 'Sat',
			status: 'available'
		})
	));

console.log('Courses — read:');

await test('anonymous reads an AVAILABLE course → allowed', () =>
	assertSucceeds(getDoc(doc(anonDb, 'courses/available-1'))));

await test('anonymous reads a HIDDEN course → denied', () =>
	assertFails(getDoc(doc(anonDb, 'courses/hidden-1'))));

await test('anonymous query constrained to status==available → allowed', () =>
	assertSucceeds(
		getDocs(query(collection(anonDb, 'courses'), where('status', '==', 'available')))
	));

console.log('Registrations — create:');

await test('anonymous creates a registration with NO comment → allowed', () =>
	assertSucceeds(
		setDoc(doc(anonDb, 'registrations/r-nocomment'), {
			firstName: 'Bob',
			lastName: 'Jones',
			email: 'bob@example.com',
			course: 'Russian A1',
			time: 'Monday 10:00'
		})
	));

await test('anonymous creates a registration with a short comment → allowed', () =>
	assertSucceeds(
		setDoc(doc(anonDb, 'registrations/r-comment'), {
			firstName: 'Bob',
			lastName: 'Jones',
			email: 'bob@example.com',
			course: 'Russian A1',
			time: 'Monday 10:00',
			comment: 'Looking forward to it!'
		})
	));

await test('anonymous creates a registration with a 500-char comment → allowed', () =>
	assertSucceeds(
		setDoc(doc(anonDb, 'registrations/r-comment500'), {
			firstName: 'Bob',
			lastName: 'Jones',
			email: 'bob@example.com',
			course: 'Russian A1',
			time: 'Monday 10:00',
			comment: 'x'.repeat(500)
		})
	));

await test('anonymous creates a registration with a 501-char comment → denied', () =>
	assertFails(
		setDoc(doc(anonDb, 'registrations/r-comment501'), {
			firstName: 'Bob',
			lastName: 'Jones',
			email: 'bob@example.com',
			course: 'Russian A1',
			time: 'Monday 10:00',
			comment: 'x'.repeat(501)
		})
	));

await test('anonymous creates a registration with a non-string comment → denied', () =>
	assertFails(
		setDoc(doc(anonDb, 'registrations/r-commentnum'), {
			firstName: 'Bob',
			lastName: 'Jones',
			email: 'bob@example.com',
			course: 'Russian A1',
			time: 'Monday 10:00',
			comment: 123
		})
	));

await test('anonymous creates a registration missing required fields → denied', () =>
	assertFails(
		setDoc(doc(anonDb, 'registrations/r-bad'), {
			firstName: 'Bob',
			comment: 'hi'
		})
	));

// ─── Phase 13: student access ────────────────────────────────────────────────
// The heart of the phase. A student is just an ordinary auth account, so these
// rules are all that stand between one student and another's data.
console.log('Registrations — student reads (Phase 13):');

await test('student reads their OWN registration → allowed', () =>
	assertSucceeds(getDoc(doc(studentDb, 'registrations/reg-1'))));

await test('student reads their own SECOND registration → allowed', () =>
	assertSucceeds(getDoc(doc(studentDb, 'registrations/reg-anna-2'))));

await test("student reads SOMEONE ELSE'S registration → denied", () =>
	assertFails(getDoc(doc(studentDb, 'registrations/reg-bob'))));

await test("student cannot read another's paid status via their doc → denied", () =>
	assertFails(getDoc(doc(otherStudentDb, 'registrations/reg-anna-2'))));

await test('student reads a legacy MIXED-CASE email row that is theirs → allowed', () =>
	assertSucceeds(getDoc(doc(studentDb, 'registrations/reg-mixedcase'))));

await test('student LISTS ALL registrations (unconstrained) → denied', () =>
	assertFails(getDocs(collection(studentDb, 'registrations'))));

await test("student queries by SOMEONE ELSE'S email → denied", () =>
	assertFails(
		getDocs(
			query(collection(studentDb, 'registrations'), where('email', '==', OTHER_STUDENT_EMAIL))
		)
	));

await test('student queries constrained to their OWN email → allowed', () =>
	assertSucceeds(
		getDocs(query(collection(studentDb, 'registrations'), where('email', '==', STUDENT_EMAIL)))
	));

console.log('Registrations — student writes are all denied (Phase 13):');

await test('student marks THEMSELVES paid → denied', () =>
	assertFails(updateDoc(doc(studentDb, 'registrations/reg-1'), { paid: true })));

await test('student marks their own paid registration UNPAID → denied', () =>
	assertFails(updateDoc(doc(studentDb, 'registrations/reg-anna-2'), { paid: false })));

await test("student marks SOMEONE ELSE'S registration paid → denied", () =>
	assertFails(updateDoc(doc(studentDb, 'registrations/reg-bob'), { paid: true })));

await test('student edits their own registration → denied', () =>
	assertFails(updateDoc(doc(studentDb, 'registrations/reg-1'), { course: 'Free lessons' })));

await test('student deletes their own registration → denied', () =>
	assertFails(deleteDoc(doc(studentDb, 'registrations/reg-1'))));

console.log('Courses — the student dashboard needs the link + price (Phase 13):');

await test('student reads an AVAILABLE course (meeting link + price) → allowed', () =>
	assertSucceeds(getDoc(doc(studentDb, 'courses/available-1'))));

await test('student reads a HIDDEN course → denied', () =>
	assertFails(getDoc(doc(studentDb, 'courses/hidden-1'))));

await test('student edits a course → denied', () =>
	assertFails(updateDoc(doc(studentDb, 'courses/available-1'), { price: 0 })));

console.log('Registrations — teacher keeps full access (Phase 13):');

await test('teacher marks a registration paid → allowed', () =>
	assertSucceeds(
		updateDoc(doc(teacherDb, 'registrations/reg-1'), { paid: true, paidAt: '2026-07-15' })
	));

await test("teacher reads any student's registration → allowed", () =>
	assertSucceeds(getDoc(doc(teacherDb, 'registrations/reg-bob'))));

await test('teacher LISTS all registrations → allowed', () =>
	assertSucceeds(getDocs(collection(teacherDb, 'registrations'))));

console.log('Registrations — read/delete:');

await test('anonymous reads registrations → denied', () =>
	assertFails(getDoc(doc(anonDb, 'registrations/reg-1'))));

await test('teacher reads registrations → allowed', () =>
	assertSucceeds(getDoc(doc(teacherDb, 'registrations/reg-1'))));

await test('teacher deletes a registration → allowed', () =>
	assertSucceeds(deleteDoc(doc(teacherDb, 'registrations/reg-1'))));

await test('teacher deletes a course → allowed', () =>
	assertSucceeds(deleteDoc(doc(teacherDb, 'courses/available-1'))));

await test('anonymous deletes a course → denied', () =>
	assertFails(deleteDoc(doc(anonDb, 'courses/hidden-1'))));

await testEnv.cleanup();

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
