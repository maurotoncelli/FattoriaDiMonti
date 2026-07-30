import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { localeUrl, pageAlternates } from '@/lib/site';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    return {
        title: t('pages.storia.title'),
        description: t('pages.storia.description'),
        alternates: pageAlternates(locale, '/storia'),
        openGraph: {
            title: t('pages.storia.title'),
            description: t('pages.storia.description'),
            url: localeUrl(locale, '/storia'),
        },
    };
}

export default function StoriaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
