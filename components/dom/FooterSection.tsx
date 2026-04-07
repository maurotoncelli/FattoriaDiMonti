'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function FooterSection() {
    const t = useTranslations('Footer.mainFooter');
    const { setConciergeOpen } = useAppStore();
    const footerRef = useRef<HTMLElement>(null);
    const heroImgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax on the drone hero image
            if (heroImgRef.current) {
                gsap.fromTo(heroImgRef.current,
                    { yPercent: -12 },
                    {
                        yPercent: 12,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '#footer-hero',
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    }
                );
            }

            // Hero text reveal
            gsap.fromTo('.footer-hero-text',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 1.4,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: '#footer-hero', start: 'top 80%' }
                }
            );

            // Scroll arrow bounce
            gsap.to('.footer-scroll-arrow', {
                y: 8,
                repeat: -1,
                yoyo: true,
                duration: 1.1,
                ease: 'power1.inOut',
            });

            // Contact columns
            gsap.fromTo('.footer-col-left',
                { opacity: 0, x: -40 },
                {
                    opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
                    scrollTrigger: { trigger: '#footer-contact', start: 'top 80%' }
                }
            );
            gsap.fromTo('.footer-col-right',
                { opacity: 0, x: 40 },
                {
                    opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
                    scrollTrigger: { trigger: '#footer-contact', start: 'top 80%' }
                }
            );

            // Bottom bar
            gsap.fromTo('.footer-bottom',
                { opacity: 0 },
                {
                    opacity: 1, duration: 1, ease: 'power2.out',
                    scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%' }
                }
            );
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const doveSiamo = t.raw('doveSiamo') as any;
    const vieni = t.raw('vieni') as any;
    const bottomBar = t.raw('bottomBar') as any;

    return (
        <footer
            ref={footerRef}
            id="04-footer"
            data-section-label="04 — L'Orizzonte"
            style={{ background: 'var(--terra-nera)', position: 'relative' }}
            aria-label="Footer — Contatti e Raggiungici"
        >
            {/* ── HERO DRONE ───────────────────────────────────────────────── */}
            <div id="footer-hero" style={{ position: 'relative', height: '65vh', overflow: 'hidden' }}>

                {/* Photo + parallax */}
                <div ref={heroImgRef} style={{ position: 'absolute', inset: '-15% 0', zIndex: 0 }}>
                    <Image
                        src="/images/hero-drone.png"
                        alt="Fattoria di Monti — Vista aerea"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        sizes="100vw"
                        priority
                    />
                </div>

                {/* Gradient */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'linear-gradient(to bottom, rgba(43,36,32,0.6) 0%, rgba(0,0,0,0.08) 35%, rgba(0,0,0,0.08) 65%, rgba(43,36,32,0.8) 100%)',
                }} />

                {/* Top-left: brand */}
                <div style={{ position: 'absolute', top: '2.5rem', left: '10vw', zIndex: 2 }}>
                    <span className="footer-hero-text" style={{
                        fontFamily: 'var(--font-playfair), serif',
                        fontSize: 'clamp(0.85rem, 1.1vw, 1.1rem)',
                        fontStyle: 'italic',
                        letterSpacing: '0.04em',
                        color: 'rgba(236,232,223,0.6)',
                    }}>
                        Fattoria di Monti
                    </span>
                </div>

                {/* Top-right: section label */}
                <div style={{ position: 'absolute', top: '2.6rem', right: '10vw', zIndex: 2 }}>
                    <span className="footer-hero-text" style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '9px',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: 'rgba(236,232,223,0.38)',
                    }}>
                        04 — L'Orizzonte
                    </span>
                </div>

                {/* Center: RAGGIUNGICI */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', padding: '0 10vw',
                    gap: '1.5rem',
                }}>
                    <h2 className="footer-hero-text" style={{
                        fontFamily: 'var(--font-playfair), serif',
                        fontSize: 'clamp(2rem, 4.5vw, 5.5rem)',
                        lineHeight: 0.92,
                        letterSpacing: '0.08em',
                        fontWeight: 400,
                        color: 'var(--tufo)',
                        margin: 0,
                    }}>
                        {t('title')}
                    </h2>
                    <p className="footer-hero-text" style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'clamp(12px, 1vw, 14px)',
                        letterSpacing: '0.06em',
                        color: 'rgba(236,232,223,0.5)',
                        maxWidth: '360px',
                        lineHeight: 1.7,
                        margin: 0,
                    }}>
                        Toscana, Provincia di Pisa — A un&apos;ora da Firenze, Pisa, Livorno e Siena
                    </p>
                </div>

                {/* Scroll arrow */}
                <div className="footer-scroll-arrow" style={{
                    position: 'absolute', bottom: '2.5rem', left: '50%',
                    transform: 'translateX(-50%)', zIndex: 2,
                }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'rgba(236,232,223,0.35)' }}>
                        <path d="M4 7L10 13L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Bottom separator */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '1px', background: 'rgba(236,232,223,0.1)', zIndex: 2,
                }} />
            </div>

            {/* ── CONTACT BLOCK ────────────────────────────────────────────── */}
            <div
                id="footer-contact"
                className="grid grid-cols-1 md:grid-cols-2"
                style={{
                    gap: '0',
                    borderBottom: '1px solid rgba(236,232,223,0.1)',
                }}
            >
                {/* LEFT — Dove Siamo */}
                <div className="footer-col-left md:border-r md:border-[rgba(236,232,223,0.1)]" style={{
                    padding: '7vh 8vw',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3rem',
                }}>
                    <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '9px',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: 'var(--olive)',
                        display: 'block',
                    }}>
                        {doveSiamo.label}
                    </span>

                    {/* Address */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{
                            fontFamily: 'var(--font-playfair), serif',
                            fontSize: 'clamp(1.4rem, 2vw, 2rem)',
                            fontStyle: 'italic',
                            color: 'var(--tufo)',
                            lineHeight: 1.2,
                        }}>
                            Loc. Monti — 56048<br />Volterra (PI)
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '13px',
                            color: 'rgba(236,232,223,0.45)',
                            letterSpacing: '0.02em',
                        }}>
                            Toscana, Provincia di Pisa
                        </span>
                    </div>

                    {/* Coordinates + Maps link */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        <span style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '9px',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: 'rgba(236,232,223,0.3)',
                        }}>
                            Coordinate GPS
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '13px',
                            color: 'rgba(236,232,223,0.5)',
                            fontVariantNumeric: 'tabular-nums',
                            letterSpacing: '0.04em',
                        }}>
                            {doveSiamo.coordinates}
                        </span>
                        <a
                            href={vieni.mapsLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: 'fit-content',
                                marginTop: '0.4rem',
                                border: '1px solid rgba(236,232,223,0.3)',
                                borderRadius: '9999px',
                                padding: '0.55rem 1.2rem',
                                fontFamily: 'var(--font-inter)',
                                fontSize: '10px',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: 'rgba(236,232,223,0.7)',
                                textDecoration: 'none',
                                transition: 'border-color 0.3s, color 0.3s',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,232,223,0.7)';
                                (e.currentTarget as HTMLElement).style.color = 'var(--tufo)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,232,223,0.3)';
                                (e.currentTarget as HTMLElement).style.color = 'rgba(236,232,223,0.7)';
                            }}
                        >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {vieni.mapsLink.label}
                        </a>
                    </div>

                    {/* Distances */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '9px',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: 'rgba(236,232,223,0.3)',
                        }}>
                            {doveSiamo.distancesLabel}
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem' }}>
                            {(doveSiamo.distances as string[]).map((d: string) => (
                                <span key={d} style={{
                                    fontFamily: 'var(--font-inter)',
                                    fontSize: '12px',
                                    color: 'rgba(236,232,223,0.5)',
                                    letterSpacing: '0.04em',
                                }}>
                                    — {d}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT — Vieni a Trovarci */}
                <div className="footer-col-right" style={{
                    padding: '7vh 8vw',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3rem',
                    justifyContent: 'center',
                }}>
                    <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '9px',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: 'var(--olive)',
                    }}>
                        {vieni.label}
                    </span>

                    {/* Primary CTA — filled */}
                    <button
                        onClick={() => setConciergeOpen(true, 'default')}
                        style={{
                            background: 'var(--tufo)',
                            color: 'var(--terra-nera)',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '1.1rem 2.5rem',
                            fontFamily: 'var(--font-inter)',
                            fontSize: '11px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            cursor: 'none',
                            width: '100%',
                            maxWidth: '360px',
                            transition: 'background 0.3s, color 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'var(--sabbia-limonitica)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'var(--tufo)';
                        }}
                    >
                        {vieni.primaryCta.label}
                    </button>

                    {/* Secondary CTAs — outline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(vieni.secondaryCtas as any[]).map((cta: any) => {
                            const sharedStyle = {
                                background: 'transparent',
                                border: '1px solid rgba(236,232,223,0.2)',
                                borderRadius: '9999px',
                                padding: '0.85rem 2rem',
                                fontFamily: 'var(--font-inter)',
                                fontSize: '10px',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase' as const,
                                color: 'rgba(236,232,223,0.65)',
                                cursor: 'none',
                                width: '100%',
                                maxWidth: '360px',
                                textDecoration: 'none',
                                display: 'block',
                                textAlign: 'center' as const,
                                transition: 'border-color 0.3s, color 0.3s',
                            };
                            const onEnter = (e: React.MouseEvent<HTMLElement>) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,232,223,0.6)';
                                (e.currentTarget as HTMLElement).style.color = 'var(--tufo)';
                            };
                            const onLeave = (e: React.MouseEvent<HTMLElement>) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,232,223,0.2)';
                                (e.currentTarget as HTMLElement).style.color = 'rgba(236,232,223,0.65)';
                            };
                            if (cta.href) {
                                return (
                                    <a key={cta.label} href={cta.href} style={sharedStyle}
                                        onMouseEnter={onEnter} onMouseLeave={onLeave}
                                        target="_blank" rel="noopener noreferrer">
                                        {cta.label}
                                    </a>
                                );
                            }
                            return (
                                <button key={cta.label} style={sharedStyle}
                                    onMouseEnter={onEnter} onMouseLeave={onLeave}
                                    onClick={() => setConciergeOpen(true, cta.action === 'concierge-cucina-nomade' ? 'cucina-nomade' : 'default')}>
                                    {cta.label}
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* ── BOTTOM BAR ───────────────────────────────────────────────── */}
            <div className="footer-bottom" style={{
                padding: '2rem 10vw',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem',
            }}>
                <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(236,232,223,0.25)',
                }}>
                    {bottomBar.copyrightPrefix} {new Date().getFullYear()} {bottomBar.copyrightSuffix}
                </span>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    {(bottomBar.links as any[]).map((link: any) => (
                        <a
                            key={link.label}
                            href={link.href || '#'}
                            style={{
                                fontFamily: 'var(--font-inter)',
                                fontSize: '10px',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: 'rgba(236,232,223,0.3)',
                                textDecoration: 'none',
                                transition: 'color 0.3s',
                            }}
                            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--tufo)'; }}
                            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(236,232,223,0.3)'; }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
