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

export type PublishStatus = 'published' | 'draft';

/**
 * A property is a building / location that owns several apartments
 * (e.g. "Presidential Service Apartment PH").
 */
export interface Property {
  id: string;
  name: string;
  slug: string;
  status: PublishStatus;
  summary: string;
  description: string; // HTML CONTENT
  location: Location;
  amenities?: string[];
  featuredMedia: Media;
  gallery?: Media[];
  contact?: ContactInfo;
  policies?: Policy;
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type PropertyInput = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;
