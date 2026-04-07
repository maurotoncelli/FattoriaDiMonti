'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/routing';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';

export default function GlobalTransitionOverlay() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const keywordRef = useRef<HTMLSpanElement>(null);
    const pathname = usePathname();
    const { isTransitioning, transitionBgColor, transitionKeyword, endPageTransition } = useAppStore();

    // Diventa true solo quando il sipario ha realmente coperto lo schermo.
    // Impedisce lift spurii al primo mount e quando pathname cambia mentre
    // isTransitioning è ancora true (router.push a 900ms).
    const hasCovered = useRef(false);

    // Sipario si alza (reveal nuova pagina) — solo se lo schermo era stato coperto
    useEffect(() => {
        if (!isTransitioning && hasCovered.current && overlayRef.current) {
            hasCovered.current = false;
            gsap.to(overlayRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut",
                onComplete: () => {
                    gsap.set(overlayRef.current, { yPercent: 100 });
                }
            });
        }
    }, [pathname, isTransitioning]);

    // Sipario si abbassa (copre pagina corrente)
    useEffect(() => {
        if (isTransitioning && overlayRef.current) {
            const tl = gsap.timeline({
                onComplete: () => {
                    endPageTransition();
                },
            });

            tl.fromTo(overlayRef.current, 
                { yPercent: 100 },
                {
                    yPercent: 0,
                    duration: 1.2,
                    ease: "power4.inOut",
                    backgroundColor: transitionBgColor,
                    onComplete: () => {
                        // Lo schermo è coperto: ora il lift è autorizzato
                        hasCovered.current = true;
                    },
                }
            );

            // Keyword reveal
            if (transitionKeyword && keywordRef.current) {
                tl.fromTo(keywordRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
                    '-=0.5'
                );
                tl.to(keywordRef.current,
                    { opacity: 0, y: -15, duration: 0.4, ease: 'power2.in' },
                    '+=0.3'
                );
            }
        }
    }, [isTransitioning, transitionBgColor, transitionKeyword, endPageTransition]);

    return (
        <div 
            ref={overlayRef}
            className="fixed inset-0 z-[60] pointer-events-none origin-bottom flex items-center justify-center"
            style={{ 
                transform: 'translateY(100%)',
                backgroundColor: transitionBgColor
            }}
        >
            {transitionKeyword && (
                <span
                    ref={keywordRef}
                    style={{
                        fontFamily: 'var(--font-playfair, Georgia, serif)',
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                        color: transitionBgColor === '#F3EFE7' ? '#4A2E1B' : '#ECE8DF',
                        opacity: 0,
                        letterSpacing: '-0.01em',
                        pointerEvents: 'none',
                    }}
                >
                    {transitionKeyword}
                </span>
            )}
        </div>
    );
}

