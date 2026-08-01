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
                background: { src: '/images/casa-rossa/facade-01.webp', alt: t('Ospitalita.sections.hero.label') },
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
                    src: '/images/casa-rossa/fireplace.webp',
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
                (item, i) => {
                    const slides: { src: string; aspect: '3/2' | '2/3' }[] = [
                        { src: '/images/casa-rossa-interni.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/facade-vertical.webp', aspect: '2/3' },
                        { src: '/images/casa-rossa/kitchen.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/pool-vertical.webp', aspect: '2/3' },
                        { src: '/images/casa-rossa/reading.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/fireplace.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/room1.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/facade-vertical-ab.webp', aspect: '2/3' },
                        { src: '/images/casa-rossa/room2.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/pool-vertical-01.webp', aspect: '2/3' },
                        { src: '/images/casa-rossa-panoramic.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/room3.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/bathroom-gf.webp', aspect: '2/3' },
                        { src: '/images/casa-rossa/stairs.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/room4.webp', aspect: '3/2' },
                        { src: '/images/casa-rossa/aerial.webp', aspect: '3/2' },
                    ];
                    const slide = slides[i] ?? slides[0];
                    return {
                        src: slide.src,
                        alt: item.alt,
                        overlayText: item.overlayText,
                        aspect: slide.aspect,
                    };
                }
            ),
            indicator: {
                exploreText: t('Ospitalita.sections.galleria.indicator.exploreText'),
                scrollText: t('Ospitalita.sections.galleria.indicator.scrollText'),
            },
        },
        casa: {
            label: t('Ospitalita.sections.casa.label'),
            titleHtml: t.rich('Ospitalita.sections.casa.titleHtml', {
                emClass: (chunks: React.ReactNode) => <em>{chunks}</em>,
            }),
            introText: t('Ospitalita.sections.casa.introText'),
            planNote: t('Ospitalita.sections.casa.planNote'),
            floors: t.raw('Ospitalita.sections.casa.floors') as { id: string; name: string; description: string; spaces: string[] }[],
            photosTitle: t('Ospitalita.sections.casa.photosTitle'),
            photoAria: t('Ospitalita.sections.casa.photoAria'),
            photos: (t.raw('Ospitalita.sections.casa.photos') as { alt: string }[]).map((p, i) => ({
                src: [
                    '/images/casa-rossa/kitchen.webp',
                    '/images/casa-rossa/room1.webp',
                    '/images/casa-rossa/aerial.webp',
                    '/images/casa-rossa-interni.webp',
                    '/images/casa-rossa/pool-drone.webp',
                    '/images/casa-rossa-panoramic.webp',
                ][i],
                alt: p.alt,
            })),
            amenities: t.raw('Ospitalita.sections.casa.amenities') as {
                title: string;
                intro: string;
                groups: { title: string; items: { icon: string; label: string }[] }[];
            },
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
