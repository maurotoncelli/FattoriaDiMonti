"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';
import { getOspitalitaData } from '@/lib/data/ospitalita';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

type GalleryItem = { src: string; alt: string; overlayText?: string; aspect?: string };
type PhotoItem = { src: string; alt: string };

function Lightbox({ index, galleryItems, onClose, onPrev, onNext }: {
    index: number;
    galleryItems: GalleryItem[];
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const imgWrapRef = useRef<HTMLDivElement>(null);
    const item = galleryItems[index];
    const total = galleryItems.length;

    // Open animation
    useEffect(() => {
        gsap.fromTo(overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.35, ease: 'power2.out' }
        );
        gsap.fromTo(imgWrapRef.current,
            { scale: 0.92, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' }
        );
    }, []);

    // Image-change animation
    useEffect(() => {
        gsap.fromTo(imgWrapRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
        );
    }, [index]);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') onNext();
            else if (e.key === 'ArrowLeft') onPrev();
            else if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onNext, onPrev, onClose]);

    const handleClose = () => {
        gsap.to(overlayRef.current, {
            opacity: 0, duration: 0.25, ease: 'power2.in',
            onComplete: onClose,
        });
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(20,16,14,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={handleClose}
        >
            {/* Counter */}
            <span
                className="absolute top-8 left-1/2 -translate-x-1/2 font-inter text-[10px] tracking-[0.25em] text-[rgba(236,232,223,0.5)] uppercase select-none"
            >
                {index + 1} / {total}
            </span>

            {/* Close */}
            <button
                onClick={handleClose}
                className="absolute top-7 right-8 font-inter text-[rgba(236,232,223,0.5)] hover:text-[var(--tufo)] transition-colors text-2xl leading-none"
                aria-label="Chiudi"
            >
                ✕
            </button>

            {/* Prev arrow */}
            <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full border border-[rgba(236,232,223,0.2)] text-[var(--tufo)] hover:bg-[rgba(236,232,223,0.1)] transition-colors disabled:opacity-20"
                aria-label="Precedente"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Next arrow */}
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full border border-[rgba(236,232,223,0.2)] text-[var(--tufo)] hover:bg-[rgba(236,232,223,0.1)] transition-colors disabled:opacity-20"
                aria-label="Successiva"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M7 3L13 9L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Image */}
            <div
                ref={imgWrapRef}
                className="relative max-w-[88vw] max-h-[82vh] w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="relative rounded-sm overflow-hidden shadow-2xl"
                    style={{
                        width: item.aspect === '3/2' ? 'min(80vw, 1100px)' : 'min(45vw, 620px)',
                        aspectRatio: item.aspect,
                    }}
                >
                    <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 90vw, 80vw"
                        priority
                    />
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/60 to-transparent">
                        <span className="font-playfair italic text-[var(--tufo)] text-lg opacity-80">
                            {item.alt}
                        </span>
                    </div>
                </div>

                {/* Dot indicators */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                    {galleryItems.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); }}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === index ? 'bg-[var(--tufo)] scale-125' : 'bg-[rgba(236,232,223,0.3)]'}`}
                            aria-label={`Foto ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── RoomLightbox (foto stanza specifica) ────────────────────────────────────
