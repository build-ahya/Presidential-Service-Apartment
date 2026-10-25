import type { Item, Section } from '@/models/content';

/** Describes which fields the admin shows for a CMS section. */
export type SectionField =
  | 'overline'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'image'
  | 'images'
  | 'video'
  | 'buttons';

export type ItemField = keyof Pick<
  Item,
  'title' | 'subtitle' | 'body' | 'image' | 'icon' | 'href'
>;

export interface SectionSchema {
  key: string;
  label: string;
  hint?: string;
  fields: SectionField[];
  /** `html` bodies get a rich-text-friendly (HTML) editor. */
  bodyFormat?: 'text' | 'html';
  labels?: Partial<Record<SectionField, string>>;
  items?: {
    singular: string;
    fields: ItemField[];
    labels?: Partial<Record<ItemField, string>>;
  };
}

export interface PageSchema {
  key: string;
  label: string;
  path: string;
  description: string;
  sections: SectionSchema[];
}

export const ICON_OPTIONS = [
  'zap',
  'shield',
  'wifi',
  'plane',
  'sparkles',
  'utensils',
  'car',
  'shirt',
  'bed',
  'tv',
  'snowflake',
  'concierge',
  'key',
  'map',
  'clock',
] as const;

export const CONTENT_SCHEMA: PageSchema[] = [
  {
    key: 'home',
    label: 'Home page',
    path: '/',
    description: 'Hero, highlights, stats, video, FAQs, testimonials and calls to action.',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        hint: 'The first screen. The search bar is added automatically.',
        fields: ['overline', 'title', 'subtitle', 'image'],
        labels: { image: 'Background image' },
      },
      {
        key: 'apartments',
        label: 'Featured apartments',
        hint: 'Heading above the apartment cards (cards are pulled from Apartments).',
        fields: ['overline', 'title', 'subtitle', 'buttons'],
      },
      {
        key: 'highlights',
        label: 'Why stay with us',
        fields: ['overline', 'title', 'subtitle'],
        items: {
          singular: 'highlight',
          fields: ['icon', 'title', 'body'],
        },
      },
      {
        key: 'about',
        label: 'Introduction',
        fields: ['overline', 'title', 'body', 'images', 'buttons'],
        bodyFormat: 'text',
      },
      {
        key: 'stats',
        label: 'Numbers',
        fields: ['overline', 'title', 'subtitle'],
        items: {
          singular: 'stat',
          fields: ['title', 'subtitle', 'body'],
          labels: { title: 'Value (e.g. 24/7)', subtitle: 'Label', body: 'Description' },
        },
      },
      {
        key: 'video',
        label: 'Video',
        fields: ['title', 'subtitle', 'video'],
        labels: { video: 'YouTube or video URL' },
      },
      {
        key: 'testimonials',
        label: 'Testimonials',
        fields: ['title', 'subtitle'],
        items: {
          singular: 'testimonial',
          fields: ['title', 'subtitle', 'body'],
          labels: { title: 'Guest name', subtitle: 'Role / stay type', body: 'Quote' },
        },
      },
      {
        key: 'faqs',
        label: 'FAQs',
        hint: 'Also shown on the About page.',
        fields: ['title', 'subtitle'],
        items: {
          singular: 'question',
          fields: ['title', 'body'],
          labels: { title: 'Question', body: 'Answer' },
        },
      },
      {
        key: 'blog',
        label: 'Blog preview',
        fields: ['title', 'subtitle'],
      },
      {
        key: 'cta',
        label: 'Final call to action',
        fields: ['title', 'body', 'buttons'],
      },
    ],
  },
  {
    key: 'about',
    label: 'About page',
    path: '/about',
    description: 'Story, signature comforts, facilities and the leadership quote.',
    sections: [
      {
        key: 'hero',
        label: 'Introduction',
        fields: ['overline', 'title', 'subtitle', 'body', 'image', 'buttons'],
        bodyFormat: 'text',
      },
      {
        key: 'comforts',
        label: 'Signature comforts',
        fields: ['title', 'subtitle', 'image'],
        items: { singular: 'comfort', fields: ['title'] },
      },
      {
        key: 'facilities',
        label: 'Facilities',
        fields: ['title'],
        items: { singular: 'facility', fields: ['title'] },
      },
      {
        key: 'quote',
        label: 'Leadership quote',
        fields: ['body', 'title', 'subtitle', 'image'],
        labels: { body: 'Quote', title: 'Name / role', subtitle: 'Company' },
      },
      {
        key: 'cta',
        label: 'Call to action',
        fields: ['title', 'body', 'buttons'],
      },
    ],
  },
  {
    key: 'contact',
    label: 'Contact page',
    path: '/contact',
    description: 'Page headings and FAQs. Phone, email and address live in Settings.',
    sections: [
      {
        key: 'hero',
        label: 'Heading',
        fields: ['overline', 'title', 'body'],
      },
      {
        key: 'faqs',
        label: 'FAQs',
        fields: ['title', 'subtitle'],
        items: {
          singular: 'question',
          fields: ['title', 'body'],
          labels: { title: 'Question', body: 'Answer' },
        },
      },
    ],
  },
  {
    key: 'terms',
    label: 'Terms of service',
    path: '/terms-of-service',
    description: 'Legal page.',
    sections: [
      {
        key: 'main',
        label: 'Content',
        fields: ['overline', 'title', 'subtitle', 'body'],
        bodyFormat: 'html',
      },
    ],
  },
  {
    key: 'privacyPolicy',
    label: 'Privacy policy',
    path: '/privacy-policy',
    description: 'Legal page.',
    sections: [
      {
        key: 'main',
        label: 'Content',
        fields: ['overline', 'title', 'subtitle', 'body'],
        bodyFormat: 'html',
      },
    ],
  },
  {
    key: 'cookiePolicy',
    label: 'Cookie policy',
    path: '/cookie-policy',
    description: 'Legal page.',
    sections: [
      {
        key: 'main',
        label: 'Content',
        fields: ['overline', 'title', 'subtitle', 'body'],
        bodyFormat: 'html',
      },
    ],
  },
];

export const emptySection = (): Section => ({ title: '', body: '' });
