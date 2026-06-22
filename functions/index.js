// SamiSphere Cloud Function — notifies the teacher on Telegram when a student
// registers. Gen-2 Firestore trigger: fires automatically on each new document
// in the `registrations` collection (doc 01 §5).
//
// ⚠️ PLACEHOLDER credentials (Phase 9). TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
//    are read from the environment and are EMPTY until Phase 11, when the real
//    bot is created and the values are filled into functions/.env (git-ignored).
//    Until then the function still runs and LOGS the message it *would* send, so
//    the trigger itself is verifiable before Telegram is connected.
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const logger = require('firebase-functions/logger');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

exports.notifyOnRegistration = onDocumentCreated(
	'registrations/{registrationId}',
	async (event) => {
		const data = event.data && event.data.data();
		if (!data) {
			logger.warn('notifyOnRegistration: event had no document data');
			return;
		}

		const name = data.name || 'Someone';
		const course = data.course || '—';
		const time = data.time || '—';
		const message = `New registration: ${name} signed up for ${course} — ${time}.`;

		// Placeholders not yet filled → log only (Phase 9 state).
		if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
			logger.info(`[Telegram placeholder — not yet configured] Would send: ${message}`);
			return;
		}

		// Real send (active once Phase 11 fills the credentials).
		const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
			});
			if (!res.ok) {
				logger.error('Telegram API returned an error', {
					status: res.status,
					body: await res.text()
				});
			} else {
				logger.info('Telegram notification sent', { message });
			}
		} catch (err) {
			logger.error('Failed to send Telegram message', err);
		}
	}
);
