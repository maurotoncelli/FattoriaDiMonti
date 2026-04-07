import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BASE_URL } from '@/app/[locale]/layout';
import Script from 'next/script';
import HeroSection from '@/components/dom/HeroSection';
import HistoryTerroir from '@/components/dom/HistoryTerroir';
import ProductsHorizontalWalk from '@/components/dom/ProductsHorizontalWalk';
import Hospitality from '@/components/dom/Hospitality';
import FooterSection from '@/components/dom/FooterSection';

export async function generateMetadata(
    props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    const url = locale === 'it' ? BASE_URL : `${BASE_URL}/${locale}`;
    return {
        title: t('pages.home.title'),
        description: t('pages.home.description'),
        alternates: { canonical: url },
        openGraph: {
            title: t('pages.home.title'),
            description: t('pages.home.description'),
            url,
        },
    };
}

const LOCAL_BUSINESS_JSONLD = {
    '@context': 'https://schema.org',
    '@type': 'AgriTourismBusiness',
    name: 'Fattoria di Monti',
    alternateName: 'Fattoria di Monti — Ere della Terra',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    image: `${BASE_URL}/og-image.jpg`,
    description: 'Agriturismo di lusso a Volterra con olio extravergine biologico premiato, Mucco Pisano e ospitalità nella Villa del Buontalenti.',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Loc. Monti',
        addressLocality: 'Volterra',
        addressRegion: 'PI',
        postalCode: '56048',
        addressCountry: 'IT',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 43.4,
        longitude: 10.85,
    },
    telephone: '+39 0588 86099',
    email: 'info@fattoriadimonti.it',
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        description: 'Ricevimento esclusivamente su prenotazione',
    },
    hasMap: 'https://maps.google.com/?q=Fattoria+di+Monti+Volterra',
    sameAs: [
        'https://www.instagram.com/fattoriadimonti',
    ],
    priceRange: '€€€',
};

export default function Home() {
    return (
        <>
            <Script
                id="jsonld-local-business"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSONLD) }}
            />
            <main id="main-scroll">
                <HeroSection />
                <HistoryTerroir />
                <ProductsHorizontalWalk />
                <Hospitality />
                <FooterSection />
            </main>
        </>
    );
}
