import React from 'react';
import type { ProductSlideContent } from '@/lib/content/types';

export type { ProductSlideContent as ProductSlideData };

/** Static media & layout config — text comes from translations */
const SLIDES_CONFIG = [
    {
        id: 'slide-mucco-pisano',
        bgColor: 'var(--terra-nera)',
        theme: 'dark' as const,
        media: { textureSrc: '/images/mucco-pisano-gregge.webp' },
        cta: { href: '/mucco-pisano' },
    },
    {
        id: 'slide-cucina-nomade',
        bgColor: 'var(--notte)',
        theme: 'dark' as const,
        media: { textureSrc: '/images/cucina-nomade-hero.jpg' },
        cta: { action: 'concierge', actionTarget: 'cucina-nomade' },
    },
    {
        id: 'slide-olio',
        bgColor: 'var(--sabbia-limonitica)',
        theme: 'light' as const,
        media: { textureSrc: '/images/olio-extravergine-16-9.webp' },
        cta: { href: '/olio' },
    },
];

export const getProductsData = (t: any): ProductSlideContent[] =>
    SLIDES_CONFIG.map((config) => {
        const slide = t.raw(`Home.products.slides.${config.id}`) as any;
        return {
            id: config.id,
            bgColor: config.bgColor,
            theme: config.theme,
            media: config.media,
            label: slide.label,
            title: slide.title,
            titleItalic: slide.titleItalic,
            body: t.rich(`Home.products.slides.${config.id}.body`, {
                br: () => <br />,
                emClass: (chunks: React.ReactNode) => (
                    <em style={{ fontFamily: 'var(--font-playfair)' }}>{chunks}</em>
                ),
            }),
            extra: slide.extra
                ? (slide.extra as string[]).map((item: string) => (
                      <span
                          key={item}
                          style={{
                              display: 'block',
                              fontFamily: 'var(--font-inter)',
                              fontSize: '11px',
                              letterSpacing: '0.12em',
                              color: config.theme === 'dark' ? 'rgba(236,232,223,0.7)' : 'var(--mucco-pisano)',
                          }}
                      >
                          ✦ {item}
                      </span>
                  ))
                : undefined,
            cta: {
                label: slide.cta.label,
                ...config.cta,
            },
        };
    });
