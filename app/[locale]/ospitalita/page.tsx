"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';
import { getOspitalitaData } from '@/lib/data/ospitalita';
import type { CasaGalleryPhoto } from '@/lib/content/types';
import { useReducedMotion } from '@/hooks/usePerformance';
import HouseFloorPlan from '@/components/ui/HouseFloorPlan';
import AmenityIcon from '@/components/ui/AmenityIcon';
import CasaGallery from '@/components/dom/CasaGallery';
import GalleryLightbox, { LightboxPhoto } from '@/components/ui/GalleryLightbox';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function OspitalitaPage() {
    const containerRef = useRef<HTMLElement>(null);
    const setConciergeOpen = useAppStore((state) => state.setConciergeOpen);
    const setLightboxOpen = useAppStore((state) => state.setLightboxOpen);
    const t = useTranslations();
    // Dati stabili tra i render: aprire/chiudere la lightbox non ridisegna la galleria.
    const ospitalitaData = useMemo(() => getOspitalitaData(t), [t]);
    const { casa, galleria } = ospitalitaData.sections;
    const prefersReducedMotion = useReducedMotion();

    const groupLabels = useMemo(
        () => Object.fromEntries(galleria.groups.map((g) => [g.id, g.label])) as Record<string, string>,
        [galleria.groups]
    );

    const [lightbox, setLightbox] = useState<{ photos: LightboxPhoto[]; index: number } | null>(null);
    // Stanza aperta sulle piantine: una sola alla volta su tutta la pagina.
    const [activeRoom, setActiveRoom] = useState<number | null>(null);

    const openLightbox = useCallback((photos: CasaGalleryPhoto[], index: number, eyebrow?: string) => {
        setLightbox({ photos: photos.map((p) => ({ ...p, eyebrow: eyebrow ?? groupLabels[p.group] })), index });
        setLightboxOpen(true);
    }, [groupLabels, setLightboxOpen]);

    const closeLightbox = useCallback(() => {
        setLightbox(null);
        setLightboxOpen(false);
    }, [setLightboxOpen]);

    const stepLightbox = useCallback((delta: number) => {
        setLightbox((current) => {
            if (!current) return current;
            const total = current.photos.length;
            return { ...current, index: (current.index + delta + total) % total };
        });
    }, []);

    const openFloorPhotos = (floorId: string) => {
        const group = galleria.groups.find((g) => g.id === floorId);
        if (group?.photos.length) openLightbox(group.photos, 0);
    };

    // Anteprima stanza: si chiude con Esc o toccando fuori da numeri, legenda e
    // anteprima. Con la lightbox aperta resta com'è, per ritrovarla alla chiusura.
    useEffect(() => {
        if (activeRoom === null || lightbox) return;
        const onPointerDown = (e: PointerEvent) => {
            if (!(e.target as Element).closest('[data-room-ui]')) setActiveRoom(null);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveRoom(null);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [activeRoom, lightbox]);

    // Dipende da prefersReducedMotion; il check sync su matchMedia copre il
    // primo render, quando lo stato è ancora false.
    useEffect(() => {
        if (prefersReducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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

        return () => ctx.revert();
    }, [prefersReducedMotion]);

    return (
        <main ref={containerRef} className="w-full relative z-10 font-inter overflow-hidden text-[var(--mucco-pisano)]">

            {lightbox && (
                <GalleryLightbox
                    photos={lightbox.photos}
                    index={lightbox.index}
                    labels={galleria.lightbox}
                    onStep={stepLightbox}
                    onClose={closeLightbox}
                />
            )}

            {/* Close Cross */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
                <TransitionLink
                    href={ospitalitaData.closeUrl}
                    bgColor="#F3EFE7"
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-[var(--olive)] bg-[#F3EFE7]/90 transition-all hover:bg-[var(--olive)] hover:scale-105 shadow-xl"
                >
                    <span className="font-inter text-lg text-[var(--olive)] transition-colors group-hover:text-[#F3EFE7]">
                        {ospitalitaData.closeLabel}
                    </span>
                </TransitionLink>
            </div>

            {/* SECTION 1: Eroe (Il Ritiro Perfetto) */}
            <section className="intro-section relative min-h-[85vh] w-full flex flex-col justify-center items-center overflow-hidden parallax-wrap">
                <div className="absolute inset-0 parallax-img z-0">
                    <Image
                        src={ospitalitaData.sections.hero.images.background.src}
                        alt={ospitalitaData.sections.hero.images.background.alt}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                        style={{ objectPosition: 'center 45%' }}
                    />
                </div>

                {/* Text Content — leggibilità via text-shadow, senza velo sulla foto */}
                <div className="relative z-10 w-full max-w-5xl text-center px-[8vw] py-[15vh]">
                    <span className="font-inter text-xs tracking-[0.2em] text-[#E8E4DB] uppercase mb-8 block fade-up-text opacity-90" style={{ textShadow: '0 1px 14px rgba(20,16,14,0.65)' }}>
                        {ospitalitaData.sections.hero.label}
                    </span>
                    <h1 className="font-playfair text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] text-[#F3EFE7] mb-12 fade-up-text" style={{ textShadow: '0 2px 28px rgba(20,16,14,0.6), 0 1px 8px rgba(20,16,14,0.4)' }}>
                        {ospitalitaData.sections.hero.titleHtml}
                    </h1>
                    <p className="font-inter text-lg lg:text-xl leading-[1.8] text-[#E8E4DB] opacity-95 max-w-2xl mx-auto fade-up-text font-light" style={{ textShadow: '0 1px 16px rgba(20,16,14,0.65)' }}>
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

                    <div className="order-1 lg:order-2 h-[50vh] lg:h-[70vh] w-full rounded-sm overflow-hidden parallax-wrap relative fade-up-text">
                        <Image
                            src={ospitalitaData.sections.calore.images.primary.src}
                            alt={ospitalitaData.sections.calore.images.primary.alt}
                            fill
                            className="object-cover parallax-img"
                            sizes="(max-width: 1023px) 100vw, 45vw"
                            style={{ objectPosition: 'center' }}
                        />
                    </div>

                </div>
            </section>

            {/* SECTION 3: La Casa (piani, comodità) */}
            <section className="relative px-[8vw] py-[18vh]">
                <div className="max-w-4xl mx-auto mb-24 text-center">
                    <span className="font-inter text-xs tracking-[0.2em] text-[var(--olive)] uppercase mb-6 block fade-up-text">
                        {casa.label}
                    </span>
                    <h2 className="font-playfair text-5xl md:text-7xl leading-[1.1] mb-8 fade-up-text">
                        {casa.titleHtml}
                    </h2>
                    <p className="font-inter text-base leading-[1.9] opacity-80 max-w-2xl mx-auto fade-up-text">
                        {casa.introText}
                    </p>
                    <p className="mt-8 font-inter text-[10px] tracking-[0.18em] uppercase text-[var(--argilla-ferrosa)] fade-up-text">
                        {casa.planHint}
                    </p>
                </div>

                {/* I due piani: piantina + legenda + foto del piano */}
                <div className="max-w-[1400px] mx-auto flex flex-col gap-24 lg:gap-32">
                    {casa.floors.map((floor, fi) => (
                        <div key={floor.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className={`fade-up-card ${fi % 2 === 1 ? 'lg:order-2' : ''}`}>
                                <div className="rounded-sm border border-[var(--argilla-ferrosa)]/25 bg-[rgba(78,64,48,0.03)] p-6 lg:p-10">
                                    <HouseFloorPlan
                                        floor={floor}
                                        activeRoom={activeRoom}
                                        onSelectRoom={setActiveRoom}
                                        onOpenPhotos={openLightbox}
                                        closeAria={casa.roomCloseAria}
                                    />
                                </div>
                            </div>
                            <div className={`fade-up-text ${fi % 2 === 1 ? 'lg:order-1' : ''}`}>
                                <h3 className="font-playfair text-4xl lg:text-5xl mb-5 text-[var(--mucco-pisano)]">
                                    {floor.name}
                                </h3>
                                <p className="font-inter text-sm md:text-base leading-[1.8] opacity-80 mb-8 max-w-lg">
                                    {floor.description}
                                </p>
                                <ol className="flex flex-col gap-3">
                                    {floor.spaces.map((space) => {
                                        const active = activeRoom === space.n;
                                        return (
                                            <li key={space.n}>
                                                <button
                                                    type="button"
                                                    data-room-ui
                                                    aria-expanded={active}
                                                    onClick={() => setActiveRoom(active ? null : space.n)}
                                                    className="group flex items-center gap-4 text-left"
                                                >
                                                    <span
                                                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border font-inter text-[11px] transition-colors duration-300 ${
                                                            active
                                                                ? 'border-[var(--argilla-ferrosa)] bg-[var(--argilla-ferrosa)] text-[var(--tufo)]'
                                                                : 'border-[var(--argilla-ferrosa)]/40 text-[var(--argilla-ferrosa)] group-hover:border-[var(--argilla-ferrosa)]'
                                                        }`}
                                                    >
                                                        {space.n}
                                                    </span>
                                                    <span className={`font-inter text-sm md:text-base transition-opacity ${active ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'}`}>
                                                        {space.name}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ol>
                                <button
                                    type="button"
                                    onClick={() => openFloorPhotos(floor.id)}
                                    className="mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--argilla-ferrosa)]/45 px-7 py-3 font-inter text-[10px] uppercase tracking-[0.18em] text-[var(--argilla-ferrosa)] transition-colors duration-300 hover:bg-[var(--argilla-ferrosa)] hover:text-[var(--tufo)]"
                                >
                                    {floor.photosLabel}
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-10 text-center font-inter text-[10px] tracking-[0.18em] uppercase opacity-40">
                    {casa.planNote}
                </p>

                {/* Comodità */}
                <div className="max-w-[1200px] mx-auto mt-28 text-center">
                    <h3 className="font-playfair text-4xl lg:text-5xl mb-5 text-[var(--mucco-pisano)] fade-up-text">
                        {casa.amenities.title}
                    </h3>
                    <p className="font-inter text-sm md:text-base leading-[1.8] opacity-75 max-w-xl mx-auto fade-up-text">
                        {casa.amenities.intro}
                    </p>
                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 text-left">
                        {casa.amenities.groups.map((group, gi) => (
                            <div key={gi} className="fade-up-card">
                                <h4 className="font-inter text-[10px] tracking-[0.24em] uppercase text-[var(--olive)] border-b border-[var(--olive)]/20 pb-3 mb-5">
                                    {group.title}
                                </h4>
                                <ul className="flex flex-col gap-4">
                                    {group.items.map((item, ii) => (
                                        <li key={ii} className="flex items-center gap-3">
                                            <span className="flex-shrink-0 text-[var(--argilla-ferrosa)]">
                                                <AmenityIcon name={item.icon} />
                                            </span>
                                            <span className="font-inter text-sm opacity-85 leading-snug">{item.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: Galleria (Frammenti di Pace) — tutte le foto, per aree */}
            <CasaGallery data={galleria} onOpen={openLightbox} />

            {/* SECTION 5: L'Osservatorio (Stargazing e Finale CTA) */}
            <section className="relative min-h-[100vh] bg-[#111111] text-[#F3EFE7] flex items-center justify-center overflow-hidden">
                <div aria-hidden="true" className="absolute inset-0 bg-[#0A0A0A] opacity-80" />
                <div aria-hidden="true" className="absolute inset-0 grain opacity-[0.12]" />

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
