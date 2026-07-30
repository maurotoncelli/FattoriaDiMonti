'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/hooks/usePerformance';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Unica fonte per l'immagine della villa (variante desktop + mobile)
const VILLA_MEDIA_SRC = '/images/villa-buontalenti-storica.jpg';

export default function HistoryTerroir() {
    const sectionRef = useRef<HTMLElement>(null);
    const t = useTranslations();
    const prefersReducedMotion = useReducedMotion();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const animatedText = gsap.utils.toArray('.anim-text-v');

            if (prefersReducedMotion) {
                return;
            }

            gsap.set(animatedText, { opacity: 0, y: 24 });

            gsap.utils.toArray('.anim-text-v').forEach((el: any) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1, y: 0,
                        duration: 0.65,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 92%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Parallax immagine villa (desktop + mobile, immagini DOM native)
            gsap.utils.toArray('.parallax-img-villa').forEach((img: any) => {
                const trigger = img.closest('[data-villa-media]');
                if (!trigger) return;
                gsap.fromTo(img,
                    { yPercent: -10 },
                    {
                        yPercent: 10, ease: 'none',
                        scrollTrigger: {
                            trigger,
                            start: 'top bottom', end: 'bottom top', scrub: true,
                        }
                    }
                );
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [prefersReducedMotion]);

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
            aria-label={t('UI.sectionLabels.terroir')}
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
                        color: 'var(--mucco-pisano)',
                        marginBottom: '2rem',
                    }}
                >
                    {t.rich('Home.terroir.titleHtml', {
                        br: () => <br />,
                        em: (chunks) => <em>{chunks}</em>
                    })}
                </h2>
                <p className="anim-text-v" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: 1.75, color: 'var(--mucco-pisano)', opacity: 0.85 }}>
                    {t.rich('Home.terroir.introText', {
                        br: () => <br />,
                        alt: (chunks) => <em style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1em', letterSpacing: '-0.01em' }}>{chunks}</em>
                    })}
                </p>
            </article>

            {/* Villa image — immagine DOM nativa con parallax (desktop e mobile) */}

            {/* Desktop */}
            <div
                data-villa-media="true"
                id="media-villa-desktop"
                className="order-3 lg:order-none hidden lg:block"
                style={{
                    gridColumn: 2,
                    gridRow: '1 / 3',
                    marginTop: '5vh',
                    marginBottom: '5vh',
                    aspectRatio: '4/5',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Left Fill: merges text column with backdrop */}
                <div style={{ position: 'absolute', top: '-100vh', bottom: '-100vh', right: '100%', width: '100vw', background: 'var(--tufo)', zIndex: -1 }} />
                {/* Right Fill: closes the sky window so previous sections cannot bleed through */}
                <div style={{ position: 'absolute', top: '-100vh', bottom: '-100vh', left: '100%', width: '100vw', background: 'var(--tufo)', zIndex: -1 }} />
                {/* Top Fill: covers above the photo (hero bleeds through otherwise) */}
                <div style={{ position: 'absolute', bottom: '100%', left: '-100vw', right: '-100vw', height: '100vh', background: 'var(--tufo)', zIndex: -1 }} />
                <Image
                    src={VILLA_MEDIA_SRC}
                    alt={t('Home.terroir.villaMedia.alt')}
                    fill
                    className="parallax-img-villa"
                    style={{ objectFit: 'cover', scale: '1.2', transformOrigin: 'center center' }}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(74,46,27,0.1) 0%, transparent 40%, rgba(74,46,27,0.2) 100%)',
                    pointerEvents: 'none',
                }} />
            </div>

            {/* Mobile */}
            <div
                data-villa-media="true"
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
                    src={VILLA_MEDIA_SRC}
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
                <p className="anim-text-v" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: 1.8, color: 'var(--mucco-pisano)', opacity: 0.85 }}>
                    {t.rich('Home.terroir.historyText', {
                        br: () => <br />,
                        strong: (chunks) => <strong style={{ fontFamily: 'var(--font-playfair)' }}>{chunks}</strong>,
                        easter: (chunks) => <>{chunks}</>
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
                    color: 'var(--mucco-pisano)',
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
