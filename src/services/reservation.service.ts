import { db, RESERVATION_COLLECTION } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import type { Reservation } from '@/models/reservation';


function toISO(date: Date | string | number | undefined): string | undefined {
  if (!date) return undefined;
  return typeof date === 'string' ? date : new Date(date).toISOString();
}

function nowISO() {
  return new Date().toISOString();
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS < bE && bS < aE; // overlap if ranges intersect
}

export class ReservationService {
  static async listAll(): Promise<Reservation[]> {
    const col = collection(db, RESERVATION_COLLECTION);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => ({ ...(d.data() as Omit<Reservation, 'id'>), id: d.id }));
  }

  static async list(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    tags?: string[];
    apartmentId?: string;
    roomId?: string;
    order?: 'asc' | 'desc';
  }): Promise<{ reservations: Reservation[]; total: number }> {
    const { keyword, tags, apartmentId, roomId, order = 'desc', page = 1, limit = 10 } = params || {};
    const col = collection(db, RESERVATION_COLLECTION);
    // Firestore free-text filtering is limited; fetch and filter in memory.
    const snapshot = await getDocs(col);
    let items = snapshot.docs
      .map((d) => ({ ...(d.data() as Omit<Reservation, 'id'>), id: d.id }))
      .sort((a, b) => {
        const aT = new Date(a.createdAt || 0).getTime();
        const bT = new Date(b.createdAt || 0).getTime();
        return order === 'asc' ? aT - bT : bT - aT;
      });

    if (apartmentId) items = items.filter((r) => r.apartmentId === apartmentId);
    if (roomId) items = items.filter((r) => r.roomId === roomId);
    if (keyword) {
      const k = keyword.toLowerCase();
      items = items.filter(
        (r) =>
          r.guest?.name?.toLowerCase().includes(k) ||
          r.guest?.email?.toLowerCase().includes(k) ||
          r.guest?.phone?.toLowerCase().includes(k) ||
          r.notes?.toLowerCase().includes(k)
      );
    }
    if (tags && tags.length) {
      items = items.filter((r) => (r.tags || []).some((t) => tags.includes(t)));
    }

    const total = items.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const reservations = items.slice(start, end);
    return { reservations, total };
  }

  static async getById(id: string): Promise<Reservation | null> {
    const ref = doc(db, RESERVATION_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { ...(snap.data() as Omit<Reservation, 'id'>), id: snap.id };
  }

  static async create(payload: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: Reservation['status'] }): Promise<Reservation> {
    const col = collection(db, RESERVATION_COLLECTION);
    const now = nowISO();
    const data: Omit<Reservation, 'id'> = {
      ...payload,
      status: payload.status || 'pending',
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(col, data as any);
    return { ...data, id: docRef.id } as Reservation;
  }

  static async update(id: string, patch: Partial<Reservation>): Promise<Reservation | null> {
    const ref = doc(db, RESERVATION_COLLECTION, id);
    const existing = await getDoc(ref);
    if (!existing.exists()) return null;
    const next: Partial<Reservation> = { ...patch, updatedAt: nowISO() };
    await updateDoc(ref, next as any);
    const updated = await getDoc(ref);
    return { ...(updated.data() as Omit<Reservation, 'id'>), id: updated.id };
  }

  static async delete(id: string): Promise<boolean> {
    const ref = doc(db, RESERVATION_COLLECTION, id);
    await deleteDoc(ref);
    return true;
  }

  static async checkAvailability(params: {
    apartmentId?: string;
    roomId?: string;
    checkIn: string;
    checkOut: string;
  }): Promise<{ available: boolean; conflicts: Reservation[] }> {
    const { apartmentId, roomId, checkIn, checkOut } = params;
    // fetch all reservations and filter by apartment/room
    const col = collection(db, RESERVATION_COLLECTION);
    const snapshot = await getDocs(col);
    const all = snapshot.docs.map((d) => ({ ...(d.data() as Omit<Reservation, 'id'>), id: d.id }));
    const scoped = all.filter((r) => {
      if (roomId) return r.roomId === roomId;
      if (apartmentId) return r.apartmentId === apartmentId;
      return true;
    });

    const conflicts = scoped.filter((r) => overlaps(r.checkIn, r.checkOut, checkIn, checkOut));
    const available = conflicts.length === 0;
    return { available, conflicts };
  }
}