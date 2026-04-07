import React from 'react';
import type { StoriaContent } from '@/lib/content/types';

export type { StoriaContent as StoriaData };

export const getStoriaData = (t: any): StoriaContent => ({
    closeUrl: '/#01-storia-terroir',
    closeLabel: t('UI.closeLabel'),
    chapterLabel: t('Storia.chapterLabel'),
    titleHtml: t.rich('Storia.titleHtml', {
        br: () => <br />,
        emClass: (chunks: React.ReactNode) => <em className="text-[var(--olive)]">{chunks}</em>,
    }),
    paragraphs: [
        t.rich('Storia.paragraphs.0', {
            dropCap: (chunks: React.ReactNode) => (
                <span className="float-left text-7xl font-playfair leading-[0.8] mr-5 text-[var(--olive)] mt-[-4px]">{chunks}</span>
            ),
            strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
        }),
        <React.Fragment key="p1">{t('Storia.paragraphs.1')}</React.Fragment>,
        <React.Fragment key="p2">{t('Storia.paragraphs.2')}</React.Fragment>,
    ],
    quote: <React.Fragment>{t('Storia.quote')}</React.Fragment>,
    legendText: <React.Fragment>{t('Storia.legendText')}</React.Fragment>,
    legendLink: {
        text: t('Storia.legendLink.text'),
        tooltip: t('Storia.legendLink.tooltip'),
    },
    legendSuffix: t('Storia.legendSuffix'),
    images: {
        primary: { src: '/images/villa-buontalenti.png', alt: t('Storia.images.primary.alt') },
        secondary: { src: '/images/villa-buontalenti.png', alt: t('Storia.images.secondary.alt') },
    },
});
