'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useLenis() {
    const lenisRef = useRef<any>(null);
    const setScrollY = useAppStore((s) => s.setScrollY);
    
    // Track global overlay states
    const isMenuOpen = useAppStore((s) => s.isMenuOpen);
    const isOilModalOpen = useAppStore((s) => s.isOilModalOpen);
    const isConciergeOpen = useAppStore((s) => s.isConciergeOpen);
    const isPreloaderComplete = useAppStore((s) => s.isPreloaderComplete);

    useEffect(() => {
        // Dynamically import Lenis to avoid SSR issues
        import('lenis').then(({ default: Lenis }) => {
            const lenis = new Lenis({
                duration: 1.4,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
            });

            lenisRef.current = lenis;

            // Sync with GSAP ticker (if GSAP is loaded)
            function raf(time: number) {
                lenis.raf(time);
                setScrollY(lenis.scroll, lenis.velocity);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            // Expose globally for Easter Egg stop/start
            (window as any).__lenis = lenis;
        });

        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
        };
    }, [setScrollY]);

    // Handle scroll locking when overlays are open
    useEffect(() => {
        const isAnyOverlayOpen = isMenuOpen || isOilModalOpen || isConciergeOpen;
        const shouldLock = isAnyOverlayOpen || !isPreloaderComplete;
        
        if (lenisRef.current) {
            if (shouldLock) {
                lenisRef.current.stop();
                document.body.style.overflow = 'hidden';
            } else {
                lenisRef.current.start();
                document.body.style.overflow = '';
            }
        }
    }, [isMenuOpen, isOilModalOpen, isConciergeOpen, isPreloaderComplete]);

    return lenisRef;
}
