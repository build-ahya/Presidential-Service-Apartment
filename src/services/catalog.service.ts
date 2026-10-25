import 'server-only';
import { collections } from '@/lib/firebase-admin';
import { bust, cached, TAGS } from '@/lib/cache';
import { slugify } from '@/lib/api';
import type { Apartment, ApartmentInput } from '@/models/apartment';
import type { Property, PropertyInput } from '@/models/property';

const bySort = <T extends { sortOrder?: number; name: string }>(a: T, b: T) =>
  (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || a.name.localeCompare(b.name);

const now = () => new Date().toISOString();

const readProperties = async (): Promise<Property[]> => {
  const snap = await collections.properties().get();
  return snap.docs.map((d) => ({ ...(d.data() as Property), id: d.id })).sort(bySort);
};

const readApartments = async (): Promise<Apartment[]> => {
  const snap = await collections.apartments().get();
  return snap.docs.map((d) => ({ ...(d.data() as Apartment), id: d.id })).sort(bySort);
};

const allProperties = cached(readProperties, 'properties', TAGS.catalog);
const allApartments = cached(readApartments, 'apartments', TAGS.catalog);

/** Public (published) catalog or everything for the admin. */
export class CatalogService {
  static async getProperties(opts: { includeDrafts?: boolean } = {}) {
    const items = opts.includeDrafts ? await readProperties() : await allProperties();
    return opts.includeDrafts ? items : items.filter((p) => p.status !== 'draft');
  }

  static async getApartments(
    opts: { includeDrafts?: boolean; propertyId?: string } = {}
  ) {
    let items = opts.includeDrafts ? await readApartments() : await allApartments();
    if (!opts.includeDrafts) items = items.filter((a) => a.status !== 'draft');
    if (opts.propertyId) items = items.filter((a) => a.propertyId === opts.propertyId);
    return items;
  }

  static async getPropertyById(id: string) {
    const snap = await collections.properties().doc(id).get();
    return snap.exists ? ({ ...(snap.data() as Property), id: snap.id }) : null;
  }

  static async getApartmentById(id: string) {
    const snap = await collections.apartments().doc(id).get();
    return snap.exists ? ({ ...(snap.data() as Apartment), id: snap.id }) : null;
  }

  static async getApartmentBySlug(slug: string) {
    const items = await this.getApartments();
    return items.find((a) => a.slug === slug) ?? null;
  }

  static async getPropertyBySlug(slug: string) {
    const items = await this.getProperties();
    return items.find((p) => p.slug === slug) ?? null;
  }

  // ---- properties ----------------------------------------------------------

  static async createProperty(input: PropertyInput): Promise<Property> {
    const slug = slugify(input.slug || input.name);
    const existing = await collections.properties().where('slug', '==', slug).limit(1).get();
    if (!existing.empty) throw new Error('A property with this slug already exists');

    const ref = collections.properties().doc();
    const data: Property = { ...input, slug, id: ref.id, createdAt: now(), updatedAt: now() };
    await ref.set(data);
    bust(TAGS.catalog);
    return data;
  }

  static async updateProperty(id: string, patch: Partial<PropertyInput>) {
    const ref = collections.properties().doc(id);
    if (!(await ref.get()).exists) return null;
    if (patch.slug) patch.slug = slugify(patch.slug);
    await ref.update({ ...patch, updatedAt: now() });
    bust(TAGS.catalog);
    return this.getPropertyById(id);
  }

  static async deleteProperty(id: string) {
    const units = await collections.apartments().where('propertyId', '==', id).limit(1).get();
    if (!units.empty) throw new Error('Delete or move this property’s apartments first');
    await collections.properties().doc(id).delete();
    bust(TAGS.catalog);
  }

  // ---- apartments ----------------------------------------------------------

  static async createApartment(input: ApartmentInput): Promise<Apartment> {
    const slug = slugify(input.slug || input.name);
    const existing = await collections.apartments().where('slug', '==', slug).limit(1).get();
    if (!existing.empty) throw new Error('An apartment with this slug already exists');
    if (!(await this.getPropertyById(input.propertyId))) throw new Error('Property not found');

    const ref = collections.apartments().doc();
    const data: Apartment = { ...input, slug, id: ref.id, createdAt: now(), updatedAt: now() };
    await ref.set(data);
    bust(TAGS.catalog);
    return data;
  }

  static async updateApartment(id: string, patch: Partial<ApartmentInput>) {
    const ref = collections.apartments().doc(id);
    if (!(await ref.get()).exists) return null;
    if (patch.slug) {
      patch.slug = slugify(patch.slug);
      const clash = await collections.apartments().where('slug', '==', patch.slug).get();
      if (clash.docs.some((d) => d.id !== id)) throw new Error('An apartment with this slug already exists');
    }
    await ref.update({ ...patch, updatedAt: now() });
    bust(TAGS.catalog);
    return this.getApartmentById(id);
  }

  static async deleteApartment(id: string) {
    await collections.apartments().doc(id).delete();
    bust(TAGS.catalog);
  }
}
