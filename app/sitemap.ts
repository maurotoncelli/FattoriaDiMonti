import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/app/[locale]/layout';

const LOCALES = ['it', 'en'] as const;

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '',              priority: 1.0, changeFrequency: 'weekly'  },
    { path: '/storia',       priority: 0.8, changeFrequency: 'monthly' },
    { path: '/la-filiera',   priority: 0.8, changeFrequency: 'monthly' },
    { path: '/olio',         priority: 0.9, changeFrequency: 'monthly' },
    { path: '/mucco-pisano', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/cereali',      priority: 0.7, changeFrequency: 'monthly' },
    { path: '/ospitalita',   priority: 0.9, changeFrequency: 'monthly' },
    { path: '/cucina-nomade',priority: 0.7, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    for (const route of ROUTES) {
        const languages: Record<string, string> = {};
        for (const locale of LOCALES) {
            const prefix = locale === 'it' ? '' : `/${locale}`;
            languages[locale] = `${BASE_URL}${prefix}${route.path}`;
        }

        for (const locale of LOCALES) {
            const prefix = locale === 'it' ? '' : `/${locale}`;
            entries.push({
                url: `${BASE_URL}${prefix}${route.path}`,
                lastModified: new Date(),
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                alternates: { languages },
            });
        }
    }

    return entries;
}
