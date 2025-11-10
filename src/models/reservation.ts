export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface ReservationGuest {
  name: string;
  email?: string;
  phone?: string;
}

export interface Reservation {
  id: string;
  apartmentId: string;
  roomId?: string;
  guest: ReservationGuest;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  guestsCount?: number;
  notes?: string;
  status: ReservationStatus;
  totalAmount?: number;
  currency?: string; // e.g., NGN
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}