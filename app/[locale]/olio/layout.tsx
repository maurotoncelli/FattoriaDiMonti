import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BASE_URL } from '@/app/[locale]/layout';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    const url = `${locale === 'it' ? BASE_URL : `${BASE_URL}/${locale}`}/olio`;
    return {
        title: t('pages.olio.title'),
        description: t('pages.olio.description'),
        alternates: { canonical: url },
        openGraph: {
            title: t('pages.olio.title'),
            description: t('pages.olio.description'),
            url,
        },
    };
}

export default function OlioLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
