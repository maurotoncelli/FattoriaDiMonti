import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { localeUrl, pageAlternates } from '@/lib/site';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    return {
        title: t('pages.ospitalita.title'),
        description: t('pages.ospitalita.description'),
        alternates: pageAlternates(locale, '/ospitalita'),
        openGraph: {
            title: t('pages.ospitalita.title'),
            description: t('pages.ospitalita.description'),
            url: localeUrl(locale, '/ospitalita'),
        },
    };
}

export default function OspitalitaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
