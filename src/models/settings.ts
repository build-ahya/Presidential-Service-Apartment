export interface Link {
  label: string;
  href: string;
  icon?: string;
  target?: string;
  isButton?: boolean;
  dropdown?: Link[];
}

export interface LinkSection {
  section: string;
  links: Link[];
}

export interface ContactInfo {
  email: string;
  phones: string[];
  whatsappPhone: string;
  addresses: { country: string; phone: string; address: string }[];
  map: string;
}

export interface SystemSettings {
  siteName: string;
  siteLogo: string;
  siteIcon: string;
  siteUrl: string;
  siteSlogan: string;
  siteGraphImage: string;
  siteKeywords: string[];
  siteDescription: string;
  siteAuthor: string;
  siteLocale: string;
  siteType: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  maintenanceMode: boolean;
  headerLinks: Link[];
  footerLinks: LinkSection[];
  socialLinks: Link[];
  contact: ContactInfo;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export interface UserSettings {
  locale: string;
  country?: string;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  boarded: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
