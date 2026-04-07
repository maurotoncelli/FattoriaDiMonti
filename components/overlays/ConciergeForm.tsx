'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';

const STEPS_DEFAULT = [
    { field: 'name' },
    { field: 'intent', isChoice: true },
    { field: 'contact' },
];

const STEPS_CUCINA = [
    { field: 'eventDate' },
    { field: 'guests' },
    { field: 'contact' },
];

type StepConf = {
    field: string;
    isChoice?: boolean;
    question: string;
    placeholder?: string;
    label: string;
    optional?: boolean;
};

import { useTranslations } from 'next-intl';

export default function ConciergeForm() {
    const { setConciergeOpen, conciergeContext } = useAppStore();
    const t = useTranslations('Overlays.concierge');
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const defaultStepsT = t.raw('defaultSteps') as any[];
    const cucinaStepsT = t.raw('cucinaSteps') as any[];

    const stepsConf: StepConf[] = conciergeContext === 'cucina-nomade'
        ? STEPS_CUCINA.map((s, i) => ({ ...s, question: cucinaStepsT[i].question, placeholder: cucinaStepsT[i].placeholder, label: cucinaStepsT[i].label, optional: cucinaStepsT[i].optional }))
        : STEPS_DEFAULT.map((s, i) => ({ ...s, question: defaultStepsT[i].question, placeholder: defaultStepsT[i].placeholder, label: defaultStepsT[i].label, optional: defaultStepsT[i].optional }));

    const step = stepsConf[currentStep];

    const goNext = async (value?: string) => {
        const newData = { ...formData, [step.field]: value || inputVal };
        setFormData(newData);

        if (currentStep < stepsConf.length - 1) {
            if (containerRef.current) {
                await gsap.to(containerRef.current, { y: -40, opacity: 0, duration: 0.5, ease: 'power3.inOut' });
            }
            setInputVal('');
            setCurrentStep((s) => s + 1);
            if (containerRef.current) {
                gsap.fromTo(containerRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
            }
        } else {
            // Submit
            try {
                await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newData),
                });
            } catch (_) { }
            setSubmitted(true);
            setTimeout(() => setConciergeOpen(false), 3500);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputVal.trim()) goNext();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={t('ariaLabel')}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 90,
                background: 'rgba(43, 36, 32, 0.88)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.5s ease',
            }}
        >
            {/* WhatsApp pill — top right */}
            <a
                href={`https://wa.me/393000000000?text=${encodeURIComponent(t('whatsappPreflight'))}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: 'calc(1.5rem + env(safe-area-inset-top, 0px))',
                    right: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    border: '1px solid rgba(107,122,101,0.4)',
                    borderRadius: '9999px',
                    padding: '0.45rem 1.2rem',
                    textDecoration: 'none',
                    color: 'var(--olive)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    transition: 'border-color 0.3s',
                }}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                {t('directLineLabel')}
            </a>

            {/* Close */}
            <button
                onClick={() => setConciergeOpen(false)}
                aria-label={t('closeAria')}
                style={{
                    position: 'absolute',
                    top: 'calc(1.5rem + env(safe-area-inset-top, 0px))',
                    left: '1.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(107,122,101,0.3)',
                    borderRadius: '9999px',
                    padding: '0.45rem 1.2rem',
                    color: 'var(--olive)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'none',
                }}
            >
                {t('closeLabel')}
            </button>

            {/* Progress bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(107,122,101,0.2)' }}>
                <div style={{
                    height: '100%',
                    background: 'var(--olive)',
                    width: `${submitted ? 100 : ((currentStep) / stepsConf.length) * 100}%`,
                    transition: 'width 0.6s ease',
                }} />
            </div>

            {/* Form content */}
            <div ref={containerRef} style={{ textAlign: 'center', maxWidth: 'min(92vw, 680px)', width: '100%', padding: '2rem 1.5rem' }}>
                {submitted ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <p style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 'clamp(1.3rem, 2.5vw, 2.8rem)', color: 'var(--tufo)', lineHeight: 1.3 }}>
                            {t.rich('successMessageHtml', { br: () => <br /> })}
                        </p>
                        <button
                            onClick={() => setConciergeOpen(false)}
                            aria-label="Chiudi"
                            style={{
                                position: 'absolute',
                                top: '-1rem',
                                right: 0,
                                background: 'transparent',
                                border: '1px solid rgba(236,232,223,0.2)',
                                borderRadius: '50%',
                                width: 36,
                                height: 36,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(236,232,223,0.5)',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s, color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,232,223,0.6)';
                                (e.currentTarget as HTMLElement).style.color = 'rgba(236,232,223,0.9)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,232,223,0.2)';
                                (e.currentTarget as HTMLElement).style.color = 'rgba(236,232,223,0.5)';
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Optional badge */}
                        {step.optional && (
                            <span style={{
                                display: 'inline-block',
                                marginBottom: '1.2rem',
                                fontFamily: 'var(--font-inter)',
                                fontSize: '9px',
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                color: 'rgba(180,184,134,0.7)',
                                border: '1px solid rgba(180,184,134,0.25)',
                                borderRadius: '9999px',
                                padding: '0.3rem 0.9rem',
                            }}>
                                {t('optionalHint')}
                            </span>
                        )}

                        {/* Question */}
                        <p style={{
                            fontFamily: 'var(--font-playfair)',
                            fontStyle: 'italic',
                            fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                            color: 'rgba(236,232,223,0.75)',
                            lineHeight: 1.4,
                            marginBottom: '2.5rem',
                            marginTop: step.optional ? 0 : '0.5rem',
                        }}>
                            {step.question}
                        </p>

                        {/* Input or choices */}
                        {step.isChoice ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                                {(t.raw('choices') as string[]).map((choice) => (
                                    <button
                                        key={choice}
                                        onClick={() => goNext(choice)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid rgba(107,122,101,0.35)',
                                            borderRadius: '9999px',
                                            padding: '0.75rem 2.2rem',
                                            color: 'var(--tufo)',
                                            fontFamily: 'var(--font-inter)',
                                            fontSize: '10px',
                                            letterSpacing: '0.15em',
                                            textTransform: 'uppercase',
                                            cursor: 'none',
                                            transition: 'border-color 0.3s, background 0.3s',
                                            width: '100%',
                                            maxWidth: '340px',
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--argilla-ferrosa)';
                                            (e.currentTarget as HTMLElement).style.background = 'rgba(176,92,70,0.08)';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,122,101,0.35)';
                                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                                        }}
                                    >
                                        {choice}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                <input
                                    type="text"
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={step.placeholder || ''}
                                    autoFocus
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(107,122,101,0.4)',
                                        outline: 'none',
                                        width: '100%',
                                        fontFamily: 'var(--font-playfair)',
                                        fontSize: 'clamp(1.4rem, 2.5vw, 3rem)',
                                        color: 'var(--tufo)',
                                        textAlign: 'center',
                                        padding: '0.5rem 0',
                                        caretColor: 'var(--argilla-ferrosa)',
                                    }}
                                />
                                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', alignItems: 'center' }}>
                                    {inputVal && (
                                        <button
                                            onClick={() => goNext()}
                                            style={{
                                                background: 'var(--olive)',
                                                border: '1px solid var(--olive)',
                                                borderRadius: '9999px',
                                                padding: '0.65rem 1.8rem',
                                                color: 'var(--terra-nera)',
                                                fontFamily: 'var(--font-inter)',
                                                fontSize: '10px',
                                                letterSpacing: '0.18em',
                                                textTransform: 'uppercase',
                                                cursor: 'none',
                                                transition: 'background 0.25s, color 0.25s',
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = 'rgba(107,122,101,0.15)';
                                                (e.currentTarget as HTMLElement).style.color = 'var(--olive)';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = 'var(--olive)';
                                                (e.currentTarget as HTMLElement).style.color = 'var(--terra-nera)';
                                            }}
                                        >
                                            {t('submitLabel')}
                                        </button>
                                    )}
                                    {step.optional && (
                                        <button
                                            onClick={() => goNext('')}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid rgba(236,232,223,0.22)',
                                                borderRadius: '9999px',
                                                padding: '0.65rem 1.8rem',
                                                fontFamily: 'var(--font-inter)',
                                                fontSize: '10px',
                                                letterSpacing: '0.18em',
                                                textTransform: 'uppercase',
                                                color: 'rgba(236,232,223,0.55)',
                                                cursor: 'none',
                                                transition: 'border-color 0.25s, color 0.25s',
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,232,223,0.5)';
                                                (e.currentTarget as HTMLElement).style.color = 'rgba(236,232,223,0.85)';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,232,223,0.22)';
                                                (e.currentTarget as HTMLElement).style.color = 'rgba(236,232,223,0.55)';
                                            }}
                                        >
                                            {t('skipLabel')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Step preview ─────────────────────────────────── */}
            {!submitted && (
                <div style={{
                    position: 'absolute',
                    bottom: '3rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                }}>
                    {stepsConf.map((s, i) => {
                        const isPast = i < currentStep;
                        const isCurrent = i === currentStep;
                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    opacity: isCurrent ? 1 : isPast ? 0.55 : 0.3,
                                    transition: 'opacity 0.4s',
                                    minWidth: '80px',
                                }}>
                                    {/* dot */}
                                    <div style={{
                                        width: isCurrent ? 6 : 4,
                                        height: isCurrent ? 6 : 4,
                                        borderRadius: '50%',
                                        background: isCurrent ? 'var(--argilla-ferrosa)' : isPast ? 'var(--olive)' : 'rgba(236,232,223,0.3)',
                                        transition: 'all 0.4s',
                                    }} />
                                    {/* label */}
                                    <span className="concierge-step-label" style={{
                                        fontFamily: 'var(--font-inter)',
                                        fontSize: '8px',
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        color: isCurrent ? 'rgba(236,232,223,0.7)' : 'rgba(236,232,223,0.3)',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {s.label}
                                        {s.optional && <span style={{ opacity: 0.5 }}> *</span>}
                                    </span>
                                </div>
                                {/* connector line */}
                                {i < stepsConf.length - 1 && (
                                    <div style={{
                                        width: '3rem',
                                        height: 1,
                                        background: i < currentStep ? 'rgba(107,122,101,0.5)' : 'rgba(107,122,101,0.2)',
                                        marginBottom: '1.2rem',
                                        transition: 'background 0.4s',
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* * optional hint legend */}
            {!submitted && stepsConf.some(s => s.optional) && (
                <span style={{
                    position: 'absolute',
                    bottom: '1.8rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '8px',
                    letterSpacing: '0.15em',
                    color: 'rgba(236,232,223,0.2)',
                    whiteSpace: 'nowrap',
                }}>
                    * {t('optionalHint')}
                </span>
            )}
        </div>
    );
}
