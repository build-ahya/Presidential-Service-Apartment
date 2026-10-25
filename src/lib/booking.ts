import { differenceInCalendarDays, format, parseISO, isValid } from 'date-fns';
import type { Apartment } from '@/models/apartment';

export interface SearchState {
  propertyId?: string;
  checkIn?: string; // yyyy-MM-dd
  checkOut?: string; // yyyy-MM-dd
  adults: number;
  children: number;
}

export const DATE_FMT = 'yyyy-MM-dd';
export const toDateString = (d: Date) => format(d, DATE_FMT);
export const fromDateString = (s?: string) => {
  if (!s) return undefined;
  const d = parseISO(s);
  return isValid(d) ? d : undefined;
};

type RawParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseSearch(params: RawParams | URLSearchParams): SearchState {
  const get = (k: string) =>
    params instanceof URLSearchParams ? params.get(k) ?? undefined : first(params[k]);
  const checkIn = fromDateString(get('checkIn')) ? get('checkIn') : undefined;
  const checkOut = fromDateString(get('checkOut')) ? get('checkOut') : undefined;
  return {
    propertyId: get('propertyId') || undefined,
    checkIn,
    checkOut: checkIn && checkOut && checkOut > checkIn ? checkOut : undefined,
    adults: Math.max(1, Number(get('adults')) || 2),
    children: Math.max(0, Number(get('children')) || 0),
  };
}

export function searchToQuery(s: Partial<SearchState>) {
  const q = new URLSearchParams();
  if (s.propertyId) q.set('propertyId', s.propertyId);
  if (s.checkIn) q.set('checkIn', s.checkIn);
  if (s.checkOut) q.set('checkOut', s.checkOut);
  if (s.adults) q.set('adults', String(s.adults));
  if (s.children) q.set('children', String(s.children));
  return q.toString();
}

export const nightsBetween = (checkIn?: string, checkOut?: string) => {
  const a = fromDateString(checkIn);
  const b = fromDateString(checkOut);
  return a && b ? Math.max(0, differenceInCalendarDays(b, a)) : 0;
};

export function formatMoney(amount: number, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function priceFor(apartment: Apartment, nights: number) {
  const { baseRate, cleaningFee = 0 } = apartment.rate;
  const subtotal = baseRate * nights;
  return { nights, baseRate, subtotal, cleaningFee, total: subtotal + cleaningFee };
}

export const formatDay = (s?: string, pattern = 'EEE, d MMM') => {
  const d = fromDateString(s);
  return d ? format(d, pattern) : '';
};

export const guestLabel = (adults: number, children: number) => {
  const total = adults + children;
  return `${total} guest${total === 1 ? '' : 's'}`;
};
