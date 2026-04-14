'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '@/store/useAppStore';
import { scrollStore } from '@/lib/scrollStore';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function useLenis() {
    const lenisRef = useRef<any>(null);

    const isMenuOpen = useAppStore((s) => s.isMenuOpen);
    const isOilModalOpen = useAppStore((s) => s.isOilModalOpen);
    const isConciergeOpen = useAppStore((s) => s.isConciergeOpen);
    const isPreloaderComplete = useAppStore((s) => s.isPreloaderComplete);

    useEffect(() => {
        let tickerFn: ((time: number) => void) | null = null;

        import('lenis').then(({ default: Lenis }) => {
            const lenis = new Lenis({
                duration: 1.4,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
            });

            lenisRef.current = lenis;
            (window as any).__lenis = lenis;

            // Sincronizza ScrollTrigger ad ogni evento scroll Lenis
            lenis.on('scroll', ScrollTrigger.update);

            // Guida Lenis tramite gsap.ticker per avere Lenis e GSAP sullo stesso frame
            tickerFn = (time: number) => {
                lenis.raf(time * 1000);
                scrollStore.y = lenis.scroll;
                scrollStore.velocity = lenis.velocity;
            };
            gsap.ticker.add(tickerFn);
            gsap.ticker.lagSmoothing(0);
        });

        return () => {
            if (tickerFn) gsap.ticker.remove(tickerFn);
            if (lenisRef.current) {
                lenisRef.current.off?.('scroll', ScrollTrigger.update);
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
