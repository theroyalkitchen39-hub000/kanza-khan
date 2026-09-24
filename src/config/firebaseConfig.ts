// Firebase Configuration for The Royal Kitchen
// Supports Vite environment variables (VITE_FIREBASE_*) with built-in fallbacks

export interface FirebaseAppConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId?: string;
  oAuthClientId?: string;
  recaptchaSiteKey?: string;
}

export const firebaseConfig: FirebaseAppConfig = {
  projectId:
    (import.meta.env?.VITE_FIREBASE_PROJECT_ID as string) ||
    'gen-lang-client-0017620134',
  appId:
    (import.meta.env?.VITE_FIREBASE_APP_ID as string) ||
    '1:403380088288:web:49e895b2985dce1763cf85',
  apiKey:
    (import.meta.env?.VITE_FIREBASE_API_KEY as string) ||
    'AIzaSyCt2fnoWPv8HY4F7yA3C4kvKvII3Hnyrmo',
  authDomain:
    (import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN as string) ||
    'gen-lang-client-0017620134.firebaseapp.com',
  firestoreDatabaseId:
    (import.meta.env?.VITE_FIREBASE_DATABASE_ID as string) ||
    'ai-studio-1400a777-043d-4e8e-a917-8c2c78bff32a',
  storageBucket:
    (import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET as string) ||
    'gen-lang-client-0017620134.firebasestorage.app',
  messagingSenderId:
    (import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID as string) ||
    '403380088288',
  measurementId:
    (import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID as string) ||
    '',
  oAuthClientId:
    (import.meta.env?.VITE_FIREBASE_OAUTH_CLIENT_ID as string) ||
    '403380088288-kb1v08ji1g2ljqurkif5a21c3659lfrh.apps.googleusercontent.com',
  recaptchaSiteKey:
    (import.meta.env?.VITE_FIREBASE_RECAPTCHA_SITE_KEY as string) ||
    '',
};

export default firebaseConfig;
