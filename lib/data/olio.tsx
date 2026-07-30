import React from 'react';
import type { OlioContent } from '@/lib/content/types';

export type { OlioContent as OlioData };

export const getOlioData = (t: any): OlioContent => ({
    closeUrl: '/#02-prodotti',
    closeLabel: t('UI.closeLabel'),
    bottles: (t.raw('Olio.bottles') as any[]).map((bottle) => ({
        ...bottle,
        image: {
            src: bottle.image?.src || '',
            alt: bottle.image?.alt || bottle.name,
        },
    })),
    order: t.raw('Olio.order'),
    acts: {
        act1: {
            label: t('Olio.acts.act1.label'),
            titleHtml: t.rich('Olio.acts.act1.titleHtml', {
                br: () => <br />,
                emClass: (chunks: React.ReactNode) => <em className="italic text-[var(--grano)] font-light">{chunks}</em>,
            }),
            introText: t('Olio.acts.act1.introText'),
            images: {
                background: { src: '/images/olio-extravergine-16-9.webp', alt: t('Olio.acts.act1.images.background.alt') },
            },
        },
        act2: {
            label: t('Olio.acts.act2.label'),
            titleHtml: t.rich('Olio.acts.act2.titleHtml', {
                br: () => <br />,
                emClass: (chunks: React.ReactNode) => <em className="italic text-[var(--grano)]">{chunks}</em>,
            }),
            paragraphs: t.raw('Olio.acts.act2.paragraphs') as string[],
            images: {
                primary: {
                    src: '/images/campi-grano-16-9.webp',
                    alt: t('Olio.acts.act2.images.primary.alt'),
                    overlayText: t('Olio.acts.act2.images.primary.overlayText'),
                },
            },
        },
        act3: {
            label: t('Olio.acts.act3.label'),
            titleHtml: t.rich('Olio.acts.act3.titleHtml', {
                br: () => <br />,
            }),
            timelineSteps: t.raw('Olio.acts.act3.timelineSteps') as { title: string; text: string }[],
        },
        act4: {
            label: t('Olio.acts.act4.label'),
            quoteHtml: t.rich('Olio.acts.act4.quoteHtml', {
                br: () => <br className="hidden md:block" />,
                emClass1: (chunks: React.ReactNode) => <em className="text-[var(--mucco-pisano)]">{chunks}</em>,
                emClass2: (chunks: React.ReactNode) => <em className="text-[var(--olive)]">{chunks}</em>,
            }),
            description: t('Olio.acts.act4.description'),
            formatsTitle: t('Olio.acts.act4.formatsTitle'),
            formats: t.raw('Olio.acts.act4.formats') as { name: string; size: string; idealFor: string }[],
            images: {
                primary: { src: '/images/olio-extravergine.webp', alt: t('Olio.acts.act4.images.primary.alt') },
                gallery: t.raw('Olio.acts.act4.images.gallery') as { src: string; alt: string }[],
            },
        },
        act5: {
            images: {
                background: { src: '/images/campi-grano-16-9.webp', alt: t('Olio.acts.act5.images.background.alt') },
            },
            awards: t.raw('Olio.acts.act5.awards') as { year: string; name: string }[],
            cta: {
                titleHtml: t.rich('Olio.acts.act5.cta.titleHtml', {
                    br: () => <br />,
                    emClass: (chunks: React.ReactNode) => <em className="italic text-[var(--sabbia-limonitica)] font-light">{chunks}</em>,
                }),
                buttonLabel: t('Olio.acts.act5.cta.buttonLabel'),
            },
        },
    },
});
