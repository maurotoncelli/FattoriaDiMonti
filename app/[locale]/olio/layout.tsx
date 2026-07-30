import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { localeUrl, pageAlternates } from '@/lib/site';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    return {
        title: t('pages.olio.title'),
        description: t('pages.olio.description'),
        alternates: pageAlternates(locale, '/olio'),
        openGraph: {
            title: t('pages.olio.title'),
            description: t('pages.olio.description'),
            url: localeUrl(locale, '/olio'),
        },
    };
}

export default function OlioLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
