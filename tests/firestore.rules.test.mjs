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
import {
	initializeTestEnvironment,
	assertSucceeds,
	assertFails
} from '@firebase/rules-unit-testing';
import {
	doc,
	getDoc,
	setDoc,
	deleteDoc,
	collection,
	getDocs,
	query,
	where
} from 'firebase/firestore';
import { readFileSync } from 'node:fs';

const TEACHER_EMAIL = 'samira@samisphere.com';

const testEnv = await initializeTestEnvironment({
	projectId: 'demo-samisphere',
	firestore: {
		rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8')
	}
});

// Contexts: the logged-in teacher, and an anonymous (logged-out) visitor.
const teacherDb = testEnv
	.authenticatedContext('teacher-uid', { email: TEACHER_EMAIL })
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
		email: 'anna@example.com',
		course: 'Russian A1',
		time: 'Monday 10:00'
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
