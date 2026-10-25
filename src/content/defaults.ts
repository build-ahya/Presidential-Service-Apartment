import type { Content } from '@/models/content';

/** Used for anything the admin has not edited yet. Saved CMS content always wins. */
export const HERO_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/ayha-the-market.firebasestorage.app/o/presidentialserviceapartments.ng%2FOTHERS%2FIMG_6309.jpg?alt=media&token=1cd49059-abb5-4c02-a74d-6298328117d0';

const legal = (title: string, overline: string, body: string) => ({
  main: { overline, title, subtitle: '', body },
});

const defaults: Content = {
  siteContent: {
    home: {
      hero: {
        overline: 'Port Harcourt, Nigeria',
        title: 'A better life starts with the right home',
        subtitle:
          'Fully furnished two-bedroom serviced apartments with hotel-style comfort, 24/7 power and security.',
        body: '',
        image: HERO_IMAGE,
      },
      apartments: {
        overline: 'Our apartments',
        title: 'Discover your next home',
        subtitle:
          'Spacious two-bedroom, two-bathroom apartments, ready for short stays and long ones.',
        body: '',
        buttons: [{ title: 'View all apartments', href: '/apartments' }],
      },
      highlights: {
        overline: 'Why stay with us',
        title: 'Everything you need, nothing you don’t',
        subtitle: 'Comfort, security and service that make a stay feel like home.',
        body: '',
        items: [
          { icon: 'zap', title: '24-hour electricity', body: 'Uninterrupted power so you can work and rest without worry.' },
          { icon: 'wifi', title: 'Fibre internet', body: 'High-speed fibre optic internet in every apartment.' },
          { icon: 'shield', title: 'Secure & serene', body: 'Round-the-clock security in a quiet part of Eagle Island.' },
          { icon: 'utensils', title: 'Fully equipped kitchen', body: 'Cook in comfort with a complete set of utensils and appliances.' },
          { icon: 'shirt', title: 'In-house laundry', body: 'Laundry service on site and daily housekeeping.' },
          { icon: 'concierge', title: 'Concierge support', body: 'Our team is a message away for anything you need.' },
        ],
      },
      about: {
        overline: 'The Presidential experience',
        title: 'Stay in the heart of Port Harcourt',
        body: 'Contemporary, convenient and perfectly positioned, Presidential Service Apartments is ideal for business travellers and families alike — just 30 minutes from the airport on Eagle Island.',
        buttons: [{ title: 'Our story', href: '/about' }],
      },
      stats: {
        overline: 'At a glance',
        title: 'Built around your comfort',
        subtitle: 'The essentials, always on.',
        body: '',
        items: [
          { title: '24/7', subtitle: 'Electricity', body: 'Reliable power around the clock.' },
          { title: '24/7', subtitle: 'Security', body: 'Gated, monitored and secure.' },
          { title: '30 min', subtitle: 'From the airport', body: 'Centrally located on Eagle Island.' },
          { title: '100%', subtitle: 'Furnished', body: 'Move in with just your suitcase.' },
        ],
      },
      video: {
        title: 'Experience the lifestyle',
        subtitle: 'A glimpse into our spaces and services.',
        body: '',
        video: 'https://youtube.com/shorts/1vrzIrYEkH4',
      },
      testimonials: {
        title: 'What our guests say',
        subtitle: 'Real experiences from guests and corporate partners.',
        body: '',
        items: [
          { title: 'Adaeze O.', subtitle: 'Guest — Business stay', body: 'Immaculate rooms and seamless service. The internet was fast, and the staff were always helpful.' },
          { title: 'Kunle A.', subtitle: 'Guest — Holiday', body: 'Perfect for family trips. Secure, quiet, and comfortable. It felt like a boutique hotel with the privacy of home.' },
          { title: 'Chinedu M.', subtitle: 'Corporate client', body: 'Our team stayed for 3 weeks. Great location and amenities. We will definitely book again.' },
        ],
      },
      faqs: {
        title: 'Frequently asked questions',
        subtitle: 'Answers to common questions about our apartments and services.',
        body: '',
        items: [
          { title: 'What amenities are included?', body: 'Apartments include fully furnished rooms, reliable power, high-speed internet, 24/7 security, housekeeping and concierge services.' },
          { title: 'Do you offer short and long stays?', body: 'Yes. We support short-let stays and long-term rentals. Contact us for tailored rates based on duration.' },
          { title: 'Where are you located?', body: 'We are on Eagle Island, Port Harcourt, Nigeria, in a secure and serene neighbourhood.' },
          { title: 'How do I book?', body: 'Pick your dates in the search bar, choose an apartment and send a reservation request. We will confirm availability and rates.' },
        ],
      },
      blog: {
        title: 'Latest from our blog',
        subtitle: 'Insights, tips and updates from Presidential Service Apartments.',
        body: '',
      },
      cta: {
        title: 'Plan your next getaway',
        body: 'Check availability for your dates and book a furnished apartment in minutes.',
        buttons: [
          { title: 'Browse apartments', href: '/apartments' },
          { title: 'Contact us', href: '/contact' },
        ],
      },
    },
    about: {
      hero: {
        overline: 'A slice of paradise',
        title: 'Presidential Service Apartments',
        subtitle: 'Premium accommodation with hospitality that feels personal.',
        body: 'It is right between your hands. Find yourself in a harmonious blend of 5-star hospitality, attention to detail and international know-how.\n\nAt Presidential Service Apartments, we love making our guests feel comfortable, energised and productive when they stay with us. We do this by combining premium accommodation with great service.\n\nWe know how busy you are, and we know the importance of a good night’s sleep. That is why every apartment is designed to help you rest well and wake up ready for the day.',
        image: HERO_IMAGE,
        buttons: [{ title: 'Explore apartments', href: '/apartments' }],
      },
      comforts: {
        title: 'Signature comforts',
        subtitle: 'Premium in-apartment amenities designed for rest and productivity.',
        body: '',
        image: HERO_IMAGE,
        items: [
          { title: 'Fully equipped kitchen with utensils', body: '' },
          { title: 'In-house laundry services', body: '' },
          { title: 'Flat-screen LED TV', body: '' },
          { title: 'High-speed fibre optic internet', body: '' },
          { title: '24 hours electricity', body: '' },
        ],
      },
      facilities: {
        title: 'Facilities',
        body: '',
        items: [
          { title: 'Informal meeting spaces', body: '' },
          { title: 'Small to medium-sized group facilities', body: '' },
          { title: 'Concierge support', body: '' },
          { title: 'Secure, serene neighbourhood', body: '' },
        ],
      },
      quote: {
        title: 'Chief Executive Officer',
        subtitle: 'Presidential Service Apartments',
        body: 'Stay in the heart of Port Harcourt. Contemporary, convenient and perfectly positioned, the upscale Presidential Apartments PH is ideal for business travellers.',
        image: '',
      },
      cta: {
        title: 'Plan your next getaway',
        body: 'Exclusive offers, packages and discounts on furnished apartments.',
        buttons: [
          { title: 'Browse apartments', href: '/apartments' },
          { title: 'Contact support', href: '/contact' },
        ],
      },
    },
    contact: {
      hero: {
        overline: 'Get in touch',
        title: 'We’d love to hear from you',
        body: 'Questions about a stay, rates or special requests? Reach our concierge any time.',
      },
      faqs: {
        title: 'Frequently asked questions',
        subtitle: 'Quick answers before you reach out.',
        body: '',
        items: [
          { title: 'How do I make a reservation?', body: 'Browse apartments, select your dates and submit the reservation form. Our team will confirm availability and follow up promptly.' },
          { title: 'Can I contact support via WhatsApp?', body: 'Yes. Use the WhatsApp “Chat” button to reach us directly for quick assistance, changes or questions.' },
          { title: 'What is your response time?', body: 'We typically respond within minutes on WhatsApp and within 24 hours via email.' },
        ],
      },
    },
    terms: legal(
      'Terms and Conditions',
      'Legal',
      '<p>These terms and conditions outline the rules and regulations for the use of our website and the booking of our apartments.</p><p>Update this page from the admin dashboard under Content → Terms of service.</p>'
    ),
    privacyPolicy: legal(
      'Privacy Policy',
      'Data protection',
      '<p>This privacy policy explains how we collect, use and protect your personal information.</p><p>Update this page from the admin dashboard under Content → Privacy policy.</p>'
    ),
    cookiePolicy: legal(
      'Cookie Policy',
      'Cookie information',
      '<p>This policy explains how we use cookies and similar technologies on our website.</p><p>Update this page from the admin dashboard under Content → Cookie policy.</p>'
    ),
  },
  systemSettings: {
    siteLogo: '',
    siteIcon: '',
    siteName: 'Presidential Service Apartments',
    siteUrl: 'https://presidentialserviceapartments.ng',
    siteSlogan: 'A Slice of Paradise',
    siteGraphImage: HERO_IMAGE,
    siteKeywords: [
      'serviced apartments',
      'luxury apartments',
      'short let',
      'Port Harcourt',
      'Nigeria',
      'holiday rentals',
      'business travel',
      'Presidential Service Apartment',
    ],
    siteDescription:
      'Premium short-let and long-stay serviced apartments in Port Harcourt, Nigeria. Fully furnished units with hotel-style amenities, 24/7 security and concierge.',
    siteAuthor: 'Presidential Service Apartment Limited',
    siteLocale: 'en_NG',
    siteType: 'website',
    ogTitle: 'Presidential Service Apartments | Serviced apartments in Port Harcourt',
    ogDescription:
      'Luxury serviced apartments and short lets in Port Harcourt with modern finishes, reliable power, fast internet and exceptional service.',
    ogImage: HERO_IMAGE,
    ogImageAlt: 'Presidential Service Apartments — exterior view',
    twitterCard: 'summary_large_image',
    twitterSite: '@presidentialserviceapartment',
    twitterCreator: '@presidentialserviceapartment',
    twitterTitle: 'Presidential Service Apartments PH',
    twitterDescription:
      'Luxury serviced apartments and short lets in Port Harcourt, Nigeria. Fully furnished, secure, and designed for comfort.',
    twitterImage: HERO_IMAGE,
    maintenanceMode: false,
    headerLinks: [
      { label: 'Home', href: '/' },
      { label: 'Apartments', href: '/apartments' },
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact', isButton: true },
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
          { label: 'Chat on WhatsApp', href: 'https://wa.me/2348066907729', target: '_blank' },
          { label: 'Email Support', href: 'mailto:info@presidentialserviceapartments.ng', target: '_blank' },
        ],
      },
    ],
    socialLinks: [
      { label: 'Facebook', icon: 'facebook', href: 'https://facebook.com/presidentialapartments' },
      { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/presidentialapartments?igsh=aDdrNzI2czF1NGph' },
      { label: 'Tiktok', icon: 'tiktok', href: 'https://www.tiktok.com/@presidential.service' },
      { label: 'Whatsapp', icon: 'whatsapp', href: 'https://wa.me/447459725394' },
    ],
    contact: {
      email: 'info@presidentialserviceapartments.ng',
      phones: ['+2348066907729'],
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

export default defaults;
