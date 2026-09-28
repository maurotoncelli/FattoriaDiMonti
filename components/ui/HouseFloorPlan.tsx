'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { CasaFloor, CasaGalleryPhoto, CasaSpace } from '@/lib/content/types';

interface HouseFloorPlanProps {
    floor: CasaFloor;
    activeRoom: number | null;
    onSelectRoom: (n: number | null) => void;
    onOpenPhotos: (photos: CasaGalleryPhoto[], index: number, eyebrow: string) => void;
    closeAria: string;
}

/** Distanza dell'anteprima dal centro del cerchio (raggio + respiro) */
const POP_GAP = '22px';

/**
 * Piantina di un livello della Casa Rossa. Le linee arrivano dal gruppo `muri`
 * dell'SVG in public/, unica copia del disegno; i numeri sono pulsanti HTML
 * sovrapposti, a dimensione fissa, che aprono l'anteprima della stanza.
 * Gli elementi con `data-room-ui` non chiudono l'anteprima al clic (vedi pagina).
 */
export default function HouseFloorPlan({ floor, activeRoom, onSelectRoom, onOpenPhotos, closeAria }: HouseFloorPlanProps) {
    const { plan, spaces } = floor;
    const [minX, minY, width, height] = plan.viewBox.split(' ').map(Number);
    const place = (x: number, y: number) => ({ left: ((x - minX) / width) * 100, top: ((y - minY) / height) * 100 });

    const activeMarker = plan.rooms.find((r) => r.n === activeRoom);
    const activeSpace = spaces.find((s) => s.n === activeRoom);

    return (
        <div className="relative mx-auto w-full" style={{ maxWidth: `calc(80vh * ${width / height})` }}>
            <div className="relative" style={{ aspectRatio: `${width} / ${height}` }}>
                <svg viewBox={plan.viewBox} className="absolute inset-0 h-full w-full" aria-hidden="true">
                    <use href={`${plan.src}#muri`} />
                </svg>
                {plan.rooms.map(({ n, x, y }) => {
                    const space = spaces.find((s) => s.n === n);
                    const { left, top } = place(x, y);
                    const active = n === activeRoom;
                    return (
                        <button
                            key={n}
                            type="button"
                            data-room-ui
                            aria-label={space?.openAria}
                            aria-expanded={active}
                            aria-controls={active ? `room-preview-${n}` : undefined}
                            onClick={() => onSelectRoom(active ? null : n)}
                            className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--argilla-ferrosa)] font-inter text-[10px] leading-none transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--argilla-ferrosa)] sm:h-7 sm:w-7 sm:text-[11px] ${
                                active
                                    ? 'z-10 bg-[var(--argilla-ferrosa)] text-[var(--tufo)]'
                                    : 'bg-[var(--tufo)] text-[var(--argilla-ferrosa)] hover:bg-[var(--argilla-ferrosa)] hover:text-[var(--tufo)]'
                            }`}
                            style={{ left: `${left}%`, top: `${top}%` }}
                        >
                            {n}
                        </button>
                    );
                })}
            </div>

            {activeMarker && activeSpace && activeSpace.photos.length > 0 && (
                <RoomPreview
                    key={activeSpace.n}
                    space={activeSpace}
                    {...place(activeMarker.x, activeMarker.y)}
                    closeAria={closeAria}
                    onClose={() => onSelectRoom(null)}
                    onOpenPhotos={onOpenPhotos}
                />
            )}
        </div>
    );
}

interface RoomPreviewProps {
    space: CasaSpace;
    /** Posizione del cerchio in percentuale della piantina */
    left: number;
    top: number;
    closeAria: string;
    onClose: () => void;
    onOpenPhotos: HouseFloorPlanProps['onOpenPhotos'];
}

/**
 * Da `sm` in su è un riquadro accanto al numero, dal lato con più spazio;
 * su mobile scende sotto la piantina, nel flusso.
 */
function RoomPreview({ space, left, top, closeAria, onClose, onOpenPhotos }: RoomPreviewProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [cover, ...others] = space.photos;
    const open = (index: number) => onOpenPhotos(space.photos, index, space.name);

    const toRight = left < 50;
    const below = top < 55;
    const anchor = {
        '--pop-l': toRight ? `calc(${left}% + ${POP_GAP})` : 'auto',
        '--pop-r': toRight ? 'auto' : `calc(${100 - left}% + ${POP_GAP})`,
        '--pop-t': below ? `calc(${top}% - ${POP_GAP})` : 'auto',
        '--pop-b': below ? 'auto' : `calc(${100 - top}% - ${POP_GAP})`,
    } as React.CSSProperties;

    // Su mobile l'anteprima sta sotto la piantina: se aperta dalla legenda può
    // essere fuori schermo. Lenis anima solo la rotellina, su touch lo scroll nativo è sicuro.
    // `scroll-mb-32` la tiene sopra il pulsante di chiusura fisso della pagina.
    useEffect(() => {
        if (!window.matchMedia('(max-width: 639px)').matches) return;
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        ref.current?.scrollIntoView({ block: 'nearest', behavior: smooth ? 'smooth' : 'auto' });
    }, []);

    return (
        <div
            ref={ref}
            id={`room-preview-${space.n}`}
            data-room-ui
            role="dialog"
            aria-label={space.name}
            style={anchor}
            className="relative z-20 mt-5 w-full scroll-mb-32 overflow-hidden rounded-sm border border-[var(--argilla-ferrosa)]/30 bg-[var(--tufo)] shadow-[0_18px_40px_-18px_rgba(45,40,35,0.45)] motion-safe:animate-[room-preview-in_220ms_ease-out] sm:absolute sm:mt-0 sm:w-64 sm:[bottom:var(--pop-b)] sm:[left:var(--pop-l)] sm:[right:var(--pop-r)] sm:[top:var(--pop-t)]"
        >
            <button type="button" onClick={() => open(0)} className="group relative block aspect-[3/2] w-full overflow-hidden">
                <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(min-width: 640px) 256px, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </button>
            <button
                type="button"
                aria-label={closeAria}
                onClick={onClose}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--tufo)]/90 text-[var(--mucco-pisano)] transition-colors hover:bg-[var(--tufo)]"
            >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
            </button>

            <div className="p-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--argilla-ferrosa)] font-inter text-[10px] leading-none text-[var(--tufo)]">
                        {space.n}
                    </span>
                    <span className="font-playfair text-lg leading-tight text-[var(--mucco-pisano)]">{space.name}</span>
                </div>

                {others.length > 0 && (
                    <div className="mt-3 flex gap-1.5">
                        {others.map((photo, i) => (
                            <button
                                key={photo.id}
                                type="button"
                                aria-label={photo.alt}
                                onClick={() => open(i + 1)}
                                className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-[2px] opacity-90 transition-opacity hover:opacity-100"
                            >
                                <Image src={photo.src} alt="" fill sizes="40px" className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => open(0)}
                    className="mt-4 inline-flex items-center gap-2 font-inter text-[10px] uppercase tracking-[0.18em] text-[var(--argilla-ferrosa)] transition-opacity hover:opacity-70"
                >
                    {space.photosLabel}
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
