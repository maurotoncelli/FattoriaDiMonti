'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/hooks/usePerformance';

export default function Preloader() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLParagraphElement>(null);
    const coordRef = useRef<HTMLSpanElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const locationRef = useRef<HTMLSpanElement>(null);
    const setPreloaderComplete = useAppStore((s) => s.setPreloaderComplete);
    const t = useTranslations('UI.preloader');
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        if (prefersReducedMotion) {
            gsap.set(overlayRef.current, { autoAlpha: 0 });
            document.body.style.overflow = '';
            setPreloaderComplete(true);
            return;
        }

        const tl = gsap.timeline();

        tl.fromTo(nameRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.1 }
        );

        tl.fromTo(lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.35, ease: 'power2.inOut' },
            '-=0.25'
        );

        tl.fromTo(coordRef.current,
            { opacity: 0 },
            { opacity: 0.4, duration: 0.3, ease: 'power2.out' },
            '-=0.2'
        );

        tl.fromTo(locationRef.current,
            { opacity: 0 },
            { opacity: 0.35, duration: 0.25, ease: 'power2.out' },
            '-=0.15'
        );

        tl.to({}, { duration: 0.25 });

        tl.to([nameRef.current, lineRef.current, coordRef.current, locationRef.current], {
            opacity: 0,
            y: -10,
            duration: 0.25,
            stagger: 0.06,
            ease: 'power2.in',
        });

        tl.to(overlayRef.current, {
            yPercent: -100,
            duration: 0.65,
            ease: 'power4.inOut',
            onComplete: () => {
                document.body.style.overflow = '';
                setPreloaderComplete(true);
            },
        }, '-=0.1');

        return () => {
            tl.kill();
            document.body.style.overflow = '';
        };
    }, [prefersReducedMotion, setPreloaderComplete]);

    return (
        <div
            ref={overlayRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 70,
                backgroundColor: '#1A1714',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                pointerEvents: 'auto',
            }}
        >
            {/* Nome fattoria */}
            <p
                ref={nameRef}
                aria-label={t('brand')}
                style={{
                    fontFamily: 'var(--font-playfair, Georgia, serif)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                    color: '#ECE8DF',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    textAlign: 'center',
                    opacity: 0,
                }}
            >
                {t('brand')}
            </p>

            {/* Linea decorativa */}
            <div
                ref={lineRef}
                style={{
                    width: '60px',
                    height: '1px',
                    backgroundColor: 'rgba(107,122,101,0.5)',
                    transformOrigin: 'center',
                    transform: 'scaleX(0)',
                }}
            />

            {/* Coordinate */}
            <span
                ref={coordRef}
                style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '9px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'rgba(236,232,223,0.4)',
                    opacity: 0,
                }}
            >
                {t('coordinates')}
            </span>

            {/* Location */}
            <span
                ref={locationRef}
                style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(107,122,101,0.35)',
                    opacity: 0,
                }}
            >
                {t('location')}
            </span>
        </div>
    );
}
