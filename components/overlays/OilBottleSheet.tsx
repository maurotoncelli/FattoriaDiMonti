'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';

export default function OilBottleSheet() {
    const setOilSheetOpen = useAppStore((s) => s.setOilSheetOpen);
    const setConciergeOpen = useAppStore((s) => s.setConciergeOpen);
    const selectedBottleId = useAppStore((s) => s.selectedBottleId);
    const tOverlay = useTranslations('Overlays.oilBottleSheet');
    const tRaw = useTranslations();
    const overlayRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);
    const isClosingRef = useRef(false);

    // Read bottles directly from raw JSON — avoids triggering t.rich() on other Olio fields
    const rawBottles = tRaw.raw('Olio.bottles') as any[];
    const bottles = rawBottles.map((b: any) => ({
        id: b.id as string,
        name: b.name as string,
        subtitle: b.subtitle as string,
        description: b.description as string,
        tastingNotes: b.tastingNotes as string[],
        specs: b.specs as { label: string; value: string }[],
        labelColor: b.labelColor as string,
        glowColor: b.glowColor as string,
        ctaLabel: b.ctaLabel as string,
    }));
    const selectedBottle = bottles.find((b) => b.id === selectedBottleId) || bottles[0];

    // ── Close handler ──
    const handleClose = useCallback(() => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;
        if (!overlayRef.current) { setOilSheetOpen(false); return; }
        gsap.to(overlayRef.current, {
            yPercent: 100,
            duration: 0.65,
            ease: 'power4.in',
            onComplete: () => setOilSheetOpen(false),
        });
    }, [setOilSheetOpen]);

    // ── ESC key ──
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleClose]);

    // ── Content stagger on mount ──
    useEffect(() => {
        if (!heroRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                heroRef.current!.querySelectorAll('[data-anim]'),
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.25 }
            );
        }, heroRef);
        return () => ctx.revert();
    }, []);

    // ── Animate content swap on bottle change ──
    useEffect(() => {
        if (!heroRef.current) return;
        gsap.fromTo(heroRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
        if (detailsRef.current) {
            gsap.fromTo(detailsRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 });
        }
    }, [selectedBottleId]);

    const handleSelectBottle = (id: string) => {
        if (id === selectedBottleId) return;
        if (heroRef.current) {
            gsap.to(heroRef.current, {
                opacity: 0, y: -15, duration: 0.2, ease: 'power2.in',
                onComplete: () => useAppStore.getState().setOilSheetOpen(true, id),
            });
        }
    };

    const handleOrder = () => {
        handleClose();
        setTimeout(() => setConciergeOpen(true, 'default'), 700);
    };

    if (!selectedBottle) return null;

    // Tasting notes icons map
    const noteIcons: Record<string, string> = {
        'Carciofo': '🌿',
        'Mandorla': '🤍',
        'Finale pepato': '🌶',
        'Polifenoli': '⚗️',
        'Erbe amare': '🌱',
        'Persistenza': '✦',
        'Oliva verde': '🫒',
        'Nocciola': '🤎',
        'Spezie dolci': '🍂',
    };

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={tOverlay('ariaLabel')}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 90,
                background: 'var(--terra-nera)',
                overflowY: 'auto',
                overflowX: 'hidden',
                animation: 'oilSheetSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                scrollBehavior: 'smooth',
            }}
        >
            {/* ── Close button ── */}
            <button
                onClick={handleClose}
                aria-label={tOverlay('closeAria')}
                style={{
                    position: 'fixed',
                    top: 'calc(1.5rem + env(safe-area-inset-top, 0px))',
                    right: '1.5rem',
                    zIndex: 91,
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(180,184,134,0.35)',
                    borderRadius: 9999,
                    padding: '0.55rem 1.4rem',
                    color: '#B4B886',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase' as const,
                    cursor: 'none',
                    transition: 'border-color 0.3s, background 0.3s',
                }}
            >
                {tOverlay('closeLabel')}
            </button>

            {/* ══════════════════════════════════════════
                SEZIONE 1 — HERO (100vh, bottiglia + info chiave)
            ══════════════════════════════════════════ */}
            <div
                ref={heroRef}
                style={{
                    minHeight: '100vh',
                    width: '100%',
                    maxWidth: 1400,
                    margin: '0 auto',
                    padding: '10vh 6vw 4vh',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: 0,
                }}
            >
                {/* ── Flavor Switcher — grande e leggibile ── */}
                <div
                    data-anim
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap' as const,
                        gap: 12,
                        marginBottom: 48,
                        marginTop: 8,
                    }}
                >
                    {bottles.map((b) => {
                        const isActive = selectedBottleId === b.id;
                        return (
                            <button
                                key={b.id}
                                type="button"
                                onClick={() => handleSelectBottle(b.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    borderRadius: 16,
                                    padding: '14px 24px',
                                    fontFamily: 'var(--font-inter)',
                                    cursor: 'none',
                                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                                    border: isActive
                                        ? `1.5px solid ${b.labelColor}`
                                        : '1.5px solid rgba(255,255,255,0.12)',
                                    background: isActive
                                        ? `${b.labelColor}22`
                                        : 'rgba(255,255,255,0.04)',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: isActive
                                        ? `0 0 24px ${b.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
                                        : 'none',
                                }}
                            >
                                {/* Swatch colore etichetta */}
                                <span style={{
                                    display: 'inline-block',
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: b.labelColor,
                                    flexShrink: 0,
                                    boxShadow: isActive ? `0 0 8px ${b.labelColor}` : 'none',
                                    transition: 'box-shadow 0.35s',
                                }} />
                                <span style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start', gap: 2 }}>
                                    <span style={{
                                        fontSize: 13,
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive ? '#F3EFE7' : 'rgba(255,255,255,0.5)',
                                        letterSpacing: '0.04em',
                                        transition: 'color 0.3s, font-weight 0.3s',
                                        lineHeight: 1.1,
                                    }}>{b.name}</span>
                                    <span style={{
                                        fontSize: 9,
                                        letterSpacing: '0.22em',
                                        textTransform: 'uppercase' as const,
                                        color: isActive ? b.labelColor : 'rgba(255,255,255,0.3)',
                                        transition: 'color 0.3s',
                                    }}>{b.subtitle}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── CORPO HERO: bottiglia + dettagli ── */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column' as const,
                        gap: 48,
                        flex: 1,
                    }}
                    className="lg:flex-row lg:items-stretch lg:gap-[6vw]"
                >
                    {/* ─── Left: Bottle visual ─── */}
                    <div data-anim style={{ position: 'relative', flexShrink: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', width: '100%' }} className="lg:w-5/12">
                        {/* Glow */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%,-50%)',
                            width: 480, height: 480, borderRadius: '50%',
                            background: selectedBottle.glowColor,
                            opacity: 0.28, filter: 'blur(90px)',
                            transition: 'background 0.7s',
                            pointerEvents: 'none',
                        }} />

                        {/* CSS Bottle */}
                        <div style={{ position: 'relative', height: 440, width: 176 }}>
                            {/* Shadow */}
                            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', height: 24, width: 220, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', filter: 'blur(18px)' }} />
                            {/* Neck cap */}
                            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', height: 96, width: 56, borderRadius: '1rem 1rem 0 0', background: '#15130f', boxShadow: '0 0 0 1px rgba(255,255,255,0.10)' }} />
                            {/* Neck shoulder */}
                            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', height: 48, width: 96, borderRadius: '5rem 5rem 0 0', background: '#1d1a13', boxShadow: '0 0 0 1px rgba(255,255,255,0.10)' }} />
                            {/* Body */}
                            <div style={{ position: 'absolute', inset: '0 0 0 0', top: 'auto', bottom: 0, height: 340, borderRadius: '3rem 3rem 1.3rem 1.3rem', background: 'linear-gradient(135deg, #16130d, #2b2618, #090806)', boxShadow: '0 0 0 1px rgba(255,255,255,0.10)' }} />
                            {/* Highlight */}
                            <div style={{ position: 'absolute', top: 148, left: 28, height: 210, width: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.20)', filter: 'blur(2px)' }} />
                            {/* Label */}
                            <div style={{
                                position: 'absolute', top: 156, left: '50%', transform: 'translateX(-50%)',
                                height: 160, width: 162,
                                borderRadius: '1.35rem',
                                background: selectedBottle.labelColor,
                                border: '1px solid rgba(255,255,255,0.22)',
                                boxShadow: `0 0 50px ${selectedBottle.glowColor}`,
                                display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.6s, box-shadow 0.6s',
                                backdropFilter: 'blur(4px)',
                            }}>
                                <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 34, fontStyle: 'italic', lineHeight: 1, color: '#F3EFE7' }}>Monti</span>
                                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: '0.24em', color: 'rgba(243,239,231,0.90)', marginTop: 12 }}>{selectedBottle.subtitle}</span>
                            </div>
                        </div>
                    </div>

                    {/* ─── Right: Details ─── */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', maxWidth: 620, paddingBottom: '2vh' }}>

                        {/* Eyebrow */}
                        <span data-anim style={{ fontFamily: 'var(--font-inter)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' as const, marginBottom: 14, color: '#B4B886', fontWeight: 600, display: 'block' }}>
                            {tOverlay('eyebrow')}
                        </span>

                        {/* Subtitle */}
                        <span data-anim style={{ fontFamily: 'var(--font-inter)', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.24em', marginBottom: 10, display: 'block', color: selectedBottle.labelColor, transition: 'color 0.5s' }}>
                            {selectedBottle.subtitle}
                        </span>

                        {/* Name */}
                        <h2 data-anim style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontStyle: 'italic', lineHeight: 0.95, color: '#ECE8DF', marginBottom: 22 }}>
                            {selectedBottle.name}
                        </h2>

                        {/* Description */}
                        <p data-anim style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(15px, 1.1vw, 17px)', lineHeight: 1.85, color: 'rgba(236,232,223,0.75)', fontWeight: 300, marginBottom: 32, maxWidth: '52ch' }}>
                            {selectedBottle.description}
                        </p>

                        {/* Specs */}
                        <div data-anim style={{ display: 'flex', flexDirection: 'column' as const, gap: 0, marginBottom: 28, maxWidth: 440 }}>
                            {selectedBottle.specs.map((spec) => (
                                <div
                                    key={spec.label}
                                    style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '11px 0' }}
                                >
                                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.2em', color: 'rgba(180,184,134,0.7)' }}>
                                        {spec.label}
                                    </span>
                                    <strong style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, fontStyle: 'italic', fontWeight: 'normal', color: '#ECE8DF', marginLeft: 16, textAlign: 'right' as const }}>
                                        {spec.value}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        {/* Tasting notes */}
                        <div data-anim style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 36 }}>
                            {selectedBottle.tastingNotes.map((note) => (
                                <span
                                    key={note}
                                    style={{
                                        borderRadius: 9999,
                                        border: `1px solid ${selectedBottle.labelColor}55`,
                                        background: `${selectedBottle.labelColor}18`,
                                        padding: '9px 20px',
                                        fontFamily: 'var(--font-inter)',
                                        fontSize: 11,
                                        letterSpacing: '0.12em',
                                        color: '#ECE8DF',
                                        backdropFilter: 'blur(4px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                                    <span style={{ fontSize: 13 }}>{noteIcons[note] ?? '✦'}</span>
                                    {note}
                                </span>
                            ))}
                        </div>

                        {/* CTA */}
                        <div data-anim>
                            <button
                                onClick={handleOrder}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 9999,
                                    background: '#ECE8DF',
                                    border: 'none',
                                    padding: '20px 48px',
                                    minWidth: 240,
                                    fontFamily: 'var(--font-inter)',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    textTransform: 'uppercase' as const,
                                    letterSpacing: '0.2em',
                                    color: '#12110E',
                                    cursor: 'none',
                                    transition: 'transform 0.3s',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                }}
                            >
                                {tOverlay('ctaOrder')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Scroll hint ── */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    alignItems: 'center',
                    gap: 8,
                    paddingTop: 32,
                    paddingBottom: 16,
                    animation: 'scrollBounce 2s ease-in-out infinite',
                }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: 'rgba(180,184,134,0.5)' }}>
                        Scorri per i dettagli
                    </span>
                    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ opacity: 0.4 }}>
                        <rect x="6.5" y="0" width="3" height="10" rx="1.5" fill="#B4B886" />
                        <path d="M8 18 L4 13 M8 18 L12 13" stroke="#B4B886" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                SEZIONE 2 — DETTAGLI ESTESI (scrollabile)
            ══════════════════════════════════════════ */}
            <div
                ref={detailsRef}
                style={{
                    width: '100%',
                    maxWidth: 1400,
                    margin: '0 auto',
                    padding: '6vh 6vw 12vh',
                }}
            >
                {/* ── Divisore ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    marginBottom: 72,
                }}>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(180,184,134,0.3), transparent)' }} />
                    <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 13, fontStyle: 'italic', color: 'rgba(180,184,134,0.6)', whiteSpace: 'nowrap' as const }}>
                        Approfondimento — {selectedBottle.name}
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(180,184,134,0.3))' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 80 }}>

                    {/* ── Blocco 1: Il Territorio & Cultivar ── */}
                    <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }} className="md:grid-cols-2">
                        <div>
                            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: '#B4B886', display: 'block', marginBottom: 16 }}>
                                Il Territorio
                            </span>
                            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', fontStyle: 'italic', color: '#ECE8DF', lineHeight: 1.1, marginBottom: 20 }}>
                                Radici nella<br />roccia calcarea.
                            </h3>
                            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, lineHeight: 1.85, color: 'rgba(236,232,223,0.65)', fontWeight: 300, maxWidth: '46ch' }}>
                                Le nostre olive crescono su pendenze calcaree a 150 metri sul livello del mare, battute dalla brezza mediterranea. Un microclima che nessun agronomo può replicare: è il patrimonio geologico della Toscana più profonda.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 1 }}>
                            {[
                                { label: 'Terroir', value: 'Colline calcaree · Volterra' },
                                { label: 'Altitudine', value: '150 m s.l.m.' },
                                { label: 'Cultivar', value: 'Razzo, Leccino, Moraiolo' },
                                { label: 'Età media piante', value: '30–80 anni' },
                                { label: 'Raccolta', value: 'Manuale · Ottobre–Dicembre' },
                            ].map((row) => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.18em', color: 'rgba(180,184,134,0.6)' }}>{row.label}</span>
                                    <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 15, fontStyle: 'italic', color: '#ECE8DF' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Divisore sottile ── */}
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

                    {/* ── Blocco 2: Il Processo ── */}
                    <section>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: '#B4B886', display: 'block', marginBottom: 16 }}>
                            Il Metodo
                        </span>
                        <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', fontStyle: 'italic', color: '#ECE8DF', lineHeight: 1.1, marginBottom: 40 }}>
                            Dal frutto all'oro,<br />in poche ore.
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                            {[
                                { step: '01', title: 'Raccolta manuale', desc: 'Agevolatori pneumatici proteggono la drupa. Nessun contatto con il suolo.' },
                                { step: '02', title: 'Frangitura entro 10 ore', desc: 'L\'oliva "respira" e consuma i polifenoli: l\'urgenza è tutto.' },
                                { step: '03', title: 'Gramolatura a freddo', desc: 'Sotto i 27°C per 30 minuti: le molecole aromatiche restano intatte.' },
                                { step: '04', title: 'Estrazione centrifuga', desc: '3500 giri/min separano l\'oro liquido dall\'acqua e dalla sansa.' },
                            ].map((item) => (
                                <div
                                    key={item.step}
                                    style={{
                                        padding: '28px 24px',
                                        borderRadius: 16,
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        background: 'rgba(255,255,255,0.03)',
                                        backdropFilter: 'blur(8px)',
                                    }}
                                >
                                    <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 40, fontStyle: 'italic', color: selectedBottle.labelColor, opacity: 0.5, lineHeight: 1, display: 'block', marginBottom: 12 }}>
                                        {item.step}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#ECE8DF', display: 'block', marginBottom: 8 }}>
                                        {item.title}
                                    </span>
                                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, lineHeight: 1.7, color: 'rgba(236,232,223,0.55)', fontWeight: 300 }}>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Divisore sottile ── */}
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

                    {/* ── Blocco 3: Abbinamenti ── */}
                    <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }} className="md:grid-cols-2">
                        <div>
                            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: '#B4B886', display: 'block', marginBottom: 16 }}>
                                Abbinamenti
                            </span>
                            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', fontStyle: 'italic', color: '#ECE8DF', lineHeight: 1.1, marginBottom: 20 }}>
                                La cucina<br />come tela.
                            </h3>
                            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, lineHeight: 1.85, color: 'rgba(236,232,223,0.65)', fontWeight: 300, maxWidth: '44ch' }}>
                                {selectedBottle.id === 'classico' && 'Una fedeltà quotidiana: sul pane di Altamura ancora caldo, su carpacci di branzino, crudo su insalate di finocchio e arancia. La versatilità elevata a virtù.'}
                                {selectedBottle.id === 'riserva' && 'Pensata per chi cerca intensità: su bistecche alla fiorentina rare, su zuppe di legumi rustiche, su formaggi a pasta dura stagionati. Da gustare anche in purezza.'}
                                {selectedBottle.id === 'selezione' && 'Il gastronomico toscano nella sua forma più autentica: su ribollita, bruschette di pane sciocco, carni grigliate e zuppe di farro. Da condividere.'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 12, alignContent: 'flex-start' as const }}>
                            {(selectedBottle.id === 'classico'
                                ? ['Carpaccio di branzino', 'Pane toscano caldo', 'Insalate fresche', 'Ribollita leggera', 'Verdure al vapore', 'Formaggi freschi']
                                : selectedBottle.id === 'riserva'
                                ? ['Bistecca Fiorentina', 'Zuppa di lenticchie', 'Pecorino stagionato', 'Straccetti', 'Legumi rustici', 'Degustazione in purezza']
                                : ['Ribollita', 'Bruschette', 'Farro e legumi', 'Carni grigliate', 'Panzanella', 'Cacciucco']
                            ).map((pairing) => (
                                <span
                                    key={pairing}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: 10,
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.04)',
                                        fontFamily: 'var(--font-inter)',
                                        fontSize: 12,
                                        color: 'rgba(236,232,223,0.75)',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    {pairing}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* ── Divisore sottile ── */}
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

                    {/* ── Blocco 4: Riconoscimenti ── */}
                    <section>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: '#B4B886', display: 'block', marginBottom: 16 }}>
                            Riconoscimenti
                        </span>
                        <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', fontStyle: 'italic', color: '#ECE8DF', lineHeight: 1.1, marginBottom: 40 }}>
                            Certificato dai<br />migliori al mondo.
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 20 }}>
                            {[
                                { year: '2022', award: 'Flos Olei', detail: 'Top 100 Migliori Oli al Mondo' },
                                { year: '2022', award: 'NYIOOC', detail: 'Medaglia d\'Oro · New York' },
                                { year: '2022', award: 'Premio Grande Gusto', detail: '3 Stelle — Eccellenza Assoluta' },
                            ].map((a) => (
                                <div
                                    key={a.award}
                                    style={{
                                        flex: '1 1 220px',
                                        padding: '28px 24px',
                                        borderRadius: 16,
                                        border: `1px solid ${selectedBottle.labelColor}33`,
                                        background: `${selectedBottle.labelColor}0D`,
                                        backdropFilter: 'blur(8px)',
                                    }}
                                >
                                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: selectedBottle.labelColor, display: 'block', marginBottom: 12 }}>
                                        {a.year}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, fontStyle: 'italic', color: '#ECE8DF', display: 'block', marginBottom: 8 }}>
                                        {a.award}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'rgba(236,232,223,0.55)', lineHeight: 1.5 }}>
                                        {a.detail}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── CTA finale ── */}
                    <div style={{
                        textAlign: 'center' as const,
                        padding: '64px 32px',
                        borderRadius: 24,
                        border: '1px solid rgba(180,184,134,0.15)',
                        background: 'rgba(180,184,134,0.04)',
                        backdropFilter: 'blur(12px)',
                    }}>
                        <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontStyle: 'italic', color: '#ECE8DF', marginBottom: 8, lineHeight: 1.3 }}>
                            Porta l'anima di Monti sulla tua tavola.
                        </p>
                        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'rgba(236,232,223,0.5)', marginBottom: 32, fontWeight: 300 }}>
                            Disponibilità limitata per annata. Spedizione in tutta Italia.
                        </p>
                        <button
                            onClick={handleOrder}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 12,
                                borderRadius: 9999,
                                background: '#ECE8DF',
                                border: 'none',
                                padding: '22px 56px',
                                fontFamily: 'var(--font-inter)',
                                fontSize: 11,
                                fontWeight: 700,
                                textTransform: 'uppercase' as const,
                                letterSpacing: '0.22em',
                                color: '#12110E',
                                cursor: 'none',
                                transition: 'transform 0.3s',
                                boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 60px ${selectedBottle.glowColor}`,
                            }}
                        >
                            {tOverlay('ctaOrder')}
                            <span>→</span>
                        </button>
                    </div>

                </div>
            </div>

            <style jsx global>{`
                @keyframes oilSheetSlideUp {
                    from { transform: translateY(100%); opacity: 0.5; }
                    to   { transform: translateY(0%);   opacity: 1;   }
                }
                @keyframes scrollBounce {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50%       { transform: translateY(6px); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
}
