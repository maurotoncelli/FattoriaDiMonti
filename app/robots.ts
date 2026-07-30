import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/_next/',
                    // Route legacy: solo redirect, non vanno indicizzate
                    '/cereali',
                    '/la-filiera',
                    '/vino-e-caccia',
                    '/en/cereali',
                    '/en/la-filiera',
                    '/en/vino-e-caccia',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
