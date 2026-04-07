'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useRouter } from '@/i18n/routing';
import { useAppStore } from '@/store/useAppStore';

export default function GlobalTransitionOverlay() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const keywordRef = useRef<HTMLSpanElement>(null);
    const router = useRouter();

    const {
        isTransitioning,
        transitionBgColor,
        transitionKeyword,
        nextRoute,
        endPageTransition,
    } = useAppStore();

    // True solo dopo che il sipario ha completato la CHIUSURA (overlay copre 100% schermo).
    // Usare useState garantisce che React ri-esegua il lift effect nello stesso render batch.
    const [readyToLift, setReadyToLift] = useState(false);

    // ── Sipario si ALZA (reveal nuova pagina) ────────────────────────────────
    useEffect(() => {
        if (!readyToLift || !overlayRef.current) return;
        setReadyToLift(false);
        gsap.to(overlayRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: 'power4.inOut',
            onComplete: () => {
                gsap.set(overlayRef.current, { yPercent: 100 });
            },
        });
    }, [readyToLift]);

    // ── Sipario si ABBASSA (copre pagina corrente) ────────────────────────────
    useEffect(() => {
        if (!isTransitioning || !overlayRef.current) return;

        // Cattura la rotta target al momento dell'avvio — endPageTransition la azzera
        const destination = nextRoute;

        const tl = gsap.timeline({
            onComplete: () => {
                endPageTransition();
                setReadyToLift(true);
            },
        });

        tl.fromTo(
            overlayRef.current,
            { yPercent: 100 },
            {
                yPercent: 0,
                duration: 1.2,
                ease: 'power4.inOut',
                backgroundColor: transitionBgColor,
                onComplete: () => {
                    // Naviga QUI: overlay è garantito al 100% sullo schermo.
                    // Nessun setTimeout esterno — nessuna race condition.
                    if (destination) {
                        router.push(destination as any, { scroll: true });
                    }
                },
            }
        );

        // Keyword reveal (opzionale)
        if (transitionKeyword && keywordRef.current) {
            tl.fromTo(
                keywordRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
                '-=0.5'
            );
            tl.to(
                keywordRef.current,
                { opacity: 0, y: -15, duration: 0.4, ease: 'power2.in' },
                '+=0.3'
            );
        }

        return () => { tl.kill(); };
    }, [isTransitioning, transitionBgColor, transitionKeyword, nextRoute, endPageTransition, router]);

    return (
        <div
            ref={overlayRef}
            // z-[500] garantisce che il sipario sia sopra QUALSIASI elemento UI fisso
            // (MenuTrigger z-100, menu overlay z-95, ecc.)
            className="fixed inset-0 z-[500] pointer-events-none flex items-center justify-center"
            style={{
                transform: 'translateY(100%)',
                backgroundColor: transitionBgColor,
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
