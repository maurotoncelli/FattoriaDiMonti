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
                background: { src: '/images/casa-rossa-panoramic.webp', alt: t('Ospitalita.sections.hero.label') },
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
                primary: {
                    src: '',
                    alt: t('Ospitalita.sections.calore.images.primary.alt'),
                    overlayText: t('Ospitalita.sections.calore.images.primary.overlayText'),
                },
            },
        },
        galleria: {
            titleHtml: t.rich('Ospitalita.sections.galleria.titleHtml', {
                br: () => <br />,
                brResp: () => <br className="hidden md:block" />,
                emClass: (chunks: React.ReactNode) => <em className="text-[var(--olive)]">{chunks}</em>,
            }),
            scrollHint: t('Ospitalita.sections.galleria.scrollHint'),
            items: (t.raw('Ospitalita.sections.galleria.items') as { alt: string; overlayText: string }[]).map(
                (item, i) => ({
                    src: [
                        '/images/casa-rossa-interni.webp',
                        '/images/cucina-nomade.webp',
                        '/images/casa-rossa-panoramic.webp',
                        '/images/villa-buontalenti.webp',
                        '/images/cucina-nomade-hero.jpg',
                    ][i],
                    alt: item.alt,
                    overlayText: item.overlayText,
                    aspect: (['3/2', '2/3', '3/2', '2/3', '3/2'] as const)[i],
                })
            ),
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
                const pl = t.raw('Ospitalita.sections.stanze.photoLabels') as Record<string, string>;
                const photoSets = [
                    [
                        { src: '/images/casa-rossa-interni.webp', alt: `${r.name} — ${pl.letto}` },
                        { src: '/images/casa-rossa-panoramic.webp', alt: `${r.name} — ${pl.vista}` },
                        { src: '/images/villa-buontalenti.webp', alt: `${r.name} — ${pl.dettaglio}` }
                    ],
                    [
                        { src: '/images/campi-grano.webp', alt: `${r.name} — ${pl.colline}` },
                        { src: '/images/casa-rossa-panoramic.webp', alt: `${r.name} — ${pl.panorama}` },
                        { src: '/images/villa-buontalenti.webp', alt: `${r.name} — ${pl.esterno}` }
                    ],
                    [
                        { src: '/images/casa-rossa-interni.webp', alt: `${r.name} — ${pl.interni}` },
                        { src: '/images/cucina-nomade.webp', alt: `${r.name} — ${pl.angolo}` },
                        { src: '/images/olio-extravergine.webp', alt: `${r.name} — ${pl.dettaglio}` }
                    ],
                    [
                        { src: '/images/hero-drone.webp', alt: `${r.name} — ${pl.drone}` },
                        { src: '/images/casa-rossa-panoramic.webp', alt: `${r.name} — ${pl.panorama}` },
                        { src: '/images/campi-grano.webp', alt: `${r.name} — ${pl.paesaggio}` }
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
