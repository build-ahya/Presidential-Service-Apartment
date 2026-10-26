import 'server-only';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, initializeFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

/** App Hosting forbids env vars starting with FIREBASE_, so the bucket may come from STORAGE_BUCKET
 *  or from the FIREBASE_CONFIG JSON that App Hosting injects automatically. */
function storageBucketName() {
  if (process.env.STORAGE_BUCKET) return process.env.STORAGE_BUCKET;
  if (process.env.FIREBASE_STORAGE_BUCKET) return process.env.FIREBASE_STORAGE_BUCKET;
  try {
    return JSON.parse(process.env.FIREBASE_CONFIG ?? '{}').storageBucket as string | undefined;
  } catch {
    return undefined;
  }
}

function adminApp() {
  if (getApps().length) return getApp();

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
    process.env;
  const hasCredentials =
    FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY;

  return initializeApp({
    // Without explicit credentials fall back to Application Default Credentials
    // (App Hosting / Cloud Run).
    ...(hasCredentials
      ? {
          credential: cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        }
      : {}),
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: storageBucketName(),
  });
}

function createDb() {
  const app = adminApp();
  try {
    return initializeFirestore(app, { ignoreUndefinedProperties: true } as Parameters<typeof initializeFirestore>[1]);
  } catch {
    // Already initialised (dev hot reload) — reuse it.
    return getFirestore(app);
  }
}

export const adminDb = createDb();

export const adminBucket = () => getStorage(adminApp()).bucket();

/** `websites/presidentialserviceapartments.ng` — every collection lives under this document. */
export const ROOT_PATH = (
  process.env.ROOT_DATABASE_COLLECTION ||
  'websites/presidentialserviceapartments.ng'
)
  .split('#')[0]
  .trim();

const root = () => adminDb.doc(ROOT_PATH);

export const collections = {
  content: () => root().collection('content'),
  users: () => root().collection('users'),
  properties: () => root().collection('properties'),
  apartments: () => root().collection('apartments'),
  reservations: () => root().collection('reservations'),
  media: () => root().collection('media'),
  blog: () => root().collection('blog'),
  blogCategories: () => root().collection('categories'),
};

/** Folder in the storage bucket where uploads are kept. */
export const STORAGE_ROOT = 'presidentialserviceapartments.ng';
