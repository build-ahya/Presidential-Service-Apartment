import { HTMLAttributeAnchorTarget } from 'react';
import { SystemSettings } from './settings';

export interface Content {
  systemSettings: SystemSettings;
  siteContent: SiteContent;
}

export interface SiteContent {
  [field: string]: {
    // home, about, contact, etc.
    [field: string]: Section; // section1, section2, etc.
  };
}

export interface Button {
  title: string;
  href: string;
  icon?: string;
  target?: HTMLAttributeAnchorTarget;
}

export interface Item {
  title: string;
  subtitle?: string;
  body: string;
  image?: string;
  video?: string;
  thumbnail?: string;
  href?: string;
  button?: Button;
  buttons?: Button[];
}

export interface Section {
  title: string;
  subtitle?: string;
  overline?: string;
  body: string;
  image?: string;
  images?: string[];
  video?: string;
  videos?: string[];
  background?: string;
  button?: Button;
  buttons?: Button[];
  items?: Item[]; // Carousels or List items
}