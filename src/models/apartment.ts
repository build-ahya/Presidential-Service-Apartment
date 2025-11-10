import { Media } from './media';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street?: string;
  area?: string;
  city: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface Location {
  address: Address;
  coordinates?: GeoCoordinates;
  mapUrl?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

export interface Policy {
  checkIn?: string;
  checkOut?: string;
  minStayNights?: number;
  maxStayNights?: number;
  smoking?: boolean;
  pets?: boolean;
  children?: boolean;
  cancellation?: string;
  houseRules?: string[];
}

export interface Rate {
  currency?: string;
  basePricePerNight?: number;
  cleaningFee?: number;
  securityDeposit?: number;
  taxesIncluded?: boolean;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  bedType?: string;
  pricePerNight?: number;
  amenities?: string[];
  media: Media[];
}

export interface Apartment {
  id: string;
  name: string;
  slug: string;
  location: Location;
  summary: string;
  description: string; // HTML CONTENT
  rooms: Room[];
  amenities?: string[];
  featuredMedia: Media;
  gallery?: Media[];
  rating?: number;
  reviewsCount?: number;
  contact?: ContactInfo;
  policies?: Policy;
  rate?: Rate;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}