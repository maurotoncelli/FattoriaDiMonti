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
            rooms: [
                {
                    id: 'avorio',
                    name: t('Ospitalita.sections.stanze.rooms.0.name'),
                    bgColor: '#F5F2EB',
                    description: t('Ospitalita.sections.stanze.rooms.0.description'),
                    photos: [
                        { src: '/images/casa-rossa-interni.png', alt: `${t('Ospitalita.sections.stanze.rooms.0.name')} — Letto` },
                        { src: '/images/casa-rossa-panoramic.png', alt: `${t('Ospitalita.sections.stanze.rooms.0.name')} — Vista` },
                        { src: '/images/villa-buontalenti.png', alt: `${t('Ospitalita.sections.stanze.rooms.0.name')} — Dettaglio` },
                    ],
                },
                {
                    id: 'verde',
                    name: t('Ospitalita.sections.stanze.rooms.1.name'),
                    bgColor: '#DDE2DB',
                    description: t('Ospitalita.sections.stanze.rooms.1.description'),
                    photos: [
                        { src: '/images/campi-grano.png', alt: `${t('Ospitalita.sections.stanze.rooms.1.name')} — Vista Colline` },
                        { src: '/images/casa-rossa-panoramic.png', alt: `${t('Ospitalita.sections.stanze.rooms.1.name')} — Panorama` },
                        { src: '/images/villa-buontalenti.png', alt: `${t('Ospitalita.sections.stanze.rooms.1.name')} — Esterno` },
                    ],
                },
                {
                    id: 'rosa',
                    name: t('Ospitalita.sections.stanze.rooms.2.name'),
                    bgColor: '#EAD7D6',
                    description: t('Ospitalita.sections.stanze.rooms.2.description'),
                    photos: [
                        { src: '/images/casa-rossa-interni.png', alt: `${t('Ospitalita.sections.stanze.rooms.2.name')} — Interni` },
                        { src: '/images/cucina-nomade.png', alt: `${t('Ospitalita.sections.stanze.rooms.2.name')} — Angolo` },
                        { src: '/images/olio-extravergine.png', alt: `${t('Ospitalita.sections.stanze.rooms.2.name')} — Dettaglio` },
                    ],
                },
                {
                    id: 'albicocca',
                    name: t('Ospitalita.sections.stanze.rooms.3.name'),
                    bgColor: '#F3E2CF',
                    description: t('Ospitalita.sections.stanze.rooms.3.description'),
                    photos: [
                        { src: '/images/hero-drone.png', alt: `${t('Ospitalita.sections.stanze.rooms.3.name')} — Vista Drone` },
                        { src: '/images/casa-rossa-panoramic.png', alt: `${t('Ospitalita.sections.stanze.rooms.3.name')} — Panorama` },
                        { src: '/images/campi-grano.png', alt: `${t('Ospitalita.sections.stanze.rooms.3.name')} — Paesaggio` },
                    ],
                },
            ],
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
