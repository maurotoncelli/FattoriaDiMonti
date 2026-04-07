import React from 'react';
import type { FilieraContent } from '@/lib/content/types';

export type { FilieraContent as FilieraData };

export const getFilieraData = (t: any): FilieraContent => ({
    closeUrl: '/#02-prodotti',
    closeLabel: t('UI.closeLabel'),
    acts: {
        act1: {
            label: t('LaFiliera.acts.act1.label'),
            titleHtml: t.rich('LaFiliera.acts.act1.titleHtml', {
                br: () => <br />,
                emClass: (chunks: React.ReactNode) => <em className="italic text-[#B4B886] font-light">{chunks}</em>,
            }),
            introText: t('LaFiliera.acts.act1.introText'),
            images: {
                background: { src: '/images/campi-grano-16-9.png', alt: 'Campi e Colline della Fattoria' },
            },
        },
        act2: {
            label: t('LaFiliera.acts.act2.label'),
            titleHtml: t.rich('LaFiliera.acts.act2.titleHtml', {
                br: () => <br />,
                emClass: (chunks: React.ReactNode) => <em className="italic text-[#B4B886] font-light">{chunks}</em>,
            }),
            timelineSteps: t.raw('LaFiliera.acts.act2.timelineSteps') as { title: string; text: string }[],
        },
        act3: {
            label: t('LaFiliera.acts.act3.label'),
            titleHtml: t.rich('LaFiliera.acts.act3.titleHtml', {
                br: () => <br />,
                emClass: (chunks: React.ReactNode) => <em className="italic text-[#B4B886]">{chunks}</em>,
            }),
            paragraphs: t.raw('LaFiliera.acts.act3.paragraphs') as string[],
            gallery: t.raw('LaFiliera.acts.act3.gallery') as { src: string; alt: string; caption: string }[],
        },
        act4: {
            label: t('LaFiliera.acts.act4.label'),
            quoteHtml: t.rich('LaFiliera.acts.act4.quoteHtml', {
                br: () => <br />,
                brResp: () => <br className="hidden md:block" />,
                emClass1: (chunks: React.ReactNode) => <em className="text-[var(--argilla-ferrosa)]">{chunks}</em>,
                emClass2: (chunks: React.ReactNode) => <em className="text-[var(--sabbia-limonitica, #C8B47A)]">{chunks}</em>,
            }),
            images: {
                primary: { src: '/images/olio-extravergine-16-9.png', alt: 'Terroir della Fattoria' },
            },
        },
        act5: {
            images: {
                background: { src: '/images/campi-grano-16-9.png', alt: 'Fattoria di Monti Estate' },
            },
            cta: {
                titleHtml: t.rich('LaFiliera.acts.act5.cta.titleHtml', {
                    br: () => <br />,
                    emClass: (chunks: React.ReactNode) => <em className="italic text-[#D4A361] font-light">{chunks}</em>,
                }),
                buttonLabel: t('LaFiliera.acts.act5.cta.buttonLabel'),
                href: '/ospitalita',
            },
        },
    },
});
