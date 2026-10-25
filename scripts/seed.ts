/**
 * Idempotent data migration + seed.
 *
 *   npm run seed            # dry run: prints what would change
 *   npm run seed -- --apply # writes to Firestore
 *
 * 1. Turns the legacy single "apartment" document (which actually described the whole
 *    building and carried the three units as `rooms`) into a Property.
 * 2. Creates one Apartment per legacy room (2 bed / 2 bath) using the photos already
 *    uploaded for it.
 * 3. Links existing reservations to the property.
 * 4. Moves the legacy document into `apartments_legacy_backup` so nothing is lost.
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const APPLY = process.argv.includes('--apply');
const ROOT = (process.env.ROOT_DATABASE_COLLECTION || 'websites/presidentialserviceapartments.ng').split('#')[0].trim();

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
const root = db.doc(ROOT);

const PROPERTY_ID = 'presidential-service-apartment-ph';
const now = new Date().toISOString();
const log = (...a: unknown[]) => console.log(APPLY ? '[apply]' : '[dry-run]', ...a);

type Media = { url: string; alt: string; type: 'image' | 'video'; width: number; height: number; caption?: string };
interface LegacyRoom {
  id: string;
  name: string;
  bedType?: string;
  capacity?: number;
  media?: Media[];
}

const COMMON_AMENITIES = [
  'Air conditioning in every room',
  'Fully equipped kitchen with utensils',
  'High-speed fibre optic Wi-Fi',
  '24/7 electricity',
  'Flat-screen LED TV',
  'In-house laundry service',
  'Daily housekeeping',
  '24/7 security',
  'Secure parking',
  'Concierge support',
];

const UNITS: Record<string, { name: string; slug: string; floor?: string; summary: string; sort: number; featured: boolean; extra: string[] }> = {
  '11b': {
    name: 'Apartment 11B',
    slug: 'apartment-11b',
    sort: 1,
    featured: true,
    summary: 'A fully furnished two-bedroom, two-bathroom apartment, built for comfortable short and long stays.',
    extra: [],
  },
  '22a': {
    name: 'Apartment 22A',
    slug: 'apartment-22a',
    sort: 2,
    featured: true,
    summary: 'A fully furnished two-bedroom, two-bathroom apartment, ideal for business travellers and families.',
    extra: [],
  },
  'ground-floor': {
    name: 'Ground Floor Apartment',
    slug: 'ground-floor-apartment',
    floor: 'Ground floor',
    sort: 3,
    featured: true,
    summary: 'A fully furnished ground-floor two-bedroom, two-bathroom apartment — a good fit for guests who prefer to avoid stairs.',
    extra: [],
  },
};

function unitKey(room: LegacyRoom) {
  const s = `${room.id} ${room.name}`.toLowerCase();
  if (s.includes('11b')) return '11b';
  if (s.includes('22a')) return '22a';
  if (s.includes('ground')) return 'ground-floor';
  return null;
}

const description = (name: string, floor?: string) =>
  `<p>${name} is a fully furnished two-bedroom, two-bathroom serviced apartment at Presidential Service Apartments, Eagle Island, Port Harcourt${floor ? ` (${floor.toLowerCase()})` : ''}.</p>` +
  `<h3>What you get</h3><ul><li>Two comfortable bedrooms</li><li>Two bathrooms</li><li>Living and dining area with a flat-screen LED TV</li><li>Fully equipped kitchen with utensils</li><li>High-speed fibre optic internet and 24-hour electricity</li><li>Daily housekeeping and in-house laundry service</li></ul>` +
  `<p>Stay in the heart of Port Harcourt — just 30 minutes from the airport, with 24/7 security and a concierge on hand.</p>`;

async function main() {
  const aptCol = root.collection('apartments');
  const propCol = root.collection('properties');
  const backupCol = root.collection('apartments_legacy_backup');

  // Source of truth for the legacy building doc: live collection, else the backup.
  const live = await aptCol.get();
  const legacyDocs = live.docs.filter((d) => Array.isArray(d.data().rooms) && !d.data().propertyId);
  let legacy = legacyDocs[0]?.data();
  let legacyId = legacyDocs[0]?.id;
  if (!legacy) {
    const backup = await backupCol.get();
    legacy = backup.docs[0]?.data();
    legacyId = backup.docs[0]?.id;
  }
  if (!legacy) throw new Error('No legacy apartment document found to migrate from.');
  log('legacy building doc:', legacyId, '— rooms:', (legacy.rooms as LegacyRoom[]).length);

  // 1. Property
  const property = {
    id: PROPERTY_ID,
    name: 'Presidential Service Apartment PH',
    slug: PROPERTY_ID,
    status: 'published',
    summary: legacy.summary,
    description: legacy.description,
    location: legacy.location,
    amenities: legacy.amenities ?? [],
    featuredMedia: legacy.featuredMedia,
    gallery: legacy.gallery ?? [],
    contact: { phone: '+2348066907729', email: 'info@presidentialserviceapartments.ng', website: 'https://presidentialserviceapartments.ng' },
    policies: legacy.policies,
    tags: legacy.tags ?? [],
    sortOrder: 1,
    createdAt: legacy.createdAt ?? now,
    updatedAt: now,
  };
  log('property →', property.name);
  if (APPLY) await propCol.doc(PROPERTY_ID).set(property, { merge: true });

  // 2. Apartments from rooms
  const baseRate = (legacy.rate as { basePricePerNight?: number } | undefined)?.basePricePerNight ?? 100000;
  const deposit = (legacy.rate as { securityDeposit?: number } | undefined)?.securityDeposit ?? 50000;
  for (const room of legacy.rooms as LegacyRoom[]) {
    const key = unitKey(room);
    if (!key) {
      log('skipping unrecognised room', room.name);
      continue;
    }
    const u = UNITS[key];
    const photos = (room.media ?? []).filter((m) => m.type === 'image');
    const featured = photos[0] ?? property.featuredMedia;
    const apartment = {
      id: u.slug,
      propertyId: PROPERTY_ID,
      name: u.name,
      slug: u.slug,
      status: 'published',
      summary: u.summary,
      description: description(u.name, u.floor),
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      floor: u.floor,
      rooms: [
        { id: `${u.slug}-master`, name: 'Master bedroom', bedType: 'King', capacity: 2, media: [] },
        { id: `${u.slug}-second`, name: 'Second bedroom', bedType: room.bedType && room.bedType !== 'King' ? room.bedType : 'Queen', capacity: 2, media: [] },
      ],
      amenities: [...COMMON_AMENITIES, ...u.extra],
      featuredMedia: featured,
      gallery: photos,
      rate: { currency: 'NGN', baseRate, cleaningFee: 5000, securityDeposit: deposit, taxesIncluded: true },
      tags: ['serviced apartment', '2 bedroom', 'Port Harcourt'],
      featured: u.featured,
      sortOrder: u.sort,
      createdAt: now,
      updatedAt: now,
    };
    log(`apartment → ${u.name} (${photos.length} photos, ₦${baseRate}/night)`);
    if (APPLY) {
      const ref = aptCol.doc(u.slug);
      // Never overwrite an apartment that already exists — it may have been edited in the admin.
      if ((await ref.get()).exists) {
        log(`  ${u.slug} already exists, left untouched`);
        continue;
      }
      await ref.set(apartment);
    }
  }

  // 3. Reservations → property
  const reservations = await root.collection('reservations').get();
  let linked = 0;
  for (const d of reservations.docs) {
    const r = d.data();
    if (r.propertyId) continue;
    linked += 1;
    if (APPLY) {
      await d.ref.update({
        propertyId: PROPERTY_ID,
        ...(r.apartmentId === legacyId ? { legacyApartmentId: legacyId, apartmentId: FieldValue.delete() } : {}),
      });
    }
  }
  log(`reservations linked to property: ${linked}/${reservations.size}`);

  // 4. Retire the legacy doc
  if (legacyDocs[0]) {
    log('moving legacy doc to apartments_legacy_backup');
    if (APPLY) {
      await backupCol.doc(legacyDocs[0].id).set(legacy);
      await legacyDocs[0].ref.delete();
    }
  }

  if (!APPLY) console.log('\nDry run only. Re-run with `npm run seed -- --apply` to write.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
