import { Media } from './media';
import type { PublishStatus } from './property';

export type {
  Address,
  ContactInfo,
  GeoCoordinates,
  Location,
  Policy,
} from './property';

export interface Rate {
  currency: string;
  /** Nightly price. */
  baseRate: number;
  cleaningFee?: number;
  securityDeposit?: number;
  taxesIncluded?: boolean;
}

/** A bedroom inside an apartment. */
export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  bedType?: string;
  ensuite?: boolean;
  amenities?: string[];
  media: Media[];
}

/** A bookable unit that belongs to a property. */
export interface Apartment {
  id: string;
  propertyId: string;
  name: string;
  slug: string;
  status: PublishStatus;
  summary: string;
  description: string; // HTML CONTENT
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sizeSqm?: number;
  floor?: string;
  rooms: Room[];
  amenities?: string[];
  featuredMedia: Media;
  gallery?: Media[];
  rate: Rate;
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  featured?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ApartmentInput = Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>;
