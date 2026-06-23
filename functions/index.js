// SamiSphere Cloud Function — notifies the teacher (and any admins) on Telegram
// when a student registers. Gen-2 Firestore trigger: fires automatically on each
// new document in the `registrations` collection (doc 01 §5).
//
// Credentials come from the environment (functions/.env, git-ignored; uploaded
// with the function on deploy). TELEGRAM_CHAT_ID may hold MULTIPLE chat IDs,
// comma-separated — every recipient gets the message. If credentials are empty,
// the function just LOGS the message it would send.
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const logger = require('firebase-functions/logger');

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

		let message = `New registration: ${fullName} signed up for ${course} — ${time}.`;
		if (contactParts) message += `\nContact: ${contactParts}`;
		if (location) message += `\nFrom: ${location}`;

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
