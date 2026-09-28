'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image, { getImageProps } from 'next/image';

export interface LightboxPhoto {
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    /** Riga sopra il contatore (es. l'area della casa) */
    eyebrow?: string;
}

interface GalleryLightboxProps {
    photos: LightboxPhoto[];
    index: number;
    labels: { closeAria: string; prevAria: string; nextAria: string };
    /** Passo relativo (+1 / -1): il genitore aggiorna l'indice con un update funzionale */
    onStep: (delta: number) => void;
    onClose: () => void;
}

const SWIPE_PX = 50;

const lightboxSizes = (ratio: number) => (ratio >= 1 ? '92vw' : '(orientation: portrait) 92vw, 50vw');

// Scalda la cache del browser con la stessa variante che userà <Image>:
// passando alla foto successiva non resta mai un riquadro vuoto.
function preload(photo: LightboxPhoto) {
    const { props } = getImageProps({
        src: photo.src,
        alt: '',
        fill: true,
        sizes: lightboxSizes(photo.width / photo.height),
    });
    const img = new window.Image();
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
}

export default function GalleryLightbox({ photos, index, labels, onStep, onClose }: GalleryLightboxProps) {
    const closeRef = useRef<HTMLButtonElement>(null);
    const touchStartX = useRef<number | null>(null);
    const total = photos.length;
    const photo = photos[index];
    const ratio = photo.width / photo.height;

    const go = useCallback((delta: number) => {
        if (total > 1) onStep(delta);
    }, [total, onStep]);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        closeRef.current?.focus({ preventScroll: true });
        return () => previouslyFocused?.focus?.({ preventScroll: true });
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') go(1);
            else if (e.key === 'ArrowLeft') go(-1);
            else if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [go, onClose]);

    useEffect(() => {
        if (total < 2) return;
        preload(photos[(index + 1) % total]);
        preload(photos[(index - 1 + total) % total]);
    }, [index, photos, total]);

    const navButton = 'absolute top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full border border-[rgba(236,232,223,0.2)] bg-[rgba(20,16,14,0.35)] text-[var(--tufo)] transition-colors hover:bg-[rgba(236,232,223,0.12)]';

    // Portal su body: dentro il <main> (z-10) la lightbox finirebbe sotto la navbar fissa.
    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={photo.alt}
            className="fixed inset-0 z-[200] flex items-center justify-center select-none"
            style={{ background: 'rgba(20,16,14,0.96)', animation: 'fdm-fade-in 0.3s ease-out' }}
            onClick={onClose}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
            }}
        >
            <div className="pointer-events-none absolute left-0 right-0 top-6 flex flex-col items-center gap-1.5 px-20 text-center">
                {photo.eyebrow && (
                    <span className="font-inter text-[10px] uppercase tracking-[0.25em] text-[rgba(236,232,223,0.6)]">
                        {photo.eyebrow}
                    </span>
                )}
                <span className="font-inter text-[10px] tracking-[0.25em] text-[rgba(236,232,223,0.4)] tabular-nums">
                    {index + 1} / {total}
                </span>
            </div>

            <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={labels.closeAria}
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-[rgba(236,232,223,0.6)] transition-colors hover:text-[var(--tufo)] md:right-8 md:top-6"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>

            <figure className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <div
                    key={photo.id}
                    className="relative"
                    style={{
                        // Sempre dentro lo schermo, senza ritagli: il lato limitante
                        // è la larghezza (orizzontali) o l'altezza (verticali).
                        width: `min(92vw, calc(72vh * ${ratio}))`,
                        aspectRatio: `${photo.width} / ${photo.height}`,
                        animation: 'fdm-fade-in 0.35s ease-out',
                    }}
                >
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes={lightboxSizes(ratio)}
                        className="object-contain"
                        priority
                    />
                </div>
                <figcaption className="mt-5 max-w-[84vw] text-center font-playfair text-base italic text-[var(--tufo)] opacity-85 md:text-lg">
                    {photo.alt}
                </figcaption>
            </figure>

            {total > 1 && (
                <>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); go(-1); }}
                        aria-label={labels.prevAria}
                        className={`${navButton} left-3 md:left-8`}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                            <path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); go(1); }}
                        aria-label={labels.nextAria}
                        className={`${navButton} right-3 md:right-8`}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                            <path d="M7 3L13 9L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </>
            )}
        </div>,
        document.body
    );
}
