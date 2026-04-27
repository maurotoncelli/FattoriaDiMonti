import React from 'react';
import type { MuccoPisanoContent } from '@/lib/content/types';

export type { MuccoPisanoContent as MuccoPisanoData };

export const getMuccoPisanoData = (t: any): MuccoPisanoContent => ({
    closeUrl: '/#02-prodotti',
    closeLabel: t('UI.closeLabel'),
    hero: {
        label: t('MuccoPisano.hero.label'),
        titleHtml: t.rich('MuccoPisano.hero.titleHtml', {
            br: () => <br />,
            emClass: (chunks: React.ReactNode) => <em className="text-[var(--olive)]">{chunks}</em>,
        }),
        introText: t('MuccoPisano.hero.introText'),
        images: {
            background: { src: '/images/mucco-pisano.png', alt: t('MuccoPisano.hero.label') },
        },
    },
    caratteristiche: {
        label: t('MuccoPisano.caratteristiche.label'),
        quoteHtml: <React.Fragment>{t('MuccoPisano.caratteristiche.quoteHtml')}</React.Fragment>,
        items: (t.raw('MuccoPisano.caratteristiche.items') as { title: string; body: string }[]),
    },
    tagli: {
        label: t('MuccoPisano.tagli.label'),
        titleHtml: t.rich('MuccoPisano.tagli.titleHtml', {
            br: () => <br />,
            emClass: (chunks: React.ReactNode) => <em className="text-[var(--olive)]">{chunks}</em>,
        }),
        bodyText: t('MuccoPisano.tagli.bodyText'),
        ctaLabel: t('MuccoPisano.tagli.ctaLabel'),
        images: {
            primary: { src: '/images/mucco-pisano-16-9.png', alt: t('MuccoPisano.tagli.titleHtml') },
        },
    },
    essiccata: {
        label: t('MuccoPisano.essiccata.label'),
        titleHtml: t.rich('MuccoPisano.essiccata.titleHtml', {
            br: () => <br />,
            emClass: (chunks: React.ReactNode) => <em className="text-[var(--olive)]">{chunks}</em>,
        }),
        bodyText: t('MuccoPisano.essiccata.bodyText'),
        images: {
            primary: { src: '/images/mucco-pisano.png', alt: t('MuccoPisano.essiccata.label') },
        },
        products: (t.raw('MuccoPisano.essiccata.products') as any[]).map((p: any) => ({
            id: p.id,
            name: p.name,
            subtitle: p.subtitle,
            description: p.description,
            tags: p.tags,
            labelColor: p.labelColor,
            glowColor: p.glowColor,
            ctaLabel: p.ctaLabel,
            image: {
                src: p.image.src,
                alt: p.image.alt,
            },
        })),
    },
    cucina: {
        titleHtml: t.rich('MuccoPisano.cucina.titleHtml', {
            em: (chunks: React.ReactNode) => <em>{chunks}</em>,
        }),
        bodyText: t('MuccoPisano.cucina.bodyText'),
        ctaLabel: t('MuccoPisano.cucina.ctaLabel'),
        images: {
            primary: { src: '/images/cucina-nomade.png', alt: t('MuccoPisano.cucina.ctaLabel') },
        },
    },
});
