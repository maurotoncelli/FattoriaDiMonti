import React from 'react';
import type {
    CasaFloor,
    CasaFloorId,
    CasaFloorPlan,
    CasaGalleryGroupId,
    CasaGalleryPhoto,
    OspitalitaContent,
} from '@/lib/content/types';

export type { OspitalitaContent as OspitalitaData };

const GALLERY_DIR = '/images/casa-rossa/galleria';
const PLAN_DIR = '/images/casa-rossa/piantine';

/**
 * Piantine dei tre livelli, esportate da Illustrator sulla stessa tavola e
 * quindi alla stessa scala. Le coordinate dei cerchi sono quelle del gruppo
 * `numeri` di ciascun SVG: se si sposta un numero nel file, va aggiornato qui.
 * I nomi delle stanze sono in `Ospitalita.sections.casa.rooms`, per numero.
 */
const FLOOR_PLANS: Record<CasaFloorId, CasaFloorPlan> = {
    'piano-terra': {
        src: `${PLAN_DIR}/piano-terra.svg`,
        viewBox: '73.5 -4 420 575',
        rooms: [
            { n: 1, x: 147.4, y: 188.9 },
            { n: 2, x: 325.7, y: 139.6 },
            { n: 3, x: 389.7, y: 54.4 },
            { n: 4, x: 412.6, y: 439.3 },
            { n: 5, x: 196.9, y: 436.5 },
            { n: 6, x: 212.4, y: 338.5 },
            { n: 7, x: 319.8, y: 473.5 },
        ],
    },
    'piano-superiore': {
        src: `${PLAN_DIR}/piano-superiore.svg`,
        viewBox: '84 50 403.5 467',
        rooms: [
            { n: 8, x: 188.1, y: 434.8 },
            { n: 9, x: 258.4, y: 352.1 },
            { n: 10, x: 197.3, y: 95.3 },
            { n: 11, x: 409.6, y: 219.7 },
            { n: 12, x: 341.9, y: 138.9 },
            { n: 13, x: 219, y: 330.3 },
            { n: 14, x: 407.6, y: 303.3 },
        ],
    },
    terrazza: {
        src: `${PLAN_DIR}/terrazza.svg`,
        viewBox: '81 79 405 409',
        rooms: [{ n: 15, x: 289, y: 213.1 }],
    },
};

const GROUP_ORDER: CasaGalleryGroupId[] = ['esterni', 'piano-terra', 'piano-superiore', 'terrazza'];

/**
 * Tutte le foto della Casa Rossa (shooting 2026, "JPEG nomi sito"), in ordine di
 * visita: arrivo, piano terra, piano superiore, terrazza. L'id è anche il nome
 * del file WebP e la chiave della didascalia in `Ospitalita.sections.galleria.photos`.
 * `room` è il numero della stanza nella piantina, preso dalle foto rinominate
 * `punto_<n>_…` (Drive, `Fotografie/foto di mauro/JPEG low`): gli id `camera1…4`
 * non coincidono con i numeri delle camere.
 */
