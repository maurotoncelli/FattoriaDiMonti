'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

import { useTranslations } from 'next-intl';

export default function OilExtractionModal() {
    const { setOilModalOpen } = useAppStore();
    const t = useTranslations('Overlays.oilExtraction');
    const [activeStep, setActiveStep] = useState(0);
    const steps = t.raw('steps') as any[];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={t('ariaLabel')}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 90,
                background: 'var(--terra-nera)',
                display: 'grid',
                gridTemplateColumns: '22vw 1fr',
                overflow: 'hidden',
                animation: 'fadeIn 0.6s ease',
            }}
        >
            {/* Sticky timeline — left */}
            <nav
                style={{
                    borderRight: '1px solid rgba(107,122,101,0.25)',
                    padding: '6rem 3vw',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    overflowY: 'auto',
                }}
            >
                <span className="label" style={{ color: 'var(--olive)', marginBottom: '2.5rem', display: 'block' }}>
                    {t('navLabel')}
                </span>
                {steps.map((step, i) => (
                    <button
                        key={step.num}
                        onClick={() => setActiveStep(i)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderLeft: `2px solid ${activeStep === i ? 'var(--argilla-ferrosa)' : 'rgba(107,122,101,0.2)'}`,
                            padding: '1rem 1.5rem',
                            cursor: 'none',
                            textAlign: 'left',
                            transition: 'border-color 0.3s',
                        }}
                    >
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--olive)', display: 'block' }}>
                            {step.num}
                        </span>
                        <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(0.75rem, 1vw, 1rem)', color: activeStep === i ? 'var(--tufo)' : 'rgba(236,232,223,0.4)', transition: 'color 0.3s' }}>
                            {step.title}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Content — right */}
            <div style={{ padding: '8vh 6vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div key={activeStep} style={{ animation: 'fadeIn 0.4s ease' }}>
                    <span className="label" style={{ color: 'var(--olive)', marginBottom: '1.5rem', display: 'block' }}>
                        {steps[activeStep].num} — {steps[activeStep].title}
                    </span>
                    <h2 style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 'clamp(2rem, 4vw, 6rem)',
                        color: 'var(--tufo)',
                        lineHeight: 0.92,
                        marginBottom: '3rem',
                    }}>
                        {steps[activeStep].title}
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'clamp(14px, 1.2vw, 18px)',
                        lineHeight: 1.85,
                        color: 'rgba(236,232,223,0.75)',
                        maxWidth: '52ch',
                    }}>
                        {steps[activeStep].body}
                    </p>

                    {/* Step navigation */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                        {activeStep > 0 && (
                            <button
                                onClick={() => setActiveStep(activeStep - 1)}
                                style={{ background: 'transparent', border: '1px solid rgba(107,122,101,0.3)', borderRadius: '9999px', padding: '0.5rem 1.5rem', color: 'var(--olive)', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'none' }}
                            >
                                {t('btnPrev')}
                            </button>
                        )}
                        {activeStep < steps.length - 1 && (
                            <button
                                onClick={() => setActiveStep(activeStep + 1)}
                                style={{ background: 'transparent', border: '1px solid var(--olive)', borderRadius: '9999px', padding: '0.5rem 1.5rem', color: 'var(--olive)', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'none' }}
                            >
                                {t('btnNext')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Close button */}
            <button
                onClick={() => setOilModalOpen(false)}
                aria-label={t('closeAria')}
                style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(107,122,101,0.4)',
                    borderRadius: '9999px',
                    padding: '0.45rem 1.2rem',
                    color: 'var(--olive)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'none',
                    transition: 'border-color 0.3s',
                }}
            >
                {t('closeLabel')}
            </button>

            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
