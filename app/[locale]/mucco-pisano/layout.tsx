import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { localeUrl, pageAlternates } from '@/lib/site';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    return {
        title: t('pages.muccoPisano.title'),
        description: t('pages.muccoPisano.description'),
        alternates: pageAlternates(locale, '/mucco-pisano'),
        openGraph: {
            title: t('pages.muccoPisano.title'),
            description: t('pages.muccoPisano.description'),
            url: localeUrl(locale, '/mucco-pisano'),
        },
    };
}

export default function MuccoPisanoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
