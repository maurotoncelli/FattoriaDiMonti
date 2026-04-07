'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useHashScroll() {
    const pathname = usePathname();

    useEffect(() => {
        const handleHashScroll = () => {
            const lenis = (window as any).__lenis;
            if (!lenis) return;

            const hash = window.location.hash;
            if (hash) {
                const targetId = hash.slice(1);
                // Give the DOM a tiny moment to render the newly loaded page before scrolling
                setTimeout(() => {
                    const el = document.getElementById(targetId);
                    if (el) {
                        lenis.scrollTo(el, { duration: 1.8, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                    }
                }, 300);
            }
        };

        // Try to trigger after a small delay to ensure lenis is mounted globally
        setTimeout(handleHashScroll, 100);
        
    }, [pathname]); // Re-run whenever the route changes
}
