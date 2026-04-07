import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BASE_URL } from '@/app/[locale]/layout';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    const url = `${locale === 'it' ? BASE_URL : `${BASE_URL}/${locale}`}/cucina-nomade`;
    return {
        title: t('pages.cucinaNomade.title'),
        description: t('pages.cucinaNomade.description'),
        alternates: { canonical: url },
        openGraph: {
            title: t('pages.cucinaNomade.title'),
            description: t('pages.cucinaNomade.description'),
            url,
        },
    };
}

export default function CucinaNomadeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
