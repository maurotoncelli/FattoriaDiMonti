'use client';

import { useEffect, useState } from 'react';

export function useDevicePerformance() {
    const [tier, setTier] = useState<'high' | 'low'>('low');

    useEffect(() => {
        const cores = navigator.hardwareConcurrency || 4;
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const hasLowMemory = 'deviceMemory' in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;
        setTier(cores < 4 || isMobile || hasLowMemory ? 'low' : 'high');
    }, []);

    return tier;
}

export function useReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mq.matches);
        const handler = (e: MediaQueryListEvent) => { setPrefersReducedMotion(e.matches); };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
}
