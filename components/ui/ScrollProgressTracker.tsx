'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/i18n/routing';

export default function ScrollProgressTracker() {
    const lineRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const [currentLabel, setCurrentLabel] = useState('');

    // Aggiorna la barra di progresso in modo IMPERATIVO via Lenis event —
    // nessun setState, nessun re-render React ad ogni frame di scroll.
    useEffect(() => {
        const updateProgress = ({ scroll }: { scroll: number }) => {
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? Math.min(scroll / maxScroll, 1) : 0;
            if (lineRef.current) {
                lineRef.current.style.height = `${progress * 100}%`;
            }
        };

        const attachLenis = () => {
            const lenis = (window as any).__lenis;
            if (lenis) {
                lenis.on('scroll', updateProgress);
                return () => lenis.off('scroll', updateProgress);
            }
            return undefined;
        };

        // Lenis potrebbe non essere ancora montato (dynamic import): riprova ogni 100ms
        let cleanup: (() => void) | undefined;
        const interval = setInterval(() => {
            cleanup = attachLenis();
            if (cleanup) clearInterval(interval);
        }, 100);

        return () => {
            clearInterval(interval);
            cleanup?.();
        };
    }, []);

    // Osserva le sezioni con IntersectionObserver — solo per il label, non per lo scroll progress
    useEffect(() => {
        const sections = document.querySelectorAll('[data-section-label]');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const label = (entry.target as HTMLElement).dataset.sectionLabel || '';
                        setCurrentLabel(label);
                    }
                });
            },
            { threshold: 0.3 }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [pathname]);

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                left: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
            }}
        >
            <div
                style={{
                    width: 1,
                    height: 80,
                    background: 'rgba(107,122,101,0.2)',
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div
                    ref={lineRef}
                    style={{
                        width: '100%',
                        height: '0%',
                        background: 'var(--olive)',
                        // Niente CSS transition: l'aggiornamento è già fluido via Lenis RAF
                    }}
                />
            </div>

            <span
                className="label"
                style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                    color: 'var(--olive)',
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    opacity: 0.7,
                    transition: 'opacity 0.3s ease',
                }}
            >
                {currentLabel}
            </span>
        </div>
    );
}
