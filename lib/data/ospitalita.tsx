import React from 'react';
import type { OspitalitaContent } from '@/lib/content/types';

export type { OspitalitaContent as OspitalitaData };

export const getOspitalitaData = (t: any): OspitalitaContent => ({
    closeUrl: '/#03-ospitalita',
    closeLabel: t('UI.closeLabel'),
    sections: {
        hero: {
            label: t('Ospitalita.sections.hero.label'),
            titleHtml: t.rich('Ospitalita.sections.hero.titleHtml', {
                br: () => <br />,
                brResp: () => <br className="hidden md:block" />,
                emClass: (chunks: React.ReactNode) => <em className="text-[#C5B597] italic font-light">{chunks}</em>,
            }),
            introText: t('Ospitalita.sections.hero.introText'),
            images: {
                background: { src: '/images/bg-ospitalita.jpg', alt: t('Ospitalita.sections.hero.label') },
            },
        },
        calore: {
            label: t('Ospitalita.sections.calore.label'),
            titleHtml: t.rich('Ospitalita.sections.calore.titleHtml', {
                br: () => <br />,
                brResp: () => <br className="hidden md:block" />,
                emClass: (chunks: React.ReactNode) => <em>{chunks}</em>,
            }),
            paragraphs: [
                <React.Fragment key="c0">{t('Ospitalita.sections.calore.paragraphs.0')}</React.Fragment>,
                t.rich('Ospitalita.sections.calore.paragraphs.1', {
                    strongClass: (chunks: React.ReactNode) => <strong className="font-medium">{chunks}</strong>,
                }),
            ],
            images: {
                primary: { src: '', alt: 'Texture Fuoco e Libreria', overlayText: 'Texture Fuoco e Libreria' },
            },
        },
        galleria: {
            titleHtml: t.rich('Ospitalita.sections.galleria.titleHtml', {
                br: () => <br />,
                brResp: () => <br className="hidden md:block" />,
                emClass: (chunks: React.ReactNode) => <em className="text-[var(--olive)]">{chunks}</em>,
            }),
            scrollHint: t('Ospitalita.sections.galleria.scrollHint'),
            items: [
                { src: '/images/casa-rossa-interni.png', alt: t('Ospitalita.sections.galleria.items.0.alt'), overlayText: t('Ospitalita.sections.galleria.items.0.overlayText'), aspect: '3/2' },
                { src: '/images/cucina-nomade.png', alt: t('Ospitalita.sections.galleria.items.1.alt'), overlayText: t('Ospitalita.sections.galleria.items.1.overlayText'), aspect: '2/3' },
                { src: '/images/casa-rossa-panoramic.png', alt: t('Ospitalita.sections.galleria.items.2.alt'), overlayText: t('Ospitalita.sections.galleria.items.2.overlayText'), aspect: '3/2' },
                { src: '/images/villa-buontalenti.png', alt: t('Ospitalita.sections.galleria.items.3.alt'), overlayText: t('Ospitalita.sections.galleria.items.3.overlayText'), aspect: '2/3' },
                { src: '/images/cucina-nomade-hero.jpg', alt: t('Ospitalita.sections.galleria.items.4.alt'), overlayText: t('Ospitalita.sections.galleria.items.4.overlayText'), aspect: '3/2' },
            ],
            indicator: {
                exploreText: t('Ospitalita.sections.galleria.indicator.exploreText'),
                scrollText: t('Ospitalita.sections.galleria.indicator.scrollText'),
            },
        },
        stanze: {
            label: t('Ospitalita.sections.stanze.label'),
            titleHtml: t.rich('Ospitalita.sections.stanze.titleHtml', {
                emClass: (chunks: React.ReactNode) => <em>{chunks}</em>,
            }),
            introText: t('Ospitalita.sections.stanze.introText'),
            rooms: (t.raw('Ospitalita.sections.stanze.rooms') as any[]).map((r: any, idx: number) => {
                const baseColors = ['#F5F2EB', '#DDE2DB', '#EAD7D6', '#F3E2CF'];
                const photoSets = [
                    [
                        { src: '/images/casa-rossa-interni.png', alt: `${r.name} — Letto` },
                        { src: '/images/casa-rossa-panoramic.png', alt: `${r.name} — Vista` },
                        { src: '/images/villa-buontalenti.png', alt: `${r.name} — Dettaglio` }
                    ],
                    [
                        { src: '/images/campi-grano.png', alt: `${r.name} — Vista Colline` },
                        { src: '/images/casa-rossa-panoramic.png', alt: `${r.name} — Panorama` },
                        { src: '/images/villa-buontalenti.png', alt: `${r.name} — Esterno` }
                    ],
                    [
                        { src: '/images/casa-rossa-interni.png', alt: `${r.name} — Interni` },
                        { src: '/images/cucina-nomade.png', alt: `${r.name} — Angolo` },
                        { src: '/images/olio-extravergine.png', alt: `${r.name} — Dettaglio` }
                    ],
                    [
                        { src: '/images/hero-drone.png', alt: `${r.name} — Vista Drone` },
                        { src: '/images/casa-rossa-panoramic.png', alt: `${r.name} — Panorama` },
                        { src: '/images/campi-grano.png', alt: `${r.name} — Paesaggio` }
                    ]
                ];
                return {
                    id: ['avorio', 'verde', 'rosa', 'albicocca'][idx],
                    name: r.name,
                    bgColor: baseColors[idx],
                    description: r.description,
                    longDescription: r.longDescription,
                    bedType: r.bedType,
                    surface: r.surface,
                    floor: r.floor,
                    view: r.view,
                    highlights: r.highlights,
                    amenities: r.amenities,
                    photos: photoSets[idx],
                };
            }),
        },
        osservatorio: {
            label: t('Ospitalita.sections.osservatorio.label'),
            titleHtml: t.rich('Ospitalita.sections.osservatorio.titleHtml', {
                emClass: (chunks: React.ReactNode) => <em>{chunks}</em>,
            }),
            introText: t('Ospitalita.sections.osservatorio.introText'),
            cta: {
                buttonLabel: t('Ospitalita.sections.osservatorio.cta.buttonLabel'),
            },
        },
    },
});
