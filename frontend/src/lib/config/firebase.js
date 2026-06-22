// Centralized Firebase connection for SamiSphere — the ONLY place Firebase is
// initialized. Every service (registrations, courses) imports `db` from here.
// Keys come from the git-ignored `.env` via SvelteKit's public env module.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID
};

// One app instance, one Firestore handle, shared across the whole site.
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
