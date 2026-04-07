'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

const SEQUENCE = ['n', 'e', 'v', 'e'];

export function useEasterEgg() {
    const triggerEasterEgg = useAppStore((s) => s.triggerEasterEgg);
    const bufferRef = useRef<string[]>([]);
    const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Keyboard sequence: N-E-V-E
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            bufferRef.current.push(key);
            if (bufferRef.current.length > SEQUENCE.length) {
                bufferRef.current.shift();
            }
            if (bufferRef.current.join('') === SEQUENCE.join('')) {
                bufferRef.current = [];
                triggerEasterEgg();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [triggerEasterEgg]);

    // Mouse hold on trigger words is handled in EasterEggTrigger component
}
