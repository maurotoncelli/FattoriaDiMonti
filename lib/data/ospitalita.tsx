import React from 'react';
import type {
    CasaFloor,
    CasaGalleryGroupId,
    CasaGalleryPhoto,
    OspitalitaContent,
} from '@/lib/content/types';

export type { OspitalitaContent as OspitalitaData };

const GALLERY_DIR = '/images/casa-rossa/galleria';

const GROUP_ORDER: CasaGalleryGroupId[] = ['esterni', 'piano-terra', 'piano-superiore', 'terrazza'];

/**
 * Tutte le foto della Casa Rossa (shooting 2026, "JPEG nomi sito"), in ordine di
 * visita: arrivo, piano terra, piano superiore, terrazza. L'id è anche il nome
 * del file WebP e la chiave della didascalia in `Ospitalita.sections.galleria.photos`.
 */
const CASA_PHOTOS: { id: string; group: CasaGalleryGroupId; width: number; height: number }[] = [
    { id: 'ext-facciata-prato', group: 'esterni', width: 2000, height: 1333 },
    { id: 'ext-veranda', group: 'esterni', width: 2000, height: 1333 },
    { id: 'ext-vialetto', group: 'esterni', width: 910, height: 1365 },
    { id: 'ext-facciata-veranda', group: 'esterni', width: 2000, height: 1333 },
    { id: 'ext-cielo', group: 'esterni', width: 910, height: 1365 },
    { id: 'ext-grandi-alberi', group: 'esterni', width: 2000, height: 1333 },
    { id: 'ext-cedri', group: 'esterni', width: 910, height: 1365 },
    { id: 'ext-parco', group: 'esterni', width: 2000, height: 1218 },
    { id: 'ext-pergola', group: 'esterni', width: 910, height: 1365 },
    { id: 'ext-prato', group: 'esterni', width: 910, height: 1365 },
    { id: 'ext-edera-torretta', group: 'esterni', width: 910, height: 1365 },
    { id: 'ext-ingresso-edera', group: 'esterni', width: 2000, height: 1333 },
    { id: 'ext-edera', group: 'esterni', width: 2000, height: 1333 },
    { id: 'ext-piscina', group: 'esterni', width: 910, height: 1365 },
    { id: 'ext-piscina-giardino', group: 'esterni', width: 910, height: 1365 },
    { id: 'ext-drone-piscina', group: 'esterni', width: 1823, height: 1365 },
    { id: 'ext-drone-tenuta', group: 'esterni', width: 1823, height: 1365 },
    { id: 'ext-drone-casa', group: 'esterni', width: 1823, height: 1365 },
    { id: 'ext-drone-colline', group: 'esterni', width: 1823, height: 1365 },

    { id: 'pt-salone', group: 'piano-terra', width: 2000, height: 1333 },
    { id: 'pt-salone-luce', group: 'piano-terra', width: 2000, height: 1335 },
    { id: 'pt-sala-camino', group: 'piano-terra', width: 2000, height: 1333 },
    { id: 'pt-lettura', group: 'piano-terra', width: 2000, height: 1333 },
    { id: 'pt-lettura-divani', group: 'piano-terra', width: 2000, height: 1333 },
    { id: 'pt-cucina', group: 'piano-terra', width: 2000, height: 1334 },
    { id: 'pt-cucina-madia', group: 'piano-terra', width: 2000, height: 1335 },
    { id: 'pt-cucina-attrezzata', group: 'piano-terra', width: 2000, height: 1333 },
    { id: 'pt-cucina-giardino', group: 'piano-terra', width: 2000, height: 1333 },
    { id: 'pt-bagno-vasca', group: 'piano-terra', width: 910, height: 1365 },
    { id: 'pt-bagno-maioliche', group: 'piano-terra', width: 2000, height: 1333 },
    { id: 'pt-lavanderia', group: 'piano-terra', width: 2000, height: 1333 },
    { id: 'pt-scala', group: 'piano-terra', width: 2000, height: 1333 },

    { id: 'ps-camera1', group: 'piano-superiore', width: 2000, height: 1334 },
    { id: 'ps-camera1-tappeti', group: 'piano-superiore', width: 2000, height: 1333 },
    { id: 'ps-camera2', group: 'piano-superiore', width: 2000, height: 1335 },
    { id: 'ps-camera2-letto', group: 'piano-superiore', width: 2000, height: 1333 },
    { id: 'ps-camera2-ritratto', group: 'piano-superiore', width: 910, height: 1365 },
    { id: 'ps-camera2-armadio-muro', group: 'piano-superiore', width: 2000, height: 1333 },
    { id: 'ps-camera2-testiera', group: 'piano-superiore', width: 910, height: 1365 },
    { id: 'ps-camera2-armadio', group: 'piano-superiore', width: 910, height: 1365 },
    { id: 'ps-camera2-finestra', group: 'piano-superiore', width: 910, height: 1365 },
    { id: 'ps-camera3', group: 'piano-superiore', width: 2000, height: 1335 },
    { id: 'ps-camera3-specchi', group: 'piano-superiore', width: 2000, height: 1336 },
    { id: 'ps-camera3-lino', group: 'piano-superiore', width: 910, height: 1365 },
    { id: 'ps-camera3-dettaglio', group: 'piano-superiore', width: 910, height: 1365 },
    { id: 'ps-camera4', group: 'piano-superiore', width: 2000, height: 1334 },
    { id: 'ps-camera4-scrittoio', group: 'piano-superiore', width: 2000, height: 1334 },
    { id: 'ps-camera4-letto', group: 'piano-superiore', width: 2000, height: 1333 },
    { id: 'ps-camera4-stampe', group: 'piano-superiore', width: 2000, height: 1333 },
    { id: 'ps-corridoio', group: 'piano-superiore', width: 2000, height: 1334 },
    { id: 'ps-bagno-doccia', group: 'piano-superiore', width: 910, height: 1365 },
    { id: 'ps-bagno-doppio-lavabo', group: 'piano-superiore', width: 2000, height: 1334 },
    { id: 'ps-bagno-finestra', group: 'piano-superiore', width: 914, height: 1365 },
    { id: 'ps-bagno-mosaico', group: 'piano-superiore', width: 910, height: 1365 },
    { id: 'ps-bagno-doccia-mosaico', group: 'piano-superiore', width: 910, height: 1365 },

    { id: 'terrazza-torretta', group: 'terrazza', width: 2000, height: 1333 },
    { id: 'terrazza-campagna', group: 'terrazza', width: 2000, height: 1333 },
    { id: 'terrazza-pini', group: 'terrazza', width: 2000, height: 1333 },
];

export const casaPhotoSrc = (id: string) => `${GALLERY_DIR}/${id}.webp`;

export const getOspitalitaData = (t: any): OspitalitaContent => {
    const groupLabels = t.raw('Ospitalita.sections.galleria.groups') as Record<CasaGalleryGroupId, string>;
    const captions = t.raw('Ospitalita.sections.galleria.photos') as Record<string, string>;

    const photos: CasaGalleryPhoto[] = CASA_PHOTOS.map((p) => ({
        ...p,
        src: casaPhotoSrc(p.id),
        alt: captions[p.id] ?? groupLabels[p.group],
    }));
    const countInGroup = (group: string) => photos.filter((p) => p.group === group).length;

    const floors = (t.raw('Ospitalita.sections.casa.floors') as Omit<CasaFloor, 'photosLabel'>[]).map((floor) => ({
        ...floor,
        photosLabel: t('Ospitalita.sections.casa.floorPhotosLabel', { count: countInGroup(floor.id) }),
    }));

    return {
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
                    background: { src: casaPhotoSrc('ext-facciata-veranda'), alt: t('Ospitalita.sections.hero.label') },
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
                        src: casaPhotoSrc('pt-sala-camino'),
                        alt: t('Ospitalita.sections.calore.images.primary.alt'),
                        overlayText: t('Ospitalita.sections.calore.images.primary.overlayText'),
                    },
                },
            },
            galleria: {
                label: t('Ospitalita.sections.galleria.label', { count: photos.length }),
                titleHtml: t.rich('Ospitalita.sections.galleria.titleHtml', {
                    br: () => <br />,
                    brResp: () => <br className="hidden md:block" />,
                    emClass: (chunks: React.ReactNode) => <em className="text-[var(--olive)]">{chunks}</em>,
                }),
                allLabel: t('Ospitalita.sections.galleria.allLabel'),
                groups: GROUP_ORDER.map((id) => ({
                    id,
                    label: groupLabels[id],
                    photos: photos.filter((p) => p.group === id),
                })),
                lightbox: t.raw('Ospitalita.sections.galleria.lightbox') as OspitalitaContent['sections']['galleria']['lightbox'],
            },
            casa: {
                label: t('Ospitalita.sections.casa.label'),
                titleHtml: t.rich('Ospitalita.sections.casa.titleHtml', {
                    emClass: (chunks: React.ReactNode) => <em>{chunks}</em>,
                }),
                introText: t('Ospitalita.sections.casa.introText'),
                planNote: t('Ospitalita.sections.casa.planNote'),
                floors,
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
    };
};
