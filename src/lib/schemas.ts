import { z } from 'zod';

export const mediaSchema = z.object({
  url: z.string().min(1),
  alt: z.string().default(''),
  type: z.enum(['image', 'video']).default('image'),
  caption: z.string().optional(),
  width: z.number().default(0),
  height: z.number().default(0),
});

export const emptyMedia = { url: '', alt: '', type: 'image' as const, width: 0, height: 0 };

const strings = z.array(z.string()).default([]);

const locationSchema = z.object({
  address: z.object({
    street: z.string().optional(),
    area: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  mapUrl: z.string().optional(),
});

const policySchema = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  minStayNights: z.number().optional(),
  maxStayNights: z.number().optional(),
  smoking: z.boolean().optional(),
  pets: z.boolean().optional(),
  children: z.boolean().optional(),
  cancellation: z.string().optional(),
  houseRules: strings.optional(),
});

export const propertySchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  slug: z.string().trim().default(''),
  status: z.enum(['published', 'draft']).default('draft'),
  summary: z.string().default(''),
  description: z.string().default(''),
  location: locationSchema,
  amenities: strings,
  featuredMedia: mediaSchema.or(z.object({ url: z.literal('') }).transform(() => emptyMedia)),
  gallery: z.array(mediaSchema).default([]),
  contact: z
    .object({
      phone: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
  policies: policySchema.optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().optional(),
  tags: strings,
  sortOrder: z.number().optional(),
});

export const roomSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  capacity: z.number().optional(),
  bedType: z.string().optional(),
  ensuite: z.boolean().optional(),
  amenities: strings.optional(),
  media: z.array(mediaSchema).default([]),
});

export const apartmentSchema = z.object({
  propertyId: z.string().min(1, 'Choose a property'),
  name: z.string().trim().min(2, 'Name is required'),
  slug: z.string().trim().default(''),
  status: z.enum(['published', 'draft']).default('draft'),
  summary: z.string().default(''),
  description: z.string().default(''),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  maxGuests: z.number().int().min(1),
  sizeSqm: z.number().optional(),
  floor: z.string().optional(),
  rooms: z.array(roomSchema).default([]),
  amenities: strings,
  featuredMedia: mediaSchema.or(z.object({ url: z.literal('') }).transform(() => emptyMedia)),
  gallery: z.array(mediaSchema).default([]),
  rate: z.object({
    currency: z.string().min(1).default('NGN'),
    baseRate: z.number().min(0, 'Enter the nightly rate'),
    cleaningFee: z.number().min(0).optional(),
    securityDeposit: z.number().min(0).optional(),
    taxesIncluded: z.boolean().optional(),
  }),
  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().optional(),
  tags: strings,
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const reservationRequestSchema = z.object({
  apartmentId: z.string().min(1, 'Apartment is required'),
  checkIn: z.string().min(1, 'Check-in is required'),
  checkOut: z.string().min(1, 'Check-out is required'),
  guestsCount: z.coerce.number().int().min(1).default(1),
  name: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().pipe(z.email('Valid email required')),
  phone: z.string().trim().min(7, 'Valid phone required'),
  notes: z.string().max(2000).optional(),
});

export const reservationPatchSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  notes: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guestsCount: z.number().optional(),
  totalAmount: z.number().optional(),
});

export const userCreateSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().pipe(z.email()),
  password: z.string().min(8, 'Use at least 8 characters'),
  role: z.enum(['admin', 'manager']),
});

export const userPatchSchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  role: z.enum(['admin', 'manager']).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8, 'Use at least 8 characters').optional(),
});


export const postSchema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  slug: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  category: z.object({ id: z.string(), name: z.string(), slug: z.string(), description: z.string().optional() }).optional(),
  tags: z.array(z.object({ id: z.string(), name: z.string(), slug: z.string().optional() })).optional(),
  featuredMedia: mediaSchema.optional(),
  status: z.enum(['draft', 'published', 'archived', 'scheduled']).optional(),
  isFeatured: z.boolean().optional(),
});

