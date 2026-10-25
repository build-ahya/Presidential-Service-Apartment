import 'server-only';
import { collections } from '@/lib/firebase-admin';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { Reservation, ReservationStatus } from '@/models/reservation';
import { CatalogService } from './catalog.service';

const nowISO = () => new Date().toISOString();

/** Check-out day is free for the next guest, so ranges overlap only when they truly intersect. */
function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return (
    new Date(aStart).getTime() < new Date(bEnd).getTime() &&
    new Date(bStart).getTime() < new Date(aEnd).getTime()
  );
}

const BLOCKING: ReservationStatus[] = ['confirmed'];

export interface ReservationInput {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guestsCount?: number;
  guest: Reservation['guest'];
  notes?: string;
}

export class ReservationService {
  static async list(
    params: {
      page?: number;
      limit?: number;
      keyword?: string;
      status?: ReservationStatus;
      apartmentId?: string;
      propertyId?: string;
    } = {}
  ) {
    const { keyword, status, apartmentId, propertyId, page = 1, limit = 20 } = params;
    const snap = await collections.reservations().get();
    let items = snap.docs
      .map((d) => ({ ...(d.data() as Reservation), id: d.id }))
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

    if (status) items = items.filter((r) => r.status === status);
    if (apartmentId) items = items.filter((r) => r.apartmentId === apartmentId);
    if (propertyId) items = items.filter((r) => r.propertyId === propertyId);
    if (keyword) {
      const k = keyword.toLowerCase();
      items = items.filter((r) =>
        [r.guest?.name, r.guest?.email, r.guest?.phone, r.notes].some((v) =>
          v?.toLowerCase().includes(k)
        )
      );
    }
    const total = items.length;
    return {
      reservations: items.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  static async getById(id: string): Promise<Reservation | null> {
    const snap = await collections.reservations().doc(id).get();
    return snap.exists ? { ...(snap.data() as Reservation), id: snap.id } : null;
  }

  /** Public booking request. Price is always computed on the server. */
  static async create(input: ReservationInput): Promise<Reservation> {
    const apartment = await CatalogService.getApartmentById(input.apartmentId);
    if (!apartment || apartment.status === 'draft') throw new Error('Apartment not found');

    const nights = differenceInCalendarDays(parseISO(input.checkOut), parseISO(input.checkIn));
    if (!Number.isFinite(nights) || nights < 1) throw new Error('Check-out must be after check-in');
    if (input.guestsCount && input.guestsCount > apartment.maxGuests) {
      throw new Error(`This apartment sleeps up to ${apartment.maxGuests} guests`);
    }

    const { available } = await this.checkAvailability({
      apartmentId: apartment.id,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
    });
    if (!available) throw new Error('These dates are no longer available');

    const { baseRate, cleaningFee = 0, currency } = apartment.rate;
    const now = nowISO();
    const ref = collections.reservations().doc();
    const data: Reservation = {
      id: ref.id,
      propertyId: apartment.propertyId,
      apartmentId: apartment.id,
      guest: input.guest,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      nights,
      guestsCount: input.guestsCount,
      notes: input.notes,
      status: 'pending',
      totalAmount: baseRate * nights + cleaningFee,
      currency,
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(data);
    return data;
  }

  static async update(id: string, patch: Partial<Reservation>) {
    const ref = collections.reservations().doc(id);
    if (!(await ref.get()).exists) return null;
    const { id: _id, createdAt: _c, ...safe } = patch;
    await ref.update({ ...safe, updatedAt: nowISO() });
    return this.getById(id);
  }

  static async delete(id: string) {
    await collections.reservations().doc(id).delete();
  }

  /**
   * Confirmed reservations block dates. Legacy reservations that were made against
   * the whole property (no apartmentId) block every unit in that property.
   */
  static async checkAvailability(params: {
    apartmentId: string;
    checkIn: string;
    checkOut: string;
  }) {
    const conflicts = (await this.blockingFor(params.checkIn, params.checkOut)).filter(
      (r) => r.apartmentId === params.apartmentId
    );
    return { available: conflicts.length === 0, conflicts };
  }

  /** Ids of apartments that are free for the whole range. */
  static async availableApartmentIds(params: {
    propertyId?: string;
    checkIn: string;
    checkOut: string;
  }) {
    const [apartments, blocking] = await Promise.all([
      CatalogService.getApartments({ propertyId: params.propertyId }),
      this.blockingFor(params.checkIn, params.checkOut),
    ]);
    return apartments
      .filter(
        (a) =>
          !blocking.some(
            (r) =>
              r.apartmentId === a.id ||
              (!r.apartmentId && (!r.propertyId || r.propertyId === a.propertyId))
          )
      )
      .map((a) => a.id);
  }

  private static async blockingFor(checkIn: string, checkOut: string) {
    const snap = await collections.reservations().where('status', 'in', BLOCKING).get();
    return snap.docs
      .map((d) => ({ ...(d.data() as Reservation), id: d.id }))
      .filter((r) => overlaps(r.checkIn, r.checkOut, checkIn, checkOut));
  }
}
