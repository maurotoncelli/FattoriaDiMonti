'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/ui/TransitionLink';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/hooks/usePerformance';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Hospitality() {
    const sectionRef = useRef<HTMLElement>(null);
    const t = useTranslations();
    const setConciergeOpen = useAppStore((s) => s.setConciergeOpen);
    const prefersReducedMotion = useReducedMotion();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (prefersReducedMotion) return;

            gsap.utils.toArray('.hosp-fade').forEach((el: any) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' }
                    }
                );
            });

            // Parallax sulle foto (pulite, senza overlay colorati)
            [
                { img: '.parallax-img-casarossa', trigger: '#media-casa-rossa-interiors', amount: 12 },
                { img: '.parallax-img-day', trigger: '#media-casa-rossa-day', amount: 10 },
                { img: '.parallax-img-panoramic', trigger: '#media-casa-rossa-panoramic', amount: 10 },
            ].forEach(({ img, trigger, amount }) => {
                gsap.fromTo(img,
                    { yPercent: -amount },
                    {
                        yPercent: amount, ease: 'none',
                        scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true }
                    }
                );
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [prefersReducedMotion]);

    const facts = t.raw('Home.hospitality.facts') as string[];

    return (
        <section
            ref={sectionRef}
            id="03-ospitalita"
            data-section-label={t('UI.sectionLabels.hospitality')}
            style={{ background: 'transparent', overflow: 'hidden', color: 'var(--mucco-pisano)' }}
            aria-label={t('Home.hospitality.ariaLabel')}
        >
            {/* ── HEADER ───────────────────────────────────────── */}
            <div style={{ padding: '14vh 10vw 6vh' }}>
                <span className="label hosp-fade" style={{ display: 'block', marginBottom: '1.5rem' }}>
                    {t('Home.hospitality.sectionLabel')}
                </span>
                <h2 className="hosp-fade" style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: 'clamp(2.8rem, 6vw, 7.5rem)',
                    lineHeight: 0.92,
                    color: 'var(--mucco-pisano)',
                    margin: 0,
                }}>
                    {t('Home.hospitality.heroLabel')}
                    <em style={{ color: 'var(--argilla-ferrosa)' }}>{t('Home.hospitality.heroItalic')}</em>
                </h2>
                <p className="hosp-fade" style={{
                    marginTop: '2.5rem',
                    fontSize: 'clamp(15px, 1.2vw, 18px)',
                    lineHeight: 1.75,
                    maxWidth: '640px',
                    color: 'var(--mucco-pisano)',
                    opacity: 0.85,
                }}>
                    {t('Home.hospitality.intro')}
                </p>
            </div>

            {/* ── FOTO PRINCIPALE (interni) — pulita, senza velature ── */}
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
                    src="/images/casa-rossa-interni.webp"
                    alt={t('Home.hospitality.media.interiorsAlt')}
                    fill
                    className="parallax-img-casarossa"
                    style={{ objectFit: 'cover', scale: '1.25', transformOrigin: 'center center' }}
                    sizes="100vw"
                    priority
                />
            </div>

            {/* ── FATTI ESSENZIALI ─────────────────────────────── */}
            <div
                className="hosp-fade"
                style={{
                    padding: '4.5vh 10vw',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'baseline',
                    gap: '1rem 3.5rem',
                    borderBottom: '1px solid rgba(82,70,58,0.14)',
                }}
            >
                {facts.map((fact) => (
                    <span
                        key={fact}
                        style={{
                            fontFamily: 'var(--font-playfair), serif',
                            fontStyle: 'italic',
                            fontSize: 'clamp(1.1rem, 1.7vw, 1.6rem)',
                            color: 'var(--mucco-pisano)',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {fact}
                    </span>
                ))}
            </div>

            {/* ── RACCONTO SFALSATO: L'ABITARE / L'ESPERIENZA ────
                Fasce asimmetriche alternate stile rivista: foto grande
                e pannello di testo che le si sovrappone dal lato opposto. */}

            {/* Fascia 1 — Le giornate lente (foto sinistra, testo da destra) */}
            <div className="lg:grid lg:grid-cols-12 lg:items-center" style={{ padding: '10vh 0 5vh' }}>
                <div
                    id="media-casa-rossa-day"
                    className="hosp-fade lg:col-start-1 lg:col-end-9 lg:row-start-1"
                    style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden' }}
                >
                    <Image
                        src="/images/villa-buontalenti.webp"
                        alt={t('Home.hospitality.media.dayPhotoAlt')}
                        fill
                        className="parallax-img-day"
                        style={{ objectFit: 'cover', scale: '1.2', transformOrigin: 'center center' }}
                        sizes="(max-width: 1023px) 100vw, 66vw"
                    />
                </div>
                <article
                    className="hosp-fade relative z-10 mx-[6vw] -mt-14 lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:m-0 lg:mr-[5vw]"
                    style={{
                        background: 'rgba(234,230,221,0.96)',
                        padding: 'clamp(1.8rem, 3vw, 3rem)',
                        boxShadow: '0 24px 60px rgba(45,40,35,0.14)',
                        borderRadius: '2px',
                    }}
                >
                    <span className="label" style={{ display: 'block', marginBottom: '1rem', color: 'var(--argilla-ferrosa)' }}>
                        {t('Home.hospitality.columns.day.label')}
                    </span>
                    <h3 style={{
                        fontFamily: 'var(--font-playfair), serif',
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.7rem, 2.6vw, 2.7rem)',
                        lineHeight: 1.1,
                        color: 'var(--mucco-pisano)',
                        marginBottom: '1.2rem',
                    }}>
                        {t('Home.hospitality.columns.day.title')}
                    </h3>
                    <p style={{ fontSize: 'clamp(14px, 1.05vw, 16px)', lineHeight: 1.8, color: 'var(--mucco-pisano)', opacity: 0.85 }}>
                        {t('Home.hospitality.columns.day.text')}
                    </p>
                </article>
            </div>

            {/* Fascia 2 — Le notti stellate (foto destra, testo da sinistra) */}
            <div className="lg:grid lg:grid-cols-12 lg:items-center" style={{ padding: '5vh 0 10vh' }}>
                <div
                    id="media-casa-rossa-panoramic"
                    className="hosp-fade lg:col-start-5 lg:col-end-13 lg:row-start-1"
                    style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden' }}
                >
                    <Image
                        src="/images/casa-rossa-panoramic.webp"
                        alt={t('Home.hospitality.media.nightPhotoAlt')}
                        fill
                        className="parallax-img-panoramic"
                        style={{ objectFit: 'cover', scale: '1.2', transformOrigin: 'center center' }}
                        sizes="(max-width: 1023px) 100vw, 66vw"
                    />
                </div>
                <article
                    className="hosp-fade relative z-10 mx-[6vw] -mt-14 lg:col-start-1 lg:col-end-6 lg:row-start-1 lg:m-0 lg:ml-[5vw]"
                    style={{
                        background: 'rgba(234,230,221,0.96)',
                        padding: 'clamp(1.8rem, 3vw, 3rem)',
                        boxShadow: '0 24px 60px rgba(45,40,35,0.14)',
                        borderRadius: '2px',
                    }}
                >
                    <span className="label" style={{ display: 'block', marginBottom: '1rem', color: 'var(--argilla-ferrosa)' }}>
                        {t('Home.hospitality.columns.night.label')}
                    </span>
                    <h3 style={{
                        fontFamily: 'var(--font-playfair), serif',
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.7rem, 2.6vw, 2.7rem)',
                        lineHeight: 1.1,
                        color: 'var(--mucco-pisano)',
                        marginBottom: '1.2rem',
                    }}>
                        {t('Home.hospitality.columns.night.title')}
                    </h3>
                    <p style={{ fontSize: 'clamp(14px, 1.05vw, 16px)', lineHeight: 1.8, color: 'var(--mucco-pisano)', opacity: 0.85 }}>
                        {t('Home.hospitality.columns.night.text')}
                    </p>
                </article>
            </div>

            {/* ── INVITO FINALE ────────────────────────────────── */}
            <div style={{
                padding: '4vh 10vw 14vh',
                textAlign: 'center',
                borderTop: '1px solid rgba(82,70,58,0.14)',
            }}>
                <span className="label hosp-fade" style={{ display: 'block', marginTop: '5vh', marginBottom: '2rem' }}>
                    {t('Home.hospitality.highlights')}
                </span>
                <h3 className="hosp-fade" style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.8rem, 3.5vw, 3.4rem)',
                    lineHeight: 1.15,
                    color: 'var(--mucco-pisano)',
                    margin: '0 auto 1.5rem',
                }}>
                    {t('Home.hospitality.invite.title')}
                </h3>
                <p className="hosp-fade" style={{
                    fontSize: 'clamp(14px, 1.1vw, 16px)',
                    lineHeight: 1.75,
                    color: 'var(--mucco-pisano)',
                    opacity: 0.8,
                    maxWidth: '520px',
                    margin: '0 auto 3.5rem',
                }}>
                    {t('Home.hospitality.invite.text')}
                </p>
                <div className="hosp-fade" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                    <TransitionLink
                        href={t('Home.hospitality.cta.href')}
                        bgColor="#EAE6DD"
                        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-9 py-4"
                        style={{ background: 'var(--argilla-ferrosa)' }}
                    >
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[var(--mucco-pisano)] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-y-100"
                        />
                        <span className="relative z-10 font-inter text-xs font-medium uppercase tracking-[0.15em] text-[var(--tufo)]">
                            {t('Home.hospitality.cta.label')}
                        </span>
                        <span className="relative z-10 block h-px w-6 bg-[rgba(234,230,221,0.7)] transition-all duration-300 group-hover:w-10" />
                    </TransitionLink>
                    <button
                        onClick={() => setConciergeOpen(true, 'default')}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(82,70,58,0.35)',
                            borderRadius: '9999px',
                            padding: '1rem 2.2rem',
                            fontFamily: 'var(--font-inter)',
                            fontSize: '11px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--mucco-pisano)',
                            cursor: 'none',
                            transition: 'border-color 0.3s, background 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--mucco-pisano)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(82,70,58,0.35)';
                        }}
                    >
                        {t('Home.hospitality.invite.secondaryCta')}
                    </button>
                </div>
            </div>
        </section>
    );
}
