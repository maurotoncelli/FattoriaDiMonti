'use client';

import { useState, useEffect } from 'react';

/**
 * Returns true when viewport width < breakpoint.
 * SSR-safe: starts as `false` (desktop) to avoid hydration mismatch.
 */
export function useIsMobile(breakpoint = 1024): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [breakpoint]);

    return isMobile;
}
