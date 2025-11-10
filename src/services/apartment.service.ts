import { APARTMENT_COLLECTION, db } from '@/lib/firebase';
import { Apartment } from '@/models/apartment';
import { apartments as mockApartments } from '@/mock-data/apartments';
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, addDoc } from 'firebase/firestore';

export class ApartmentService {
  /**
   * Fetch all apartments. Falls back to mock data if none are found or on error.
   */
  static async getApartments(): Promise<Apartment[]> {
    try {
      const colRef = collection(db, APARTMENT_COLLECTION);
      const snap = await getDocs(colRef);
      const results: Apartment[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

      if (!results || results.length === 0) {
        return mockApartments;
      }
      return results;
    } catch (error) {
      console.error('Error fetching apartments:', error);
      return mockApartments;
    }
  }

  /**
   * Fetch an apartment by slug. Falls back to mock data if not found or on error.
   */
  static async getApartmentBySlug(slug: string): Promise<Apartment | null> {
    try {
      const colRef = collection(db, APARTMENT_COLLECTION);
      const q = query(colRef, where('slug', '==', slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...(doc.data() as any) } as Apartment;
      }

      // Fallback to mock data
      const fallback = mockApartments.find((a) => a.slug === slug);
      return fallback || null;
    } catch (error) {
      console.error('Error fetching apartment by slug:', error);
      const fallback = mockApartments.find((a) => a.slug === slug);
      return fallback || null;
    }
  }

  /**
   * Fetch an apartment by document id. Falls back to mock data if not found or on error.
   */
  static async getApartmentById(id: string): Promise<Apartment | null> {
    try {
      const docRef = doc(db, APARTMENT_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as any) } as Apartment;
      }
      const fallback = mockApartments.find((a) => a.id === id);
      return fallback || null;
    } catch (error) {
      console.error('Error fetching apartment by id:', error);
      const fallback = mockApartments.find((a) => a.id === id);
      return fallback || null;
    }
  }

  /**
   * Update apartment document by id.
   */
  static async updateApartment(id: string, payload: Partial<Apartment>): Promise<void> {
    try {
      const docRef = doc(db, APARTMENT_COLLECTION, id);
      await updateDoc(docRef, payload as any);
    } catch (error) {
      console.error('Error updating apartment:', error);
      throw new Error('Failed to update apartment');
    }
  }

  /**
   * Delete apartment document by id.
   */
  static async deleteApartment(id: string): Promise<void> {
    try {
      const docRef = doc(db, APARTMENT_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting apartment:', error);
      throw new Error('Failed to delete apartment');
    }
  }

  /**
   * Create a new apartment document.
   */
  static async createApartment(payload: any): Promise<Apartment> {
    try {
      const colRef = collection(db, APARTMENT_COLLECTION);
      const created = await addDoc(colRef, payload as any);
      // persist id field in the document
      await updateDoc(doc(db, APARTMENT_COLLECTION, created.id), { id: created.id });
      return { id: created.id, ...(payload as any) } as Apartment;
    } catch (error) {
      console.error('Error creating apartment:', error);
      throw new Error('Failed to create apartment');
    }
  }
}