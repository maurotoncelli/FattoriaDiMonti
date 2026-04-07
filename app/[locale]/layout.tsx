import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import AppWrapper from '@/components/AppWrapper';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

export const BASE_URL = 'https://www.fattoriadimonti.it';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
    weight: ['400', '700'],
    style: ['normal', 'italic'],
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
    weight: ['300', '400', '500'],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#2B2416',
};

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    const canonicalUrl = `${BASE_URL}${locale === 'it' ? '' : `/${locale}`}`;

    return {
        metadataBase: new URL(BASE_URL),
        title: {
            default: t('title'),
            template: `%s | Fattoria di Monti`,
        },
        description: t('description'),
        keywords: t('keywords').split(', '),
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true },
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'it': BASE_URL,
                'en': `${BASE_URL}/en`,
                'x-default': BASE_URL,
            },
        },
        openGraph: {
            title: t('openGraph.title'),
            description: t('openGraph.description'),
            type: 'website',
            locale: locale === 'it' ? 'it_IT' : 'en_GB',
            url: canonicalUrl,
            siteName: 'Fattoria di Monti',
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: t('openGraph.title'),
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('openGraph.title'),
            description: t('openGraph.description'),
            images: ['/og-image.jpg'],
        },
    };
}

export default async function RootLayout(
    props: {
        children: React.ReactNode;
        params: Promise<{locale: string}>;
    }
) {
    const params = await props.params;
    const { locale } = params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }
 
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
            <head />
            <body>
                <NextIntlClientProvider messages={messages}>
                    <AppWrapper>{props.children}</AppWrapper>
                </NextIntlClientProvider>
                <GoogleAnalytics />
            </body>
        </html>
    );
}
