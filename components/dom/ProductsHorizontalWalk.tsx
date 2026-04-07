'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '@/store/useAppStore';
import TransitionLink from '@/components/ui/TransitionLink';
import { getProductsData } from '@/lib/data/products';
import { useTranslations } from 'next-intl';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

function ProductSlide({
    id,
    label,
    title,
    titleItalic,
    body,
    extra,
    ctaLabel,
    ctaAction,
    ctaHref,
    accent = false,
    bgColor,
    theme,
    ...props
}: {
    id: string;
    label: string;
    title: string;
    titleItalic?: string;
    body: React.ReactNode;
    extra?: React.ReactNode;
    ctaLabel?: string;
    ctaAction?: () => void;
    ctaHref?: string;
    accent?: boolean;
    bgColor?: string;
    theme?: 'light' | 'dark';
    [key: string]: any;
}) {
    const isDark = theme === 'dark' || accent;
    return (
        <div
            id={id}
            style={{
                height: '100vh',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                position: 'relative',
            }}
        >
            {/* Left background — inset to reveal sky at edges (la finestra sul cielo) */}
            <div style={{
                position: 'absolute',
                top: '16vh',
                left: 0,
                bottom: 0,
                width: '45vw',
                background: bgColor || (accent ? 'var(--terra-nera)' : 'var(--tufo)'),
                zIndex: 0,
                pointerEvents: 'none',
            }} />
            {/* Text column */}
            <div style={{ 
                width: '45vw', 
                minWidth: '400px',
                padding: '0 6vw 0 10vw',
                position: 'relative', 
                zIndex: 2,
                flexShrink: 0 
            }}>
                <span className="label anim-text-h" style={{ display: 'block', marginBottom: '1.5rem', color: isDark ? 'var(--olive)' : 'var(--olive)' }}>
                    {label}
                </span>
                <h2 className="anim-text-h" style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: 'clamp(2rem, 4.5vw, 6.4rem)',
                    lineHeight: 0.92,
                    color: isDark ? 'var(--tufo)' : 'var(--mucco-pisano)',
                    marginBottom: '2.5rem',
                }}>
                    {title}
                    {titleItalic && (
                        <><br /><em>{titleItalic}</em></>
                    )}
                </h2>
                <div className="anim-text-h" style={{ fontSize: 'clamp(13px, 1vw, 16px)', lineHeight: 1.8, color: isDark ? 'rgba(236,232,223,0.8)' : 'var(--mucco-pisano)', opacity: 0.88 }}>
                    {body}
                </div>
                {extra && <div className="anim-text-h" style={{ marginTop: '1.5rem' }}>{extra}</div>}
                {ctaLabel && (ctaAction || ctaHref) && (
                    <div className="anim-text-h" style={{ marginTop: '3.5rem' }}>
                        {ctaHref ? (
                            <TransitionLink 
                                href={ctaHref} 
                                bgColor={isDark ? '#181A15' : '#F3EFE7'}
                                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-[var(--olive)] px-8 py-3 transition-colors hover:bg-[var(--olive)]"
                            >
                                <span className="relative z-10 font-inter text-xs font-medium uppercase tracking-[0.15em] text-[var(--olive)] transition-colors group-hover:text-[var(--pietra)]">
                                    {ctaLabel}
                                </span>
                                <span className="relative z-10 block h-1 w-8 bg-[var(--olive)] transition-all group-hover:w-12 group-hover:bg-[var(--pietra)]" />
                            </TransitionLink>
                        ) : (
                            <button
                                onClick={ctaAction}
                                style={{
                                    background: 'transparent',
                                    border: `1px solid ${isDark ? 'var(--sabbia-limonitica)' : 'var(--mucco-pisano)'}`,
                                    borderRadius: '9999px',
                                    padding: '0.8rem 2rem',
                                    fontFamily: 'var(--font-inter)',
                                    fontSize: '10px',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: isDark ? 'var(--sabbia-limonitica)' : 'var(--mucco-pisano)',
                                    cursor: 'none',
                                    transition: 'background 0.3s, color 0.3s',
                                }}
                            >
                                {ctaLabel}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Media placeholder column */}
            <div
                {...props}
                style={{
                    height: '100vh',
                    aspectRatio: '16/9',
                    flexShrink: 0,
                    background: accent
                        ? 'linear-gradient(135deg, rgba(176,92,70,0.2), rgba(43,36,32,0.8))'
                        : 'linear-gradient(135deg, rgba(212,163,97,0.15), rgba(74,46,27,0.1))',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <span className="sr-only">{label}</span>
                <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: accent ? 'rgba(236,232,223,0.3)' : 'rgba(74,46,27,0.25)',
                }}>
                    {id} · WebGL
                </span>
            </div>
        </div>
    );
}

function ProductCardMobile({
    id, label, title, titleItalic, body, extra, ctaLabel, ctaAction, ctaHref, bgColor, theme,
}: {
    id: string; label: string; title: string; titleItalic?: string;
    body: React.ReactNode; extra?: React.ReactNode;
    ctaLabel?: string; ctaAction?: () => void; ctaHref?: string;
    bgColor?: string; theme?: 'light' | 'dark';
}) {
    const isDark = theme === 'dark';
    return (
        <div style={{ background: bgColor || 'var(--tufo)', padding: '0 0 3rem' }}>
            {/* Media placeholder */}
            <div
                data-webgl-media="true"
                data-effect-type="displacement"
                style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    position: 'relative',
                    overflow: 'hidden',
                    background: isDark
                        ? 'linear-gradient(135deg,rgba(176,92,70,0.2),rgba(43,36,32,0.8))'
                        : 'linear-gradient(135deg,rgba(212,163,97,0.15),rgba(74,46,27,0.1))',
                }}
            >
                <span className="sr-only">{label}</span>
            </div>
            {/* Text */}
            <div style={{ padding: '2rem 8vw 0' }}>
                <span className="label" style={{ display: 'block', marginBottom: '1rem', color: 'var(--olive)' }}>
                    {label}
                </span>
                <h2 style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: 'clamp(2.2rem, 9vw, 3.5rem)',
                    lineHeight: 0.95,
                    color: isDark ? 'var(--tufo)' : 'var(--mucco-pisano)',
                    marginBottom: '1.5rem',
                }}>
                    {title}{titleItalic && <><br /><em>{titleItalic}</em></>}
                </h2>
                <div style={{ fontSize: '16px', lineHeight: 1.75, color: isDark ? 'rgba(236,232,223,0.8)' : 'var(--mucco-pisano)', opacity: 0.88 }}>
                    {body}
                </div>
                {extra && <div style={{ marginTop: '1rem' }}>{extra}</div>}
                {ctaLabel && (ctaAction || ctaHref) && (
                    <div style={{ marginTop: '2.5rem' }}>
                        {ctaHref ? (
                            <TransitionLink
                                href={ctaHref}
                                bgColor={isDark ? '#181A15' : '#F3EFE7'}
                                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-[var(--olive)] px-8 py-3 transition-colors hover:bg-[var(--olive)]"
                            >
                                <span className="relative z-10 font-inter text-xs font-medium uppercase tracking-[0.15em] text-[var(--olive)] transition-colors group-hover:text-[var(--pietra)]">
                                    {ctaLabel}
                                </span>
                                <span className="relative z-10 block h-1 w-8 bg-[var(--olive)] transition-all group-hover:w-12 group-hover:bg-[var(--pietra)]" />
                            </TransitionLink>
                        ) : (
                            <button
                                onClick={ctaAction}
                                style={{
                                    background: 'transparent',
                                    border: `1px solid ${isDark ? 'var(--sabbia-limonitica)' : 'var(--mucco-pisano)'}`,
                                    borderRadius: '9999px',
                                    padding: '0.9rem 2rem',
                                    fontFamily: 'var(--font-inter)',
                                    fontSize: '10px',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: isDark ? 'var(--sabbia-limonitica)' : 'var(--mucco-pisano)',
                                    cursor: 'pointer',
                                    width: '100%',
                                }}
                            >
                                {ctaLabel}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProductsHorizontalWalk() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const { setOilModalOpen, setConciergeOpen } = useAppStore();
    const t = useTranslations();
    const slides = getProductsData(t);
    const isMobile = useIsMobile(1024);

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        // Only pin on desktop
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px)', () => {
            const trackWidth = track.scrollWidth;
            const totalScroll = trackWidth - window.innerWidth;

            const tween = gsap.to(track, {
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

            // Anima i testi orizzontalmente non appena la loro slide entra nello schermo (containerAnimation)
            gsap.utils.toArray('.anim-text-h').forEach((el: any) => {
                gsap.fromTo(el,
                    { opacity: 0, x: 60 },
                    {
                        opacity: 1, x: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            containerAnimation: tween,
                            start: 'left 85%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            return () => {
                tween.kill();
                ScrollTrigger.getAll().forEach(t => t.kill());
            };
        });

        return () => mm.revert();
    }, []);

    if (isMobile) {
        return (
            <section
                id="02-prodotti"
                data-section-label={t('UI.sectionLabels.products')}
                style={{ position: 'relative' }}
                aria-label={t('UI.sectionLabels.products')}
            >
                {slides.map((slide) => (
                    <ProductCardMobile
                        key={slide.id}
                        id={slide.id}
                        label={slide.label}
                        title={slide.title}
                        titleItalic={slide.titleItalic}
                        bgColor={slide.bgColor}
                        theme={slide.theme}
                        body={slide.body}
                        extra={slide.extra}
                        ctaLabel={slide.cta?.label}
                        ctaHref={slide.cta?.href}
                        ctaAction={
                            slide.cta?.action === 'concierge' && slide.cta?.actionTarget
                                ? () => setConciergeOpen(true, 'cucina-nomade')
                                : undefined
                        }
                    />
                ))}
            </section>
        );
    }

    return (
        <section
            id="02-prodotti"
            data-section-label={t('UI.sectionLabels.products')}
            ref={containerRef}
            style={{ overflow: 'hidden', position: 'relative' }}
            aria-label={t('UI.sectionLabels.products')}
        >
            <div
                ref={trackRef}
                style={{
                    display: 'flex',
                    width: 'max-content',
                    willChange: 'transform',
                }}
            >
                {slides.map((slide) => (
                    <ProductSlide
                        key={slide.id}
                        id={slide.id}
                        data-webgl-media={slide.media.webgl.toString()}
                        data-effect-type={slide.media.effectType}
                        data-texture-src={slide.media.textureSrc}
                        label={slide.label}
                        title={slide.title}
                        titleItalic={slide.titleItalic}
                        bgColor={slide.bgColor}
                        theme={slide.theme}
                        body={slide.body}
                        extra={slide.extra}
                        ctaLabel={slide.cta?.label}
                        ctaHref={slide.cta?.href}
                        ctaAction={
                            slide.cta?.action === 'concierge' && slide.cta?.actionTarget
                                ? () => setConciergeOpen(true, 'cucina-nomade')
                                : undefined
                        }
                    />
                ))}
            </div>
        </section>
    );
}