const CASA_PHOTOS: Omit<CasaGalleryPhoto, 'src' | 'alt'>[] = [
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

    { id: 'pt-salone', group: 'piano-terra', room: 3, width: 2000, height: 1333 },
    { id: 'pt-salone-luce', group: 'piano-terra', room: 3, width: 2000, height: 1335 },
    { id: 'pt-sala-camino', group: 'piano-terra', room: 4, width: 2000, height: 1333 },
    { id: 'pt-lettura', group: 'piano-terra', room: 2, width: 2000, height: 1333 },
    { id: 'pt-lettura-divani', group: 'piano-terra', room: 2, width: 2000, height: 1333 },
    { id: 'pt-cucina', group: 'piano-terra', room: 1, width: 2000, height: 1334 },
    { id: 'pt-cucina-madia', group: 'piano-terra', room: 1, width: 2000, height: 1335 },
    { id: 'pt-cucina-attrezzata', group: 'piano-terra', room: 1, width: 2000, height: 1333 },
    { id: 'pt-cucina-giardino', group: 'piano-terra', room: 1, width: 2000, height: 1333 },
    { id: 'pt-bagno-vasca', group: 'piano-terra', room: 5, width: 910, height: 1365 },
    { id: 'pt-bagno-maioliche', group: 'piano-terra', room: 5, width: 2000, height: 1333 },
    { id: 'pt-lavanderia', group: 'piano-terra', room: 6, width: 2000, height: 1333 },
    { id: 'pt-scala', group: 'piano-terra', room: 7, width: 2000, height: 1333 },

    { id: 'ps-camera1', group: 'piano-superiore', room: 14, width: 2000, height: 1334 },
    { id: 'ps-camera1-tappeti', group: 'piano-superiore', room: 14, width: 2000, height: 1333 },
    { id: 'ps-camera2-finestra', group: 'piano-superiore', room: 14, width: 910, height: 1365 },
    { id: 'ps-camera2', group: 'piano-superiore', room: 12, width: 2000, height: 1335 },
    { id: 'ps-camera2-letto', group: 'piano-superiore', room: 12, width: 2000, height: 1333 },
    { id: 'ps-camera2-ritratto', group: 'piano-superiore', room: 12, width: 910, height: 1365 },
    { id: 'ps-camera2-armadio-muro', group: 'piano-superiore', room: 12, width: 2000, height: 1333 },
    { id: 'ps-camera2-testiera', group: 'piano-superiore', room: 12, width: 910, height: 1365 },
    { id: 'ps-camera2-armadio', group: 'piano-superiore', room: 12, width: 910, height: 1365 },
    { id: 'ps-camera3', group: 'piano-superiore', room: 13, width: 2000, height: 1335 },
    { id: 'ps-camera3-specchi', group: 'piano-superiore', room: 13, width: 2000, height: 1336 },
    { id: 'ps-camera3-lino', group: 'piano-superiore', room: 13, width: 910, height: 1365 },
    { id: 'ps-camera3-dettaglio', group: 'piano-superiore', room: 13, width: 910, height: 1365 },
    { id: 'ps-camera4', group: 'piano-superiore', room: 10, width: 2000, height: 1334 },
    { id: 'ps-camera4-scrittoio', group: 'piano-superiore', room: 10, width: 2000, height: 1334 },
    { id: 'ps-camera4-letto', group: 'piano-superiore', room: 10, width: 2000, height: 1333 },
    { id: 'ps-camera4-stampe', group: 'piano-superiore', room: 10, width: 2000, height: 1333 },
    { id: 'ps-corridoio', group: 'piano-superiore', room: 9, width: 2000, height: 1334 },
    { id: 'ps-bagno-doccia', group: 'piano-superiore', room: 11, width: 910, height: 1365 },
    { id: 'ps-bagno-doppio-lavabo', group: 'piano-superiore', room: 8, width: 2000, height: 1334 },
    { id: 'ps-bagno-finestra', group: 'piano-superiore', room: 8, width: 914, height: 1365 },
    { id: 'ps-bagno-mosaico', group: 'piano-superiore', room: 11, width: 910, height: 1365 },
    { id: 'ps-bagno-doccia-mosaico', group: 'piano-superiore', room: 11, width: 910, height: 1365 },

    { id: 'terrazza-torretta', group: 'terrazza', room: 15, width: 2000, height: 1333 },
    { id: 'terrazza-campagna', group: 'terrazza', room: 15, width: 2000, height: 1333 },
    { id: 'terrazza-pini', group: 'terrazza', room: 15, width: 2000, height: 1333 },
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

    const roomNames = t.raw('Ospitalita.sections.casa.rooms') as Record<string, string>;
    const floors: CasaFloor[] = (
        t.raw('Ospitalita.sections.casa.floors') as Pick<CasaFloor, 'id' | 'name' | 'description'>[]
    ).map((floor) => {
        const plan = FLOOR_PLANS[floor.id];
        return {
            ...floor,
            plan,
            spaces: plan.rooms.map(({ n }) => {
                const name = roomNames[n];
                const roomPhotos = photos.filter((p) => p.room === n);
                return {
                    n,
                    name,
                    photos: roomPhotos,
                    photosLabel: t('Ospitalita.sections.casa.roomPhotosLabel', { count: roomPhotos.length }),
                    openAria: t('Ospitalita.sections.casa.roomOpenAria', { n, name }),
                };
            }),
            photosLabel: t('Ospitalita.sections.casa.floorPhotosLabel', { count: countInGroup(floor.id) }),
        };
    });

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
                planHint: t('Ospitalita.sections.casa.planHint'),
                roomCloseAria: t('Ospitalita.sections.casa.roomCloseAria'),
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
