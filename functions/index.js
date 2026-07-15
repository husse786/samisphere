// SamiSphere Cloud Functions (gen 2). Two of them:
//
//   1. notifyOnRegistration — a Firestore trigger that messages the teacher (and
//      any admins) on Telegram when a student registers (doc 01 §5).
//   2. createStudentLogin  — a callable that creates or resets a student's
//      Firebase Auth account from Samira's dashboard (doc 03, Phase 13).
//
// Credentials come from the environment (functions/.env, git-ignored; uploaded
// with the function on deploy). TELEGRAM_CHAT_ID may hold MULTIPLE chat IDs,
// comma-separated — every recipient gets the message. If credentials are empty,
// the function just LOGS the message it would send.
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const logger = require('firebase-functions/logger');
const { randomInt } = require('node:crypto');

// One Admin SDK app for the whole file. Only createStudentLogin uses it; the
// Telegram trigger reads its data straight off the event.
initializeApp();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
// One or more chat IDs, comma-separated (e.g. admin + teacher).
const TELEGRAM_CHAT_IDS = (process.env.TELEGRAM_CHAT_ID || '')
	.split(',')
	.map((id) => id.trim())
	.filter(Boolean);

exports.notifyOnRegistration = onDocumentCreated(
	'registrations/{registrationId}',
	async (event) => {
		const data = event.data && event.data.data();
		if (!data) {
			logger.warn('notifyOnRegistration: event had no document data');
			return;
		}

		// Full name from first+last, falling back to the legacy single `name`.
		const fullName =
			[data.firstName, data.lastName].filter(Boolean).join(' ') || data.name || 'Someone';
		const course = data.course || '—';
		const time = data.time || '—';
		const contactParts = [data.email, data.phone].filter(Boolean).join(' · ');
		const location = [data.city, data.country].filter(Boolean).join(', ');
		const comment = typeof data.comment === 'string' ? data.comment.trim() : '';

		let message = `New registration: ${fullName} signed up for ${course} — ${time}.`;
		if (contactParts) message += `\nContact: ${contactParts}`;
		if (location) message += `\nFrom: ${location}`;
		if (comment) message += `\nComment: ${comment}`;

		// Credentials not configured → log only (used before the bot is wired up).
		if (!TELEGRAM_BOT_TOKEN || TELEGRAM_CHAT_IDS.length === 0) {
			logger.info(`[Telegram not configured] Would send: ${message}`);
			return;
		}

		// Send to every configured recipient (admin + teacher).
		const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
		await Promise.all(
			TELEGRAM_CHAT_IDS.map(async (chatId) => {
				try {
					const res = await fetch(url, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ chat_id: chatId, text: message })
					});
					if (!res.ok) {
						logger.error('Telegram API returned an error', {
							chatId,
							status: res.status,
							body: await res.text()
						});
					} else {
						logger.info('Telegram notification sent', { chatId });
					}
				} catch (err) {
					logger.error('Failed to send Telegram message', { chatId, err });
				}
			})
		);
	}
);

// ─── createStudentLogin ──────────────────────────────────────────────────────
//
// Creating Firebase Auth accounts needs the Admin SDK, which must NEVER run in
// a browser — hence a callable function. Samira presses one button per
// registration and gets back a password to send the student over Telegram.
//
// Security notes (doc 03, Phase 13.5 — non-negotiable):
//   - The caller MUST be the teacher. We check the email on the verified auth
//     token that Firebase attaches to the call; nothing sent by the client is
//     trusted for this. The pinned address mirrors `firestore.rules`.
//   - The generated password is returned in the RESPONSE and is never written to
//     Firestore. Firebase Auth stores it hashed. No document anywhere gets a
//     password field — that is the whole point of doing this here.
//   - Errors come back as proper HttpsErrors with human-readable messages;
//     internal failures are logged server-side and surfaced as a generic
//     'internal', so nothing about the backend leaks to the browser.

// Must match the pinned teacher in firestore.rules. Her address cannot be
// re-registered by anyone else (it is already taken), so pinning the email is
// enough to identify her — the same reasoning the rules rely on.
const TEACHER_EMAIL = 'samira@samisphere.com';

// Deployed alongside notifyOnRegistration so both live in one region.
const REGION = 'me-central1';

// Deliberately free of ambiguous characters: no 0/O, no 1/l/I, no symbols.
// Samira retypes these into Telegram by hand and students retype them again.
const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789'; // 32 chars

/**
 * A friendly, hand-typable password: two groups of five, e.g. `k4m9x-2p7b3`.
 * 10 random characters from a 32-symbol alphabet ≈ 10^15 combinations, which is
 * far past guessable, while still being readable off a chat message.
 */
function generatePassword() {
	const pick = () => ALPHABET[randomInt(ALPHABET.length)];
	const group = () => Array.from({ length: 5 }, pick).join('');
	return `${group()}-${group()}`;
}

exports.createStudentLogin = onCall({ region: REGION }, async (request) => {
	// 1. Only the teacher may call this. `request.auth` is populated from a token
	//    Firebase itself verified, so it cannot be forged by the caller.
	if (!request.auth) {
		throw new HttpsError('unauthenticated', 'You must be signed in.');
	}
	if (request.auth.token.email !== TEACHER_EMAIL) {
		logger.warn('createStudentLogin: rejected a non-teacher caller', {
			uid: request.auth.uid
		});
		throw new HttpsError('permission-denied', 'Only the teacher may create student logins.');
	}

	// 2. Validate the requested student email.
	const email = String(request.data?.email ?? '')
		.trim()
		.toLowerCase();
	if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
		throw new HttpsError('invalid-argument', 'A valid student email is required.');
	}
	if (email === TEACHER_EMAIL) {
		// Guard against Samira accidentally resetting her own password from a row.
		throw new HttpsError('invalid-argument', 'That is the teacher account.');
	}

	const password = generatePassword();
	const auth = getAuth();

	try {
		// 3. Existing account → reset its password. No account → create one.
		//    getUserByEmail throws auth/user-not-found, which is the "create" path.
		let existing = null;
		try {
			existing = await auth.getUserByEmail(email);
		} catch (err) {
			if (err.code !== 'auth/user-not-found') throw err;
		}

		if (existing) {
			await auth.updateUser(existing.uid, { password });
			logger.info('createStudentLogin: password reset', { uid: existing.uid });
			return { action: 'reset', email, password };
		}

		const created = await auth.createUser({ email, password });
		logger.info('createStudentLogin: account created', { uid: created.uid });
		return { action: 'created', email, password };
	} catch (err) {
		// Known, actionable Auth errors get a clear message; anything else is
		// logged here and returned as a generic error so no internals escape.
		if (err.code === 'auth/invalid-email') {
			throw new HttpsError('invalid-argument', 'A valid student email is required.');
		}
		if (err.code === 'auth/email-already-exists') {
			// Raced with another create between our lookup and this write.
			throw new HttpsError('aborted', 'That account was just created. Please try again.');
		}
		logger.error('createStudentLogin failed', { err });
		throw new HttpsError('internal', 'Could not create the login. Please try again.');
	}
});