function RoomLightbox({ photos, title, index, onClose, onPrev, onNext }: {
    photos: PhotoItem[];
    title: string;
    index: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const imgWrapRef = useRef<HTMLDivElement>(null);
    const total = photos.length;
    const item = photos[index];

    useEffect(() => {
        gsap.fromTo(overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.35, ease: 'power2.out' }
        );
        gsap.fromTo(imgWrapRef.current,
            { scale: 0.92, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' }
        );
    }, []);

    useEffect(() => {
        gsap.fromTo(imgWrapRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
        );
    }, [index]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') onNext();
            else if (e.key === 'ArrowLeft') onPrev();
            else if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onNext, onPrev, onClose]);

    const handleClose = () => {
        gsap.to(overlayRef.current, {
            opacity: 0, duration: 0.25, ease: 'power2.in',
            onComplete: onClose,
        });
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(20,16,14,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={handleClose}
        >
            {/* Room name + counter */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 select-none">
                <span className="font-playfair italic text-[rgba(236,232,223,0.7)] text-lg">{title}</span>
                <span className="font-inter text-[10px] tracking-[0.25em] text-[rgba(236,232,223,0.4)] uppercase">
                    {index + 1} / {total}
                </span>
            </div>

            {/* Close */}
            <button
                onClick={handleClose}
                className="absolute top-7 right-8 font-inter text-[rgba(236,232,223,0.5)] hover:text-[var(--tufo)] transition-colors text-2xl leading-none"
                aria-label="Chiudi"
            >
                ✕
            </button>

            {/* Prev */}
            <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full border border-[rgba(236,232,223,0.2)] text-[var(--tufo)] hover:bg-[rgba(236,232,223,0.1)] transition-colors"
                aria-label="Precedente"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Next */}
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full border border-[rgba(236,232,223,0.2)] text-[var(--tufo)] hover:bg-[rgba(236,232,223,0.1)] transition-colors"
                aria-label="Successiva"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M7 3L13 9L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Image */}
            <div
                ref={imgWrapRef}
                className="relative flex items-center justify-center"
                style={{ maxWidth: '88vw', maxHeight: '80vh', width: '100%' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="relative rounded-sm overflow-hidden shadow-2xl"
                    style={{ width: 'min(80vw, 1100px)', aspectRatio: '4/3' }}
                >
                    <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 90vw, 80vw"
                        priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/60 to-transparent">
                        <span className="font-playfair italic text-[var(--tufo)] text-base opacity-80">{item.alt}</span>
                    </div>
                </div>

                {/* Dot indicators */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                    {photos.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === index ? 'bg-[var(--tufo)] scale-125' : 'bg-[rgba(236,232,223,0.3)]'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function OspitalitaPage() {
    const containerRef = useRef<HTMLElement>(null);
    const galleryContainerRef = useRef<HTMLDivElement>(null);
    const galleryTrackRef = useRef<HTMLDivElement>(null);
    const setConciergeOpen = useAppStore((state) => state.setConciergeOpen);
    const setLightboxOpen = useAppStore((state) => state.setLightboxOpen);
    const setRoomSheetOpen = useAppStore((state) => state.setRoomSheetOpen);
    const t = useTranslations();
    const ospitalitaData = getOspitalitaData(t);
    const galleryItems = ospitalitaData.sections.galleria.items;
    const isMobile = useIsMobile(1024);

    // Gallery lightbox
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const openLightbox = useCallback((i: number) => { setLightboxIndex(i); setLightboxOpen(true); }, [setLightboxOpen]);
    const closeLightbox = useCallback(() => { setLightboxIndex(null); setLightboxOpen(false); }, [setLightboxOpen]);
    const prevImage = useCallback(() =>
        setLightboxIndex((i) => (i !== null ? (i - 1 + galleryItems.length) % galleryItems.length : 0)), [galleryItems.length]);
    const nextImage = useCallback(() =>
        setLightboxIndex((i) => (i !== null ? (i + 1) % galleryItems.length : 0)), [galleryItems.length]);

    // Room lightbox
    const [roomLightbox, setRoomLightbox] = useState<{ roomIndex: number; photoIndex: number } | null>(null);
    const openRoomLightbox = useCallback((roomIndex: number) => {
        setRoomLightbox({ roomIndex, photoIndex: 0 });
        setLightboxOpen(true);
    }, [setLightboxOpen]);
    const closeRoomLightbox = useCallback(() => {
        setRoomLightbox(null);
        setLightboxOpen(false);
    }, [setLightboxOpen]);
    const prevRoomPhoto = useCallback(() => {
        setRoomLightbox((prev) => {
            if (!prev) return null;
            const len = ospitalitaData.sections.stanze.rooms[prev.roomIndex].photos.length;
            return { ...prev, photoIndex: (prev.photoIndex - 1 + len) % len };
        });
    }, [ospitalitaData.sections.stanze.rooms]);
    const nextRoomPhoto = useCallback(() => {
        setRoomLightbox((prev) => {
            if (!prev) return null;
            const len = ospitalitaData.sections.stanze.rooms[prev.roomIndex].photos.length;
            return { ...prev, photoIndex: (prev.photoIndex + 1) % len };
        });
    }, [ospitalitaData.sections.stanze.rooms]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Universal fade up text
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el,
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
                );
            });

            // Card Entrance
            gsap.utils.toArray('.fade-up-card').forEach((el: any) => {
                gsap.fromTo(el,
                    { opacity: 0, scale: 0.95, y: 40 },
                    { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
                );
            });

            // Parallax image wrapper
            gsap.utils.toArray('.parallax-wrap').forEach((wrap: any) => {
                const img = wrap.querySelector('.parallax-img');
                if (img) {
                    gsap.fromTo(img,
                        { scale: 1.15, yPercent: -10 },
                        { yPercent: 10, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true } }
                    );
                }
            });
        }, containerRef);

        // Gallery sticky horizontal scroll — solo desktop
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px)', () => {
            const container = galleryContainerRef.current;
            const track = galleryTrackRef.current;
            if (!container || !track) return;

            const totalScroll = track.scrollWidth - window.innerWidth;

            gsap.to(track, {
                x: -totalScroll,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: `+=${totalScroll}`,
                    pin: true,
                    scrub: 1,
                }
            });

            return () => ScrollTrigger.getAll().forEach(st => st.kill());
        });

        return () => {
            ctx.revert();
            mm.revert();
        };
    }, []);

    return (
        <main ref={containerRef} className="w-full relative z-10 font-inter overflow-hidden text-[var(--mucco-pisano)]">

            {lightboxIndex !== null && (
                <Lightbox
                    index={lightboxIndex}
                    galleryItems={galleryItems}
                    onClose={closeLightbox}
                    onPrev={prevImage}
                    onNext={nextImage}
                />
            )}

            {roomLightbox !== null && (() => {
                const room = ospitalitaData.sections.stanze.rooms[roomLightbox.roomIndex];
                return (
                    <RoomLightbox
                        photos={room.photos}
                        title={room.name}
                        index={roomLightbox.photoIndex}
                        onClose={closeRoomLightbox}
                        onPrev={prevRoomPhoto}
                        onNext={nextRoomPhoto}
                    />
                );
            })()}
            
            {/* Close Cross */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
                <TransitionLink 
                    href={ospitalitaData.closeUrl}
                    bgColor="#F3EFE7"
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-[var(--olive)] bg-[#F3EFE7]/80 backdrop-blur-md transition-all hover:bg-[var(--olive)] hover:scale-105 shadow-xl"
                >
                    <span className="font-inter text-lg text-[var(--olive)] transition-colors group-hover:text-[#F3EFE7]">
                        {ospitalitaData.closeLabel}
                    </span>
                </TransitionLink>
            </div>

            {/* SECTION 1: Eroe (Il Ritiro Perfetto) */}
            <section className="intro-section relative min-h-[85vh] w-full flex flex-col justify-center items-center overflow-hidden parallax-wrap">
                {/* Background Immersive Image */}
                <div className="absolute inset-0 bg-[#3A3C30] parallax-img z-0" />
                
                {/* Dark Vignette Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-0" />

                {/* Text Content */}
                <div className="relative z-10 w-full max-w-5xl text-center px-[8vw] py-[15vh]">
                    <span className="font-inter text-xs tracking-[0.2em] text-[#E8E4DB] uppercase mb-8 block fade-up-text opacity-90">
                        {ospitalitaData.sections.hero.label}
                    </span>
                    <h1 className="font-playfair text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] text-[#F3EFE7] mb-12 fade-up-text">
                        {ospitalitaData.sections.hero.titleHtml}
                    </h1>
                    <p className="font-inter text-lg lg:text-xl leading-[1.8] text-[#E8E4DB] opacity-90 max-w-2xl mx-auto fade-up-text font-light">
                        {ospitalitaData.sections.hero.introText}
                    </p>
                </div>
            </section>

            {/* SECTION 2: Il Calore */}
            <section className="relative min-h-[80vh] px-[8vw] py-[15vh] flex items-center">
                <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    <div className="order-2 lg:order-1">
                        <span className="font-inter text-xs tracking-[0.2em] text-[var(--olive)] uppercase mb-6 block fade-up-text">
                            {ospitalitaData.sections.calore.label}
                        </span>
                        <h2 className="font-playfair text-5xl md:text-6xl leading-[1.1] text-[var(--mucco-pisano)] mb-8 fade-up-text">
                            {ospitalitaData.sections.calore.titleHtml}
                        </h2>
                        <div className="font-inter text-base leading-[1.9] space-y-6 opacity-80 fade-up-text">
                            {ospitalitaData.sections.calore.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 h-[50vh] lg:h-[70vh] w-full rounded-sm overflow-hidden parallax-wrap bg-black relative fade-up-text">
                        <div className="absolute inset-0 bg-[#352A22] parallax-img opacity-90 z-0" />
                        <div className="absolute inset-0 z-10 flex items-center justify-center text-[#EAE5DA]/40 font-playfair italic text-2xl text-center">
                             {ospitalitaData.sections.calore.images.primary.overlayText}
                        </div>
                    </div>

                </div>
            </section>

            {/* SECTION 2.5: Galleria */}
            {isMobile ? (
                /* MOBILE: griglia verticale 2 colonne */
                <section className="px-[6vw] py-[10vh]">
                    <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '9px',
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        color: 'var(--olive)',
                        display: 'block',
                        marginBottom: '1rem',
                    }}>
                        {ospitalitaData.sections.galleria.scrollHint}
                    </span>
                    <h2 className="font-playfair mb-8" style={{
                        fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                        lineHeight: 1.05,
                        color: 'var(--mucco-pisano)',
                    }}>
                        {ospitalitaData.sections.galleria.titleHtml}
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {ospitalitaData.sections.galleria.items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => openLightbox(index)}
                                aria-label={`Apri ${item.alt}`}
                                className="group relative overflow-hidden rounded-sm"
                                style={{
                                    aspectRatio: '3/4',
                                    border: 'none',
                                    padding: 0,
                                    background: 'transparent',
                                    display: 'block',
                                    cursor: 'pointer',
                                }}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-active:scale-105"
                                    sizes="45vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-active:bg-black/20 transition-colors duration-300 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                                    <span className="font-playfair italic text-[var(--tufo)] text-xs leading-tight block">
                                        {item.alt}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            ) : (
                /* DESKTOP: sticky horizontal scroll */
                <div ref={galleryContainerRef} style={{ overflow: 'hidden', position: 'relative' }}>
                    <div
                        ref={galleryTrackRef}
                        style={{ display: 'flex', width: 'max-content', willChange: 'transform', height: '100vh', alignItems: 'center' }}
                    >
                        {/* Pannello intro */}
                        <div style={{
                            width: '38vw',
                            minWidth: '320px',
                            height: '100vh',
                            flexShrink: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '0 5vw 18vh 10vw',
                        }}>
                            <span style={{
                                fontFamily: 'var(--font-inter)',
                                fontSize: '9px',
                                letterSpacing: '0.28em',
                                textTransform: 'uppercase',
                                color: 'var(--olive)',
                                display: 'block',
                                marginBottom: '1.5rem',
                            }}>
                                {ospitalitaData.sections.galleria.scrollHint}
                            </span>
                            <h2 style={{
                                fontFamily: 'var(--font-playfair), serif',
                                fontSize: 'clamp(2rem, 3.5vw, 5rem)',
                                lineHeight: 1.05,
                                color: 'var(--mucco-pisano)',
                            }}>
                                {ospitalitaData.sections.galleria.titleHtml}
                            </h2>
                        </div>

                        {/* Foto */}
                        {ospitalitaData.sections.galleria.items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => openLightbox(index)}
                                aria-label={`Apri ${item.alt}`}
                                className="group"
                                style={{
                                    height: '72vh',
                                    flexShrink: 0,
                                    aspectRatio: item.aspect,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: '2px',
                                    marginRight: '2vw',
                                    cursor: 'none',
                                    border: 'none',
                                    padding: 0,
                                    background: 'transparent',
                                    display: 'block',
                                }}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="50vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none z-10" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 gap-3">
                                    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" className="text-[var(--tufo)] drop-shadow-lg">
                                        <path d="M4 4h7M4 4v7M24 4h-7M24 4v7M4 24h7M4 24v-7M24 24h-7M24 24v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    <span className="font-playfair italic text-[var(--tufo)] text-base drop-shadow-lg text-center px-4">
                                        {item.alt}
                                    </span>
                                </div>
                            </button>
                        ))}

                        {/* Trailing spacer */}
                        <div style={{ width: '10vw', flexShrink: 0 }} />
                    </div>
                </div>
            )}

            {/* SECTION 3: Le Stanze Cromatiche */}
            <section className="relative min-h-screen px-[8vw] py-[20vh] text-center">
                <div className="max-w-4xl mx-auto mb-20">
                    <span className="font-inter text-xs tracking-[0.2em] text-[var(--olive)] uppercase mb-6 block fade-up-text opacity-0">
                        {ospitalitaData.sections.stanze.label}
                    </span>
                    <h2 className="font-playfair text-5xl md:text-7xl leading-[1.1] mb-8 fade-up-text opacity-0">
                        {ospitalitaData.sections.stanze.titleHtml}
                    </h2>
                    <p className="font-inter text-base leading-[1.9] opacity-80 max-w-2xl mx-auto fade-up-text opacity-0">
                        {ospitalitaData.sections.stanze.introText}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-[1400px] mx-auto text-left mt-16 px-4 md:px-0">
                    {ospitalitaData.sections.stanze.rooms.map((room, roomIndex) => (
                        <div key={room.id} className="flex flex-col group fade-up-card opacity-0">
                            {/* Clickable cover image */}
                            <button
                                className="relative rounded-sm overflow-hidden w-full mb-6 text-left cursor-pointer"
                                style={{ aspectRatio: '4/3', border: 'none', padding: 0, background: room.bgColor }}
                                onClick={() => setRoomSheetOpen(true, room.id)}
                                aria-label={`Apri dettagli ${room.name}`}
                            >
                                <Image
                                    src={room.photos[0].src}
                                    alt={room.photos[0].alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 90vw, 45vw"
                                />
                                {/* Color tint overlay to hint the room identity */}
                                <div
                                    className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                                    style={{ backgroundColor: room.bgColor }}
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500 z-10 pointer-events-none" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none gap-3">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-[var(--tufo)] drop-shadow-lg">
                                        <path d="M4 4h7M4 4v7M24 4h-7M24 4v7M4 24h7M4 24v-7M24 24h-7M24 24v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    <span className="font-inter text-[10px] tracking-[0.2em] uppercase text-[var(--tufo)] drop-shadow-lg">
                                        {t('UI.photoOf', { count: room.photos.length })}
                                    </span>
                                </div>
                                {/* Photo count badge */}
                                <div className="absolute bottom-4 right-4 z-10 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 pointer-events-none">
                                    <span className="font-inter text-[10px] tracking-[0.15em] text-[var(--tufo)] uppercase">
                                        1 / {room.photos.length}
                                    </span>
                                </div>
                            </button>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-5 h-5 rounded-full shadow-sm border border-[var(--olive)]/20" style={{ backgroundColor: room.bgColor }} />
                                    <span className="font-inter text-xs tracking-[0.2em] uppercase opacity-70 text-[var(--olive)]">{t('UI.gallery.identita')}</span>
                                </div>
                                <h3 className="font-playfair text-3xl lg:text-4xl mb-3 text-[var(--mucco-pisano)] group-hover:text-[var(--olive)] transition-colors">{room.name}</h3>
                                <p className="font-inter text-sm md:text-base leading-[1.8] opacity-80 text-[var(--mucco-pisano)] max-w-sm">
                                    {room.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 4: L'Osservatorio (Stargazing e Finale CTA) */}
            <section className="relative min-h-[100vh] bg-[#111111] text-[#F3EFE7] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 parallax-wrap overflow-hidden">
                    <div className="absolute inset-0 bg-[#0A0A0A] parallax-img opacity-80" />
                    {/* Simulated Noise/Stars background logic can go here */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b5/Noise_background.png')] bg-repeat" />
                </div>
                
                <div className="relative z-10 text-center px-[5vw] max-w-4xl w-full">
                    <span className="font-inter text-xs tracking-[0.2em] text-white/50 uppercase mb-8 block fade-up-text">
                        {ospitalitaData.sections.osservatorio.label}
                    </span>
                    <h2 className="font-playfair text-6xl md:text-8xl leading-[1.1] mb-12 fade-up-text font-light">
                        {ospitalitaData.sections.osservatorio.titleHtml}
                    </h2>
                    <p className="font-inter text-lg text-white/70 max-w-xl mx-auto mb-20 fade-up-text font-light tracking-wide leading-relaxed">
                        {ospitalitaData.sections.osservatorio.introText}
                    </p>

                    <div className="fade-up-text">
                        <button 
                            onClick={() => setConciergeOpen(true, 'default')}
                            className="group relative inline-flex items-center justify-center px-12 py-5 font-inter text-sm tracking-[0.2em] text-[#111] bg-[#F3EFE7] rounded-full overflow-hidden transition-transform hover:scale-105"
                        >
                            <span className="relative z-10">{ospitalitaData.sections.osservatorio.cta.buttonLabel}</span>
                            <div className="absolute inset-0 bg-[var(--olive)] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
                            <span className="absolute inset-0 z-20 flex items-center justify-center text-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                                {ospitalitaData.sections.osservatorio.cta.buttonLabel}
                            </span>
                        </button>
                    </div>
                </div>
            </section>

        </main>
    );
}

// GalleryScrollIndicator rimosso — sostituito da sticky horizontal scroll GSAP
