import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BASE_URL } from '@/lib/site';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    const url = `${locale === 'it' ? BASE_URL : `${BASE_URL}/${locale}`}/mucco-pisano`;
    return {
        title: t('pages.muccoPisano.title'),
        description: t('pages.muccoPisano.description'),
        alternates: { canonical: url },
        openGraph: {
            title: t('pages.muccoPisano.title'),
            description: t('pages.muccoPisano.description'),
            url,
        },
    };
}

export default function MuccoPisanoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
