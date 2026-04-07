import React from 'react';
import type { CerealiContent } from '@/lib/content/types';

export type { CerealiContent as CerealiData };

export const getCerealiData = (t: any): CerealiContent => ({
    closeUrl: '/#02-prodotti',
    closeLabel: t('UI.closeLabel'),
    hero: {
        label: t('Cereali.hero.label'),
        titleHtml: t.rich('Cereali.hero.titleHtml', {
            br: () => <br />,
            emClass: (chunks: React.ReactNode) => <em className="text-[var(--tufo)] opacity-90 font-light">{chunks}</em>,
        }),
        introText: t('Cereali.hero.introText'),
    },
    transition: {
        quote1: t('Cereali.transition.quote1'),
        quote2: t('Cereali.transition.quote2'),
    },
    filosofia: {
        title: t('Cereali.filosofia.title'),
        paragraphs: (t.raw('Cereali.filosofia.paragraphs') as string[]),
        conclusionHtml: <React.Fragment>{t('Cereali.filosofia.conclusionHtml')}</React.Fragment>,
    },
    images: {
        background: { src: '/images/campi-grano-16-9.png', alt: t('Cereali.images.background.alt') },
    },
});
