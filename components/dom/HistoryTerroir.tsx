'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import { useAppStore } from '@/store/useAppStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function EasterEggTrigger({ children }: { children: React.ReactNode }) {
    const triggerEasterEgg = useAppStore((s) => s.triggerEasterEgg);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [glowing, setGlowing] = useState(false);

    const handleMouseDown = () => {
        timerRef.current = setTimeout(() => {
            triggerEasterEgg();
        }, 3000);
    };

    const handleMouseUp = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    return (
        <span
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
                cursor: 'none',
                display: 'inline',
                position: 'relative',
                animation: 'eggGlow 6s ease-in-out infinite',
            }}
        >
            {children}
            <style jsx>{`
        @keyframes eggGlow {
          0%, 90%, 100% { text-shadow: none; }
          95% { text-shadow: 0 0 12px rgba(176, 92, 70, 0.6); }
        }
      `}</style>
        </span>
    );
}

export default function HistoryTerroir() {
    const sectionRef = useRef<HTMLElement>(null);
    const t = useTranslations();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.anim-text-v').forEach((el: any) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1, y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Parallax immagine villa (visibile solo su mobile tramite DOM image)
            gsap.fromTo('.parallax-img-villa',
                { yPercent: -10 },
                {
                    yPercent: 10, ease: 'none',
                    scrollTrigger: {
                        trigger: '#media-villa-mobile',
                        start: 'top bottom', end: 'bottom top', scrub: true,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="01-storia-terroir"
            data-section-label={t('UI.sectionLabels.terroir')}
            className="grid grid-cols-1 lg:grid-cols-[3fr_4fr] items-start relative isolate overflow-hidden"
            style={{
                minHeight: '100vh',
                padding: '10vh 8vw',
                gap: '4vw',
                background: 'transparent',
            }}
            aria-label="Storia e Terroir"
        >
            {/* Terroir Block — left */}
            <article className="order-1 lg:order-none" style={{ gridColumn: 1, gridRow: 1, paddingTop: '4vh' }}>
                <span className="label anim-text-v" style={{ display: 'block', marginBottom: '2rem', color: 'var(--olive)' }}>
                    {t('Home.terroir.sectionLabel')}
                </span>
                <h2
                    className="anim-text-v"
                    style={{
                        fontFamily: 'var(--font-playfair), serif',
                        fontSize: 'clamp(2rem, 4vw, 5rem)',
                        lineHeight: 1.0,
                        color: 'var(--sky-text-color, var(--mucco-pisano))',
                        marginBottom: '2rem',
                    }}
                >
                    {t.rich('Home.terroir.titleHtml', {
                        br: () => <br />,
                        em: (chunks) => <em>{chunks}</em>
                    })}
                </h2>
                <p className="anim-text-v" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: 1.75, color: 'var(--sky-text-color, var(--mucco-pisano))', opacity: 0.85 }}>
                    {t.rich('Home.terroir.introText', {
                        br: () => <br />,
                        alt: (chunks) => <em style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1em', letterSpacing: '-0.01em' }}>{chunks}</em>
                    })}
                </p>
            </article>

            {/* Villa image — Desktop: WebGL displacement / Mobile: DOM native con parallax */}

            {/* Desktop: WebGL placeholder (CanvasZ0 renderizza l'immagine sopra) */}
            <div
                data-webgl-media="true"
                data-effect-type="displacement"
                data-texture-src="/images/villa-buontalenti.png"
                id="media-villa-displacement"
                className="order-3 lg:order-none hidden lg:block"
                style={{
                    gridColumn: 2,
                    gridRow: '1 / 3',
                    marginTop: '5vh',
                    marginBottom: '5vh',
                    aspectRatio: '4/5',
                    background: 'rgba(74,46,27,0.08)',
                    position: 'relative',
                }}
            >
                {/* Left Fill: merges text column with canvas */}
                <div style={{ position: 'absolute', top: '-100vh', bottom: '-100vh', right: '100%', width: '100vw', background: 'var(--tufo)', zIndex: -1 }} />
                {/* Top Fill: covers above the photo (hero bleeds through otherwise) */}
                <div style={{ position: 'absolute', bottom: '100%', left: '-100vw', right: '-100vw', height: '100vh', background: 'var(--tufo)', zIndex: -1 }} />
                <span className="sr-only">{t('Home.terroir.villaMedia.alt')}</span>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #D4A361 0%, #B05C46 40%, #4A2E1B 100%)', opacity: 0.15 }} />
            </div>

            {/* Mobile: immagine DOM reale con parallax */}
            <div
                id="media-villa-mobile"
                className="order-3 lg:hidden"
                style={{
                    width: '100%',
                    aspectRatio: '4/5',
                    position: 'relative',
                    overflow: 'hidden',
                    marginTop: '3vh',
                    marginBottom: '3vh',
                }}
            >
                <Image
                    src="/images/villa-buontalenti.png"
                    alt={t('Home.terroir.villaMedia.alt')}
                    fill
                    className="parallax-img-villa"
                    style={{ objectFit: 'cover', scale: '1.2', transformOrigin: 'center center' }}
                    sizes="100vw"
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(74,46,27,0.1) 0%, transparent 40%, rgba(74,46,27,0.2) 100%)',
                    pointerEvents: 'none',
                }} />
            </div>

            {/* Renaissance Block — left */}
            <article className="order-2 lg:order-none" style={{ gridColumn: 1, gridRow: 2, paddingBottom: '10vh' }}>
                <div className="anim-text-v" style={{ height: '1px', background: 'var(--olive)', opacity: 0.3, marginBottom: '2.5rem' }} />
                <span className="label anim-text-v" style={{ display: 'block', marginBottom: '1.5rem', color: 'var(--olive)' }}>
                    {t('Home.terroir.renaissanceLabel')}
                </span>
                <p className="anim-text-v" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: 1.8, color: 'var(--sky-text-color, var(--mucco-pisano))', opacity: 0.85 }}>
                    {t.rich('Home.terroir.historyText', {
                        br: () => <br />,
                        strong: (chunks) => <strong style={{ fontFamily: 'var(--font-playfair)' }}>{chunks}</strong>,
                        easter: (chunks) => <EasterEggTrigger>{chunks}</EasterEggTrigger>
                    })}
                </p>

                {/* Medici Legacy */}
                <blockquote className="anim-text-v" style={{
                    marginTop: '2.5rem',
                    borderLeft: '2px solid var(--argilla-ferrosa)',
                    paddingLeft: '1.5rem',
                    fontFamily: 'var(--font-playfair)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.9rem, 1.4vw, 1.3rem)',
                    color: 'var(--sky-text-color, var(--mucco-pisano))',
                    opacity: 0.75,
                    lineHeight: 1.6,
                }}>
                    {t('Home.terroir.mediciQuote')}
                </blockquote>

                {/* Approfondisci Button */}
                <div className="anim-text-v" style={{ marginTop: '3.5rem' }}>
                    <TransitionLink 
                        href="/storia"
                        bgColor="#F3EFE7"
                        transitionKeyword="1839"
                        className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-[var(--olive)] px-8 py-3 transition-colors hover:bg-[var(--olive)]"
                    >
                        <span className="relative z-10 font-inter text-xs font-medium uppercase tracking-[0.15em] text-[var(--olive)] transition-colors group-hover:text-[var(--pietra)]">
                            {t('Home.terroir.cta.label')}
                        </span>
                        <span className="relative z-10 block h-1 w-8 bg-[var(--olive)] transition-all group-hover:w-12 group-hover:bg-[var(--pietra)]" />
                    </TransitionLink>
                </div>
            </article>
        </section>
    );
}
