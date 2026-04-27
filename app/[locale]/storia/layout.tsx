import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BASE_URL } from '@/lib/site';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    const url = `${locale === 'it' ? BASE_URL : `${BASE_URL}/${locale}`}/storia`;
    return {
        title: t('pages.storia.title'),
        description: t('pages.storia.description'),
        alternates: { canonical: url },
        openGraph: {
            title: t('pages.storia.title'),
            description: t('pages.storia.description'),
            url,
        },
    };
}

export default function StoriaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
