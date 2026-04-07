'use client';

import { useEffect, useRef } from 'react';

export function useDevicePerformance() {
    const tierRef = useRef<'high' | 'low'>('high');

    useEffect(() => {
        const cores = navigator.hardwareConcurrency || 4;
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        tierRef.current = cores < 4 || isMobile ? 'low' : 'high';
    }, []);

    return tierRef;
}

export function useReducedMotion() {
    const prefersRef = useRef(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersRef.current = mq.matches;
        const handler = (e: MediaQueryListEvent) => { prefersRef.current = e.matches; };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return prefersRef;
}
