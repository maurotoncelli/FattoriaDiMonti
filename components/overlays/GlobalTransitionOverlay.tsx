'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/i18n/routing';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';

export default function GlobalTransitionOverlay() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const keywordRef = useRef<HTMLSpanElement>(null);
    const pathname = usePathname();
    const { isTransitioning, transitionBgColor, transitionKeyword, endPageTransition } = useAppStore();

    // Diventa true SOLO nell'onComplete del timeline di chiusura.
    // Usare useState (non useRef) garantisce che React ri-esegua il lift effect
    // nello stesso batch del setReadyToLift, senza ambiguità di timing con GSAP.
    const [readyToLift, setReadyToLift] = useState(false);

    // Sipario si alza (reveal nuova pagina)
    useEffect(() => {
        if (!readyToLift || !overlayRef.current) return;
        setReadyToLift(false);
        gsap.to(overlayRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
                gsap.set(overlayRef.current, { yPercent: 100 });
            }
        });
    }, [readyToLift]);

    // Sipario si abbassa (copre pagina corrente)
    useEffect(() => {
        if (!isTransitioning || !overlayRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                // endPageTransition e setReadyToLift vanno insieme:
                // React li batcha in un unico render → lift parte subito dopo
                endPageTransition();
                setReadyToLift(true);
            },
        });

        tl.fromTo(overlayRef.current, 
            { yPercent: 100 },
            {
                yPercent: 0,
                duration: 1.2,
                ease: "power4.inOut",
                backgroundColor: transitionBgColor,
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

        return () => { tl.kill(); };
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

