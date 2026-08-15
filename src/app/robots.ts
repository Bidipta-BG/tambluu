import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/api/'], // Disallow crawling of internal API or private routes
    },
    sitemap: 'https://starttambola.in/sitemap.xml',
  };
}
