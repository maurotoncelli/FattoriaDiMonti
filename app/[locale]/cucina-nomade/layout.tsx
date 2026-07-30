import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { localeUrl, pageAlternates } from '@/lib/site';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    return {
        title: t('pages.cucinaNomade.title'),
        description: t('pages.cucinaNomade.description'),
        alternates: pageAlternates(locale, '/cucina-nomade'),
        openGraph: {
            title: t('pages.cucinaNomade.title'),
            description: t('pages.cucinaNomade.description'),
            url: localeUrl(locale, '/cucina-nomade'),
        },
    };
}

export default function CucinaNomadeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
