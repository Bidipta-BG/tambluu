import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gettambola.in';

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0, // Homepage is the most important
    },
    {
      url: `${baseUrl}/themes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    { url: `${baseUrl}/refer`,        priority: 0.7, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${baseUrl}/refer/signup`, priority: 0.6, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${baseUrl}/refer/login`,  priority: 0.5, changeFrequency: 'yearly', lastModified: new Date() },
  ];
}
