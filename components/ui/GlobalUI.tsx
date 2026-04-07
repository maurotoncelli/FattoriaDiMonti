'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';
import CursorEngine from './CursorEngine';
import MenuTrigger from './MenuTrigger';
import BackButton from './BackButton';
import ScrollProgressTracker from './ScrollProgressTracker';

export default function GlobalUI() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const isPreloaderComplete = useAppStore((s) => s.isPreloaderComplete);

    useEffect(() => {
        if (isPreloaderComplete && wrapRef.current) {
            gsap.fromTo(wrapRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: 'power2.out', delay: 0.3 }
            );
        }
    }, [isPreloaderComplete]);

    return (
        <>
            {/* Cursor always active */}
            <CursorEngine />
            {/* Other UI fades in after preloader */}
            <div ref={wrapRef} style={{ opacity: 0 }}>
                <BackButton />
                <MenuTrigger />
                <ScrollProgressTracker />
            </div>
        </>
    );
}
