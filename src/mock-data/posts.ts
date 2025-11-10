import { Post } from '@/models/post';

export const posts: Post[] = [
  {
    "id": "post-001",
    "title": "Experience Presidential Luxury Living",
    "slug": "experience-presidential-luxury-living",
    "subtitle": "Where elegance meets comfort",
    "content": "<h2>Welcome to a World of Refined Luxury</h2><p>At <strong>Presidential Service Apartment</strong>, sophistication meets comfort. Each suite is meticulously designed to offer a tranquil escape from the busy city life. Enjoy spacious living areas, curated art pieces, and floor-to-ceiling windows with panoramic skyline views.</p><p>Guests can indulge in premium amenities such as <em>high-speed Wi-Fi</em>, <em>smart climate control</em>, and <em>24-hour concierge service</em>. Whether you’re here for business or leisure, we promise an unforgettable experience that defines modern luxury.</p><ul><li>Exclusive Presidential Suites with private balconies</li><li>Complimentary breakfast and in-room dining</li><li>State-of-the-art fitness center and spa</li></ul><p>Redefine your expectations of hospitality—discover why our guests call us their home away from home.</p>",
    "excerpt": "Step into a world of luxury where every stay is a statement of class and comfort.",
    "author": {
      "id": "author-001",
      "name": "Presidential Admin",
      "avatar": "https://via.placeholder.com/100x100"
    },
    "category": {
      "id": "cat-001",
      "name": "Luxury Living",
      "slug": "luxury-living",
      "description": "Stories showcasing the premium lifestyle experience at our serviced apartments."
    },
    "tags": [
      { "id": "tag-001", "name": "Luxury" },
      { "id": "tag-002", "name": "Suites" }
    ],
    "featuredMedia": {
      "url": "/images/post-image-1.jpg",
      "alt": "Presidential living room interior",
      "type": "image",
      "caption": "The Presidential Suite — elegance redefined",
      "width": 1200,
      "height": 800
    },
    "meta": {
      "title": "Experience Presidential Luxury Living | Presidential Service Apartment",
      "description": "Indulge in refined comfort and unmatched hospitality at our Presidential Suites.",
      "keywords": ["Luxury Apartment", "Shortlet", "Presidential Suite", "Hospitality"],
      "ogImage": "https://via.placeholder.com/1200x800",
      "canonicalUrl": "https://presidentialserviceapartments.ng/blog/experience-presidential-luxury-living"
    },
    "stats": { "views": 1050, "likes": 120, "shares": 40, "readingTime": 4, "commentCount": 5 },
    "status": "published",
    "visibility": "public",
    "createdAt": "2025-10-01T10:00:00Z",
    "updatedAt": "2025-10-05T12:00:00Z",
    "publishedAt": "2025-10-06T09:00:00Z",
    "isPromoted": true,
    "isFeatured": true,
    "isPremium": false,
    "allowComments": true,
    "relatedPosts": ["post-002", "post-003"],
    "version": 1,
    "lastModifiedBy": "admin-001"
  },
  {
    "id": "post-002",
    "title": "5 Reasons to Choose Presidential Service Apartment for Your Next Stay",
    "slug": "5-reasons-to-choose-presidential-service-apartment",
    "content": "<h2>Your Perfect Stay Awaits</h2><p>Choosing the right accommodation defines your travel experience. At <strong>Presidential Service Apartment</strong>, every detail is designed for your comfort, privacy, and convenience. Whether for business or leisure, here are five reasons our guests keep coming back:</p><ol><li><strong>Luxury Amenities:</strong> Enjoy fully furnished apartments with smart TVs, kitchenettes, and premium bedding.</li><li><strong>Prime Location:</strong> Stay close to business districts and entertainment hubs.</li><li><strong>Unmatched Privacy:</strong> Gated access and soundproof rooms ensure complete serenity.</li><li><strong>24/7 Concierge:</strong> From airport pickups to local recommendations, we’ve got you covered.</li><li><strong>Flexible Booking:</strong> Stay for a night or a month—our flexible plans suit every lifestyle.</li></ol><p>Discover a stay that feels uniquely yours. Experience hospitality the presidential way.</p>",
    "excerpt": "Five reasons why Presidential Service Apartment remains the preferred choice for luxury travelers.",
    "author": {
      "id": "author-001",
      "name": "Presidential Admin",
      "avatar": "https://via.placeholder.com/100x100"
    },
    "category": { "id": "cat-002", "name": "Guest Experience", "slug": "guest-experience" },
    "tags": [
      { "id": "tag-003", "name": "Comfort" },
      { "id": "tag-004", "name": "Hospitality" }
    ],
    "featuredMedia": {
      "url": "/images/post-image-2.jpg",
      "alt": "Luxury bedroom interior",
      "type": "image",
      "width": 1200,
      "height": 700
    },
    "meta": {
      "title": "5 Reasons to Stay at Presidential Service Apartment",
      "description": "Learn why guests prefer our serviced apartments for convenience, luxury, and security.",
      "keywords": ["Shortlet", "Luxury Stay", "Comfort", "Serviced Apartment"],
      "ogImage": "https://via.placeholder.com/1200x700"
    },
    "stats": { "views": 830, "likes": 95, "shares": 30, "readingTime": 3, "commentCount": 3 },
    "status": "published",
    "visibility": "public",
    "createdAt": "2025-10-07T10:00:00Z",
    "updatedAt": "2025-10-08T11:00:00Z",
    "publishedAt": "2025-10-09T08:30:00Z",
    "isPromoted": false,
    "isFeatured": true,
    "isPremium": false,
    "allowComments": true,
    "relatedPosts": ["post-001", "post-004"],
    "version": 1,
    "lastModifiedBy": "admin-001"
  },
  {
    "id": "post-003",
    "title": "Inside the Executive Suite",
    "slug": "inside-the-executive-suite",
    "subtitle": "A peek into comfort and design perfection",
    "content": "<h2>Designed for the Modern Executive</h2><p>Our <strong>Executive Suites</strong> combine aesthetic excellence with practical functionality. From spacious lounges to ergonomic workspaces, each detail reflects precision and style.</p><p>The suite features custom furniture, ambient lighting, and high-end finishes that create a serene atmosphere for productivity and relaxation alike. Guests enjoy <em>private balconies</em>, <em>complimentary breakfast</em>, and <em>daily housekeeping</em>.</p><p>Perfect for corporate guests, long stays, or families seeking privacy without compromise.</p>",
    "excerpt": "Take a virtual tour of our Executive Suite — where style meets sophistication.",
    "author": { "id": "author-002", "name": "Chioma Ade", "avatar": "https://via.placeholder.com/100x100" },
    "category": { "id": "cat-001", "name": "Luxury Living", "slug": "luxury-living" },
    "tags": [
      { "id": "tag-005", "name": "Executive Suite" },
      { "id": "tag-006", "name": "Interior Design" }
    ],
    "featuredMedia": {
      "url": "/images/post-image-3.jpg",
      "alt": "Executive Suite interior",
      "type": "image",
      "width": 1200,
      "height": 750
    },
    "meta": {
      "title": "Explore the Executive Suite | Presidential Service Apartment",
      "description": "Step into a refined space designed for business travelers and luxury seekers.",
      "keywords": ["Executive Suite", "Luxury Apartment", "Shortlet"]
    },
    "stats": { "views": 920, "likes": 100, "shares": 35, "readingTime": 4, "commentCount": 2 },
    "status": "published",
    "visibility": "public",
    "createdAt": "2025-10-10T09:00:00Z",
    "updatedAt": "2025-10-11T12:00:00Z",
    "publishedAt": "2025-10-12T08:30:00Z",
    "isPromoted": true,
    "isFeatured": false,
    "isPremium": false,
    "allowComments": true,
    "relatedPosts": ["post-001"],
    "version": 1,
    "lastModifiedBy": "admin-002"
  },
  {
    "id": "post-004",
    "title": "Safety & Security: Our Top Priority",
    "slug": "safety-and-security-our-top-priority",
    "content": "<h2>Stay Secure, Stay Confident</h2><p>Your peace of mind is our top priority. <strong>Presidential Service Apartment</strong> employs advanced security systems, including 24-hour surveillance, access control, and trained security personnel to safeguard every guest.</p><p>Our facilities feature <em>smart key entry</em>, <em>motion detection systems</em>, and <em>on-site patrols</em>. We also ensure strict privacy policies to keep your stay confidential and protected.</p><p>Rest easy knowing that safety is never compromised — because true luxury means complete trust.</p>",
    "excerpt": "We redefine peace of mind with modern safety systems designed for comfort and trust.",
    "author": { "id": "author-003", "name": "James Wilson", "avatar": "https://via.placeholder.com/100x100" },
    "category": { "id": "cat-003", "name": "Safety & Comfort", "slug": "safety-comfort" },
    "tags": [
      { "id": "tag-007", "name": "Security" },
      { "id": "tag-008", "name": "Technology" }
    ],
    "featuredMedia": {
      "url": "/images/post-image-4.jpg",
      "alt": "Building security control system",
      "type": "image",
      "width": 1200,
      "height": 600
    },
    "meta": {
      "title": "Safety & Security at Presidential Service Apartment",
      "description": "Advanced systems and personnel ensure your stay is safe, private, and secure.",
      "keywords": ["Security", "Safety", "Apartment", "Access Control"]
    },
    "stats": { "views": 750, "likes": 80, "shares": 25, "readingTime": 3, "commentCount": 1 },
    "status": "published",
    "visibility": "public",
    "createdAt": "2025-10-13T10:00:00Z",
    "updatedAt": "2025-10-14T09:30:00Z",
    "publishedAt": "2025-10-15T08:00:00Z",
    "isPromoted": false,
    "isFeatured": false,
    "isPremium": false,
    "allowComments": true,
    "relatedPosts": ["post-002"],
    "version": 1,
    "lastModifiedBy": "admin-001"
  },
  {
    "id": "post-005",
    "title": "A Weekend of Serenity",
    "slug": "deluxe-apartment-experience",
    "content": "<h2>Relax, Recharge, and Reconnect</h2><p>The <strong>Deluxe Apartments</strong> at Presidential Service Apartment offer an oasis of calm in the heart of the city. Featuring serene décor, plush bedding, and private balconies, they are perfect for couples and leisure travelers.</p><p>Spend your weekend surrounded by comfort—enjoy breakfast in bed, stream your favorite shows, or unwind in our rooftop lounge overlooking the city lights. Serenity begins where your check-in ends.</p>",
    "excerpt": "Unwind in style and experience the serenity of our Deluxe Apartments.",
    "author": { "id": "author-002", "name": "Chioma Ade", "avatar": "https://via.placeholder.com/100x100" },
    "category": { "id": "cat-004", "name": "Guest Stories", "slug": "guest-stories" },
    "tags": [
      { "id": "tag-009", "name": "Relaxation" },
      { "id": "tag-010", "name": "Deluxe Apartment" }
    ],
    "featuredMedia": {
      "url": "/images/post-image-5.jpg",
      "alt": "Deluxe apartment bedroom",
      "type": "image",
      "width": 1200,
      "height": 750
    },
    "meta": {
      "title": "Weekend Serenity at Presidential Service Apartment",
      "description": "Relax, recharge, and reconnect in our beautifully designed Deluxe Apartments.",
      "keywords": ["Deluxe", "Apartment", "Weekend Stay", "Relax"]
    },
    "stats": { "views": 680, "likes": 85, "shares": 20, "readingTime": 3, "commentCount": 2 },
    "status": "published",
    "visibility": "public",
    "createdAt": "2025-10-16T10:00:00Z",
    "updatedAt": "2025-10-18T09:00:00Z",
    "publishedAt": "2025-10-18T11:00:00Z",
    "isPromoted": false,
    "isFeatured": true,
    "isPremium": false,
    "allowComments": true,
    "relatedPosts": ["post-003"],
    "version": 1,
    "lastModifiedBy": "admin-002"
  },
  {
    "id": "post-006",
    "title": "Presidential Service Apartment Launches Loyalty Program",
    "slug": "presidential-loyalty-program",
    "content": "<h2>Introducing the Presidential Loyalty Program</h2><p>We’re rewarding our most loyal guests! The <strong>Presidential Loyalty Program</strong> offers exclusive benefits including discounts, early check-ins, free nights, and premium upgrades. Each stay earns points that can be redeemed for rewards, making every visit even more valuable.</p><p>Joining is simple — book directly through our website, create an account, and start earning from your first stay. Your loyalty deserves recognition, and we’re here to make every stay rewarding.</p>",
    "excerpt": "Stay more, earn more — join our exclusive Presidential Loyalty Program today.",
    "author": { "id": "author-001", "name": "Presidential Admin", "avatar": "https://via.placeholder.com/100x100" },
    "category": { "id": "cat-005", "name": "News & Updates", "slug": "news-updates" },
    "tags": [
      { "id": "tag-011", "name": "Loyalty Program" },
      { "id": "tag-012", "name": "Rewards" }
    ],
    "featuredMedia": {
      "url": "/images/post-image-6.jpg",
      "alt": "Loyalty card program image",
      "type": "image",
      "width": 1200,
      "height": 650
    },
    "meta": {
      "title": "Presidential Loyalty Program Launch",
      "description": "Join our exclusive rewards program and enjoy unmatched benefits every time you stay.",
      "keywords": ["Loyalty", "Rewards", "Program", "Presidential Apartment"]
    },
    "stats": { "views": 900, "likes": 110, "shares": 45, "readingTime": 2, "commentCount": 6 },
    "status": "published",
    "visibility": "public",
    "createdAt": "2025-10-20T10:00:00Z",
    "updatedAt": "2025-10-21T09:30:00Z",
    "publishedAt": "2025-10-22T08:00:00Z",
    "isPromoted": true,
    "isFeatured": true,
    "isPremium": false,
    "allowComments": true,
    "relatedPosts": ["post-002", "post-005"],
    "version": 1,
    "lastModifiedBy": "admin-001"
  }
];

export default posts;
