'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from '@/i18n/routing';

export default function ScrollProgressTracker() {
    const lineRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const { scrollY } = useAppStore();
    const pathname = usePathname();
    const [currentLabel, setCurrentLabel] = useState('');

    // Observe sections with data-section-label attribute
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

    // Update progress line
    useEffect(() => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
        if (lineRef.current) {
            lineRef.current.style.height = `${progress * 100}%`;
        }
    }, [scrollY]);

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
            {/* Progress line */}
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
                        transition: 'height 0.2s ease',
                    }}
                />
            </div>

            {/* Section label (rotated) */}
            <span
                ref={labelRef}
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

