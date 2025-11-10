import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://presidentialserviceapartments.ng';

  // 🧩 Example: Fetch dynamic data from your API
  // Replace these endpoints with your actual ones
  const [apartments, blogs] = await Promise.all([
    fetch(`${baseUrl}/api/apartments`)
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/api/blog`)
      .then(async (res) => {
        const data = await res.json();
        return data.posts || [];
      })
      .catch(() => []),
  ]);

  // 🗺 Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/apartments`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 🧱 Dynamic "Apartments" pages
  const apartmentItems = Array.isArray(apartments)
    ? apartments
    : (apartments?.apartments || []);
  const apartmentPages: MetadataRoute.Sitemap = apartmentItems.map((apartment: any) => ({
    url: `${baseUrl}/apartments/${apartment.slug}`,
    lastModified: new Date(apartment.updatedAt || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 📰 Dynamic "Blog" pages
  const blogPages: MetadataRoute.Sitemap = blogs.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...apartmentPages, ...blogPages];
}
