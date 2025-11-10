import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

export const CONTENT_COLLECTION = 'websites/presidentialserviceapartments.ng/content';
export const USER_COLLECTION = 'websites/presidentialserviceapartments.ng/users';
export const BLOG_COLLECTION = 'websites/presidentialserviceapartments.ng/blog';
export const BLOG_CATEGORY_COLLECTION = 'websites/presidentialserviceapartments.ng/categories';
export const BOOKING_COLLECTION = 'websites/presidentialserviceapartments.ng/bookings';
export const RESERVATION_COLLECTION = 'websites/presidentialserviceapartments.ng/reservations';
export const APARTMENT_COLLECTION = 'websites/presidentialserviceapartments.ng/apartments';