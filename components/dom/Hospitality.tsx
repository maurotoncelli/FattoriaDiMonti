'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';

import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/hooks/usePerformance';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Hospitality() {
    const sectionRef = useRef<HTMLElement>(null);
    const t = useTranslations();

    const prefersReducedMotion = useReducedMotion();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const fadeItems = gsap.utils.toArray('.hosp-fade');

            if (prefersReducedMotion) {
                gsap.set(['.hosp-stat', '.hosp-quote', '.hosp-pill'], { clearProps: 'transform' });
                return;
            }

            gsap.set(fadeItems, { opacity: 0, y: 24 });

            // Universal fade-up
            fadeItems.forEach((el: any) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' }
                    }
                );
            });

            // Stats counter stagger
            gsap.fromTo('.hosp-stat',
                { opacity: 0, y: 18 },
                {
                    opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06,
                    scrollTrigger: { trigger: '.hosp-stats-row', start: 'top 92%' }
                }
            );

            // Pull quote — slower reveal
            gsap.fromTo('.hosp-quote',
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
                    scrollTrigger: { trigger: '.hosp-quote', start: 'top 92%' }
                }
            );

            // Pills stagger
            gsap.fromTo('.hosp-pill',
                { opacity: 0, scale: 0.88 },
                {
                    opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)', stagger: 0.04,
                    scrollTrigger: { trigger: '.hosp-pills-row', start: 'top 92%' }
                }
            );

            // Parallax photo banner
            gsap.fromTo('.parallax-img-casarossa',
                { yPercent: -12 },
                {
                    yPercent: 12, ease: 'none',
                    scrollTrigger: {
                        trigger: '#media-casa-rossa-interiors',
                        start: 'top bottom', end: 'bottom top', scrub: true,
                    }
                }
            );

            // Parallax panoramic (night column)
            gsap.fromTo('.parallax-img-panoramic',
                { yPercent: -10 },
                {
                    yPercent: 10, ease: 'none',
                    scrollTrigger: {
                        trigger: '#media-casa-rossa-panoramic',
                        start: 'top bottom', end: 'bottom top', scrub: true,
                    }
                }
            );

            // Parallax day column photo
            gsap.fromTo('.parallax-img-day',
                { yPercent: -10 },
                {
                    yPercent: 10, ease: 'none',
                    scrollTrigger: {
                        trigger: '#media-casa-rossa-day',
                        start: 'top bottom', end: 'bottom top', scrub: true,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [prefersReducedMotion]);

    const stats = t.raw('Home.hospitality.stats') as { value: string; unit: string; label: string }[];
    const amenitiesPills = t.raw('Home.hospitality.amenitiesPills') as string[];
    const quote = t('Home.hospitality.quote');

    return (
        <section
            ref={sectionRef}
            id="03-ospitalita"
            data-section-label={t('UI.sectionLabels.hospitality')}
            style={{ background: 'var(--argilla-ferrosa)', overflow: 'hidden' }}
            aria-label="Ospitalità — La Casa Rossa"
        >
            {/* ── HEADER ───────────────────────────────────────── */}
            <div style={{ padding: '12vh 10vw 5vh' }}>
                <span className="label hosp-fade" style={{ display: 'block', marginBottom: '1.5rem', color: 'rgba(236,232,223,0.55)' }}>
                    {t('Home.hospitality.sectionLabel')}
                </span>
                <h2 className="hosp-fade" style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: 'clamp(2.8rem, 6vw, 8rem)',
                    lineHeight: 0.92,
                    color: 'var(--tufo)',
                    margin: 0,
                }}>
                    {t('Home.hospitality.heroLabel')}<em>{t('Home.hospitality.heroItalic')}</em>
                </h2>
            </div>



            {/* ── PULL QUOTE ───────────────────────────────────── */}
            <div style={{ padding: '8vh 10vw' }}>
                <p className="hosp-quote" style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.4rem, 2.8vw, 3.5rem)',
                    lineHeight: 1.25,
                    color: 'rgba(236,232,223,0.72)',
                    maxWidth: '860px',
                    whiteSpace: 'pre-line',
                    margin: 0,
                }}>
                    "{quote}"
                </p>
            </div>

            {/* ── PHOTO BANNER (interni) ────────────────────────── */}
            <div
                id="media-casa-rossa-interiors"
                style={{
                    width: '100%',
                    height: '70vh',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Image
                    src="/images/casa-rossa-interni.png"
                    alt="La Casa Rossa — Interni"
                    fill
                    className="parallax-img-casarossa"
                    style={{ objectFit: 'cover', scale: '1.25', transformOrigin: 'center center' }}
                    sizes="100vw"
                    priority
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(176,92,70,0.28) 0%, transparent 30%, transparent 70%, rgba(176,92,70,0.4) 100%)',
                    pointerEvents: 'none',
                }} />
                
                {/* ── CTA ESPLORA (Centered Overlay) ──────────────── */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}>
                    <div style={{ pointerEvents: 'auto' }} className="hosp-fade">
                        <TransitionLink
                            href={t('Home.hospitality.cta.href')}
                            bgColor="var(--argilla-ferrosa)"
                            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[rgba(236,232,223,0.3)] px-8 py-4"
                            style={{ background: 'var(--argilla-ferrosa)' }}
                        >
                            {/* Fill dal basso verso l'alto */}
                            <span
                                aria-hidden="true"
                                className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[var(--tufo)] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-y-100"
                            />
                            <span className="relative z-10 font-inter text-xs font-medium uppercase tracking-[0.15em] text-[rgba(236,232,223,0.92)] transition-colors duration-300 group-hover:text-[var(--argilla-ferrosa)]">
                                {t('Home.hospitality.cta.label')}
                            </span>
                            <span className="relative z-10 block h-px w-6 bg-[rgba(236,232,223,0.6)] transition-all duration-300 group-hover:w-10 group-hover:bg-[var(--argilla-ferrosa)]" />
                        </TransitionLink>
                    </div>
                </div>
            </div>

            {/* ── STATS BAR ────────────────────────────────────── */}
            <div
                className="hosp-stats-row grid grid-cols-2 lg:grid-cols-4"
                style={{
                    padding: '4vh 8vw',
                    gap: '2px',
                    borderTop: '1px solid rgba(236,232,223,0.15)',
                    borderBottom: '1px solid rgba(236,232,223,0.15)',
                }}
            >
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="hosp-stat"
                        style={{
                            padding: '2rem 1.5rem',
                            borderRight: i < stats.length - 1 ? '1px solid rgba(236,232,223,0.12)' : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.3rem',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                            <span style={{
                                fontFamily: 'var(--font-playfair), serif',
                                fontSize: 'clamp(2rem, 3.5vw, 4.5rem)',
                                lineHeight: 1,
                                color: 'var(--tufo)',
                                fontWeight: 400,
                            }}>
                                {stat.value}
                            </span>
                            <span style={{
                                fontFamily: 'var(--font-inter)',
                                fontSize: 'clamp(11px, 1vw, 14px)',
                                color: 'rgba(236,232,223,0.5)',
                                letterSpacing: '0.05em',
                            }}>
                                {stat.unit}
                            </span>
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '9px',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: 'rgba(236,232,223,0.38)',
                        }}>
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── TWO COLUMNS ──────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{
                gap: '0',
                borderTop: '1px solid rgba(236,232,223,0.12)',
            }}>
                {/* Day */}
                <article className="lg:border-r lg:border-[rgba(236,232,223,0.12)]" style={{
                    padding: '7vh 8vw',
                }}>
                    <span className="label hosp-fade" style={{ display: 'block', marginBottom: '1.5rem', color: 'rgba(236,232,223,0.5)' }}>
                        {t('Home.hospitality.columns.day.label')}
                    </span>
                    <p className="hosp-fade" style={{ fontSize: 'clamp(14px, 1.15vw, 17px)', lineHeight: 1.85, color: 'rgba(236,232,223,0.85)', marginBottom: '2.5rem' }}>
                        {t.rich('Home.hospitality.columns.day.text', { br: () => <br /> })}
                    </p>

                    {/* Day photo */}
                    <div
                        id="media-casa-rossa-day"
                        className="hosp-fade"
                        style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '2px' }}
                    >
                        <Image
                            src="/images/villa-buontalenti.png"
                            alt="La Casa Rossa — Villa"
                            fill
                            className="parallax-img-day"
                            style={{ objectFit: 'cover', scale: '1.15', transformOrigin: 'center center' }}
                            sizes="(max-width: 1023px) 100vw, 50vw"
                        />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(176,92,70,0.1)',
                            pointerEvents: 'none',
                        }} />
                    </div>
                </article>

                {/* Night */}
                <article style={{ padding: '7vh 8vw' }}>
                    <span className="label hosp-fade" style={{ display: 'block', marginBottom: '1.5rem', color: 'rgba(236,232,223,0.5)' }}>
                        {t('Home.hospitality.columns.night.label')}
                    </span>
                    <p className="hosp-fade" style={{ fontSize: 'clamp(14px, 1.15vw, 17px)', lineHeight: 1.85, color: 'rgba(236,232,223,0.85)', marginBottom: '2.5rem' }}>
                        {t.rich('Home.hospitality.columns.night.text', {
                            br: () => <br />,
                            emClass: (chunks) => <em style={{ fontFamily: 'var(--font-playfair)' }}>{chunks}</em>
                        })}
                    </p>

                    {/* Panoramic photo replacing star placeholder */}
                    <div
                        id="media-casa-rossa-panoramic"
                        className="hosp-fade"
                        style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '2px' }}
                    >
                        <Image
                            src="/images/casa-rossa-panoramic.png"
                            alt="La Casa Rossa — Vista panoramica"
                            fill
                            className="parallax-img-panoramic"
                            style={{ objectFit: 'cover', scale: '1.15', transformOrigin: 'center center' }}
                            sizes="(max-width: 1023px) 100vw, 50vw"
                        />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(176,92,70,0.12)',
                            pointerEvents: 'none',
                        }} />
                    </div>
                </article>
            </div>

            {/* ── AMENITIES PILLS ──────────────────────────────── */}
            <div style={{
                padding: '5vh 10vw 6vh',
                borderTop: '1px solid rgba(236,232,223,0.12)',
            }}>
                <span className="label hosp-fade" style={{ display: 'block', marginBottom: '1.8rem', color: 'rgba(236,232,223,0.45)' }}>
                    {t('Home.hospitality.amenities.title')}
                </span>
                <div className="hosp-pills-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {amenitiesPills.map((pill) => (
                        <span
                            key={pill}
                            className="hosp-pill"
                            style={{
                                fontFamily: 'var(--font-inter)',
                                fontSize: '11px',
                                letterSpacing: '0.12em',
                                color: 'rgba(236,232,223,0.7)',
                                border: '1px solid rgba(236,232,223,0.2)',
                                borderRadius: '9999px',
                                padding: '0.45rem 1rem',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {pill}
                        </span>
                    ))}
                </div>
            </div>


        </section>
    );
}
