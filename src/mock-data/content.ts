import { Content } from '@/models/content';

const content: Content = {
  siteContent: {
    home: {
      section1: {
        title: '',
        body: '',
      },
    },
    about: {
      section1: {
        title: '',
        body: ''
      },
    },
    terms: {
      section1: {
        title: 'Terms and Conditions',
        body: 'These terms and conditions outline the rules and regulations for the use of our website.',
      },
      section2: {
        title: '',
        body: '',
      },
    },
    privacyPolicy: {
      section1: {
        title: 'Privacy Policy',
        body: 'This privacy policy explains how we collect, use, and protect your personal information.',
        overline: 'Data Protection',
      },
      section2: {
        title: '',
        body: '',
      },
    },
    cookiePolicy: {
      section1: {
        title: 'Cookie Policy',
        body: 'This policy explains how we use cookies and similar technologies on our website.',
        overline: 'Cookie Information',
      },
      section2: {
        title: '',
        body: '',
      },
    },
  },
  systemSettings: {
    siteLogo: '/images/presidentialserviceapartment.png',
    siteIcon: '/images/presidentialserviceapartment-icon.png',
    siteName: 'Presidential Service Apartment',
    siteUrl: 'https://presidentialserviceapartments.ng',
    siteSlogan: 'A SLICE OF PARADISE',
    siteGraphImage: 'https://presidentialserviceapartments.ng/images/og-image.jpg',
    siteKeywords: [
      'serviced apartments',
      'luxury apartments',
      'short let',
      'Port Harcourt',
      'Nigeria',
      'holiday rentals',
      'business travel',
      'accommodation',
      'apartment hotel',
      'Presidential Service Apartment',
    ],
    siteDescription:
      'Experience premium short-let and long-stay serviced apartments in Port Harcourt, Nigeria. Fully furnished units with hotel-style amenities, 24/7 security, and concierge.',
    siteAuthor: 'Presidential Service Apartment Limited',
    siteLocale: 'en_NG',
    siteType: 'website',
    ogTitle:
      'Presidential Service Apartment | Luxury Serviced Apartments in Port Harcourt',
    ogDescription:
      'Discover luxury serviced apartments and short lets in Port Harcourt with modern finishes, reliable power, high-speed internet, and exceptional service.',
    ogImage: 'https://presidentialserviceapartments.ng/images/og-image.jpg',
    ogImageAlt: 'Presidential Service Apartment — exterior view and brand mark',
    twitterCard: 'summary_large_image',
    twitterSite: '@presidentialserviceapartment',
    twitterCreator: '@presidentialserviceapartment',
    twitterTitle: 'Presidential service apartments PH',
    twitterDescription:
      'Luxury serviced apartments and short lets in Port Harcourt, Nigeria. Fully furnished, secure, and designed for comfort.',
    twitterImage: 'https://presidentialserviceapartments.ng/images/og-image.jpg',
    maintenanceMode: false,
    headerLinks: [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'About',
        href: '/about',
      },
      {
        label: 'Apartments',
        href: '/apartments',
        dropdown: [],
      },
      {
        label: 'Blog',
        href: '/blog',
      },
      {
        label: 'Contact',
        href: '/contact',
        isButton:true
      },
      {
        label: 'Search',
        href: '/apartments',
        isButton:true
      }
    ],
    footerLinks: [
      {
        section: 'Company',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Apartments', href: '/apartments' },
          { label: 'About', href: '/about' },
          { label: 'Blog', href: '/blog' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        section: 'Legal',
        links: [
          { label: 'Terms', href: '/terms-of-service' },
          { label: 'Privacy Policy', href: '/privacy-policy' },
          { label: 'Cookie Policy', href: '/cookie-policy' },
        ],
      },
      {
        section: 'Help',
        links: [
          { label: 'Chat on WhatsApp', href: 'https://wa.me/9066907729', target: '_blank' },
          { label: 'Email Support', href: 'mailto:info@presidentialserviceapartments.ng', target: '_blank' },
        ],
      },
    ],
    socialLinks: [
      {
        label: 'Facebook',
        icon: 'facebook',
        href: 'https://facebook.com/presidentialapartments',
      },
      {
        label: 'Instagram',
        icon: 'instagram',
        href: 'https://www.instagram.com/presidentialapartments?igsh=aDdrNzI2czF1NGph',
      },
      {
        label: 'Tiktok',
        icon: 'tiktok',
        href: 'https://www.tiktok.com/@presidential.service?_r=1&_t=ZS-91AsgzxfRsv ',
      },
      {
        label: 'Whatsapp',
        icon: 'whatsapp',
        href: 'https://wa.me/447459725394',
      },
    ],
    contact: {
      email: 'info@presidentialserviceapartments.ng',
      phones: [
        '+2348066907729',
      ],
      addresses: [
        {
          country: 'Nigeria',
          phone: '+2348066907729',
          address: 'No. 4, Sam B, Plot 493 Aka Street, Eagle Island, Port Harcourt, Nigeria',
        },
      ],
      whatsappPhone: '+2348066907729',
      map: '',
    },
  },
};

export default content;
