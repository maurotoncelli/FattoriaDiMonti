import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BASE_URL } from '@/app/[locale]/layout';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    const url = `${locale === 'it' ? BASE_URL : `${BASE_URL}/${locale}`}/ospitalita`;
    return {
        title: t('pages.ospitalita.title'),
        description: t('pages.ospitalita.description'),
        alternates: { canonical: url },
        openGraph: {
            title: t('pages.ospitalita.title'),
            description: t('pages.ospitalita.description'),
            url,
        },
    };
}

export default function OspitalitaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
