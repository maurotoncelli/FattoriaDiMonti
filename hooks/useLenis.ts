'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { scrollStore } from '@/lib/scrollStore';

export function useLenis() {
    const lenisRef = useRef<any>(null);

    const isMenuOpen = useAppStore((s) => s.isMenuOpen);
    const isOilModalOpen = useAppStore((s) => s.isOilModalOpen);
    const isConciergeOpen = useAppStore((s) => s.isConciergeOpen);
    const isPreloaderComplete = useAppStore((s) => s.isPreloaderComplete);

    useEffect(() => {
        let rafId: number;

        import('lenis').then(({ default: Lenis }) => {
            const lenis = new Lenis({
                duration: 1.4,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
            });

            lenisRef.current = lenis;
            (window as any).__lenis = lenis;

            // Scrivi su scrollStore (oggetto plain) — ZERO re-render React
            function raf(time: number) {
                lenis.raf(time);
                scrollStore.y = lenis.scroll;
                scrollStore.velocity = lenis.velocity;
                rafId = requestAnimationFrame(raf);
            }
            rafId = requestAnimationFrame(raf);
        });

        return () => {
            cancelAnimationFrame(rafId);
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, []);

    // Blocca / sblocca lo scroll quando overlay sono aperti
    useEffect(() => {
        const shouldLock = isMenuOpen || isOilModalOpen || isConciergeOpen || !isPreloaderComplete;
        if (!lenisRef.current) return;
        if (shouldLock) {
            lenisRef.current.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenisRef.current.start();
            document.body.style.overflow = '';
        }
    }, [isMenuOpen, isOilModalOpen, isConciergeOpen, isPreloaderComplete]);

    return lenisRef;
}
