// Centralized Firebase connection for SamiSphere — the ONLY place Firebase is
// initialized. Every service (registrations, courses) imports `db` from here.
// Keys come from the git-ignored `.env` via SvelteKit's public env module.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
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

// The region our Cloud Functions are deployed to. It must match the `region`
// set on the callable in `functions/index.js` — a mismatch means the browser
// calls a URL that doesn't exist.
const FUNCTIONS_REGION = 'me-central1';

// One app instance, shared across the whole site: Firestore for data, Auth for
// the teacher + student logins, Functions for the callable that creates a
// student's account (Phase 13).
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, FUNCTIONS_REGION);
