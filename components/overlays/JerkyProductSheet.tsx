'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';

export default function JerkyProductSheet() {
    const setJerkySheetOpen = useAppStore((s) => s.setJerkySheetOpen);
    const setConciergeOpen = useAppStore((s) => s.setConciergeOpen);
    const selectedJerkyId = useAppStore((s) => s.selectedJerkyId);
    const t = useTranslations('Overlays.jerkySheet');
    const tProducts = useTranslations();
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const isClosingRef = useRef(false);

    // Read products directly from raw JSON — avoids triggering t.rich() on unrelated MuccoPisano fields
    const rawProducts = tProducts.raw('MuccoPisano.essiccata.products') as any[];
    const products = rawProducts.map((p: any) => ({
        id: p.id as string,
        name: p.name as string,
        subtitle: p.subtitle as string,
        description: p.description as string,
        tags: p.tags as string[],
        labelColor: p.labelColor as string,
        glowColor: p.glowColor as string,
        ctaLabel: p.ctaLabel as string,
        image: p.image as { src: string; alt: string },
    }));
    const selectedProduct = products.find((p) => p.id === selectedJerkyId) || products[0];

    // ── Close handler with GSAP exit ──
    const handleClose = useCallback(() => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;
        if (!overlayRef.current) {
            setJerkySheetOpen(false);
            return;
        }
        gsap.to(overlayRef.current, {
            yPercent: 100,
            duration: 0.65,
            ease: 'power4.in',
            onComplete: () => setJerkySheetOpen(false),
        });
    }, [setJerkySheetOpen]);

    // ── Handle ESC key ──
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleClose]);

    // ── Animate content stagger on mount ──
    useEffect(() => {
        if (!contentRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current!.children,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
            );
        }, contentRef);
        return () => ctx.revert();
    }, []);

    // ── Animate content swap when product changes ──
    useEffect(() => {
        if (!contentRef.current) return;
        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
        );
    }, [selectedJerkyId]);

    const handleOrder = () => {
        handleClose();
        setTimeout(() => setConciergeOpen(true, 'default'), 700);
    };

    const handleSelectProduct = (id: string) => {
        if (id === selectedJerkyId) return;
        if (contentRef.current) {
            gsap.to(contentRef.current, {
                opacity: 0,
                y: -15,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    useAppStore.getState().setJerkySheetOpen(true, id);
                },
            });
        }
    };

    if (!selectedProduct) return null;

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('ariaLabel')}
            className="fixed inset-0 z-[90] flex flex-col overflow-y-auto"
            style={{
                background: '#EAE5DA',
                animation: 'jerkySheetSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
        >
            {/* ── Close button ── */}
            <button
                onClick={handleClose}
                aria-label={t('closeAria')}
                style={{
                    position: 'fixed',
                    top: 'calc(1.5rem + env(safe-area-inset-top, 0px))',
                    right: '1.5rem',
                    zIndex: 91,
                    background: 'transparent',
                    border: '1px solid rgba(107,122,101,0.4)',
                    borderRadius: '9999px',
                    padding: '0.45rem 1.2rem',
                    color: 'var(--olive)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase' as const,
                    cursor: 'none',
                    transition: 'border-color 0.3s',
                }}
            >
                {t('closeLabel')}
            </button>

            {/* ── Main content ── */}
            <div
                ref={contentRef}
                className="flex flex-col lg:flex-row items-center lg:items-stretch min-h-screen w-full max-w-[1400px] mx-auto px-[6vw] lg:px-[4vw] py-[12vh] gap-12 lg:gap-[6vw]"
            >
                {/* ─── Left: Product Image ─── */}
                <div className="relative flex-shrink-0 w-full lg:w-5/12 flex flex-col items-center justify-center">
                    {/* Glow background */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[100px] transition-all duration-700"
                        style={{ background: selectedProduct.glowColor, width: 500, height: 500 }}
                    />

                    {/* Product image */}
                    <div className="relative" style={{ height: '55vh', width: 320 }}>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-6 w-64 rounded-full bg-[#3D332A]/15 blur-2xl" />
                        {selectedProduct.image?.src ? (
                            <Image
                                src={selectedProduct.image.src}
                                alt={selectedProduct.image.alt}
                                fill
                                className="object-contain drop-shadow-[0_25px_50px_rgba(40,30,20,0.25)]"
                                style={{ objectPosition: 'bottom' }}
                                sizes="340px"
                            />
                        ) : (
                            <div
                                className="absolute inset-x-4 bottom-0 rounded-2xl shadow-2xl"
                                style={{ background: selectedProduct.labelColor, height: '80%' }}
                            />
                        )}
                    </div>

                    {/* Product switcher pills */}
                    <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 9999, border: '1px solid rgba(107,122,101,0.15)', background: 'rgba(255,255,255,0.6)', padding: 4, backdropFilter: 'blur(12px)' }}>
                        {products.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => handleSelectProduct(p.id)}
                                style={{
                                    borderRadius: 9999,
                                    padding: '10px 20px',
                                    fontFamily: 'var(--font-inter)',
                                    fontSize: 9,
                                    textTransform: 'uppercase' as const,
                                    letterSpacing: '0.2em',
                                    transition: 'all 0.3s',
                                    border: 'none',
                                    cursor: 'none',
                                    ...(selectedJerkyId === p.id
                                        ? { background: 'var(--olive)', color: '#ECE8DF', fontWeight: 600, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }
                                        : { background: 'transparent', color: 'rgba(74,46,27,0.6)' }),
                                }}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── Right: Product Details ─── */}
                <div className="flex-1 flex flex-col justify-center" style={{ maxWidth: 640, paddingTop: '8vh', paddingBottom: '8vh' }}>
                    {/* Eyebrow */}
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' as const, marginBottom: 16, color: 'var(--olive)', fontWeight: 600, display: 'block' }}>
                        {t('eyebrow')}
                    </span>

                    {/* Subtitle */}
                    <span
                        style={{ fontFamily: 'var(--font-inter)', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.24em', marginBottom: 12, display: 'block', transition: 'color 0.5s', color: selectedProduct.labelColor }}
                    >
                        {selectedProduct.subtitle}
                    </span>

                    {/* Title */}
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontStyle: 'italic', lineHeight: 0.95, color: 'var(--mucco-pisano)', marginBottom: 32 }}>
                        {selectedProduct.name}
                    </h2>

                    {/* Description */}
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(15px, 1.2vw, 18px)', lineHeight: 1.85, color: 'rgba(74,46,27,0.8)', fontWeight: 300, marginBottom: 40, maxWidth: '52ch' }}>
                        {selectedProduct.description}
                    </p>

                    {/* Tags as specs */}
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12, marginBottom: 48, maxWidth: 400 }}>
                        {selectedProduct.tags.map((tag: string, index: number) => (
                            <div
                                key={index}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(107,122,101,0.1)', paddingBottom: 12 }}
                            >
                                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: 'var(--olive)' }}>
                                    {tag}
                                </span>
                                <span
                                    style={{ height: 6, width: 6, borderRadius: '50%', background: selectedProduct.labelColor }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div>
                        <button
                            onClick={handleOrder}
                            style={{
                                position: 'relative',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                borderRadius: 9999,
                                border: '1px solid rgba(74,46,27,0.2)',
                                background: 'var(--mucco-pisano)',
                                padding: '20px 40px',
                                minWidth: 260,
                                boxShadow: '0 8px 24px rgba(74,46,27,0.2)',
                                cursor: 'none',
                                transition: 'transform 0.3s',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                        >
                            <span style={{ position: 'relative', zIndex: 10, fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.2em', color: '#F3EFE7' }}>
                                {t('ctaOrder')}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* CSS keyframes — same pattern as OilExtractionModal */}
            <style jsx global>{`
                @keyframes jerkySheetSlideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0.5;
                    }
                    to {
                        transform: translateY(0%);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
