import { db, USER_COLLECTION } from '@/lib/firebase';
import { User } from '@/models/user';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

// Users
export const createUser = async (
  userData: Omit<User, 'createdAt' | 'updatedAt'> & { password?: string }
) => {
  // validate if user exist already
  const userRef = doc(db, USER_COLLECTION, userData.email);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    throw new Error('User already exists');
  }
  await setDoc(doc(db, USER_COLLECTION, userData.email), {
    ...userData,
    createdAt: Timestamp.now().toDate().toISOString(),
  });
  return userData;
};

export const getUser = async (identifier: string) => {
  // Try to get user by UID first
  const userDoc = await getDoc(doc(db, USER_COLLECTION, identifier));
  if (userDoc.exists()) {
    return { uid: userDoc.id, ...userDoc.data() } as unknown as User;
  }

  // If not found by UID, try to get by email
  const usersRef = collection(db, USER_COLLECTION);
  const q = query(usersRef, where('email', '==', identifier));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { uid: doc.id, ...doc.data() } as unknown as User;
  }

  return null;
};

export const updateUser = async (uid: string, userData: Partial<User>) => {
  await updateDoc(doc(db, USER_COLLECTION, uid), userData);
};

export const deleteUser = async (uid: string) => {
  await deleteDoc(doc(db, USER_COLLECTION, uid));
};
