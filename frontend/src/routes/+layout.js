// Static (SPA) build config. The whole app renders in the browser (Firebase
// Auth/Firestore are client-side), so we disable server-side rendering and
// prerendering — every route is served from the SPA shell (index.html).
export const ssr = false;
export const prerender = false;
