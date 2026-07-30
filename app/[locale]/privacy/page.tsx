import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { localeUrl, pageAlternates } from '@/lib/site';
import LegalPage from '@/components/dom/LegalPage';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Legal.privacy' });
    return {
        title: t('title'),
        description: t('intro'),
        alternates: pageAlternates(locale, '/privacy'),
        openGraph: {
            title: t('title'),
            description: t('intro'),
            url: localeUrl(locale, '/privacy'),
        },
    };
}

export default async function PrivacyPage(
    props: { params: Promise<{ locale: string }> }
) {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Legal.privacy' });
    return (
        <LegalPage
            title={t('title')}
            updatedAt={t('updatedAt')}
            intro={t('intro')}
            sections={t.raw('sections') as { title: string; body: string }[]}
        />
    );
}
