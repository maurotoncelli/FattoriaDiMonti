'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function CursorEngine() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const posRef = useRef({ x: 0, y: 0 });
    const currentSection = useAppStore((s) => s.currentSection);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = cursorDotRef.current;
        if (!cursor || !dot) return;

        let rafId: number;
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;

        const moveCursor = (e: MouseEvent) => {
            targetX = e.clientX;
            targetY = e.clientY;
            dot.style.transform = `translate(${targetX - 4}px, ${targetY - 4}px)`;
        };

        const animateCursor = () => {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;
            cursor.style.transform = `translate(${currentX - 20}px, ${currentY - 20}px)`;
            rafId = requestAnimationFrame(animateCursor);
        };

        const handleEnterText = () => cursor.classList.add('is-text');
        const handleLeaveText = () => cursor.classList.remove('is-text');
        const handleEnterLink = () => cursor.classList.add('is-link');
        const handleLeaveLink = () => cursor.classList.remove('is-link');

        document.addEventListener('mousemove', moveCursor);
        document.querySelectorAll('h1, h2, h3, p').forEach(el => {
            el.addEventListener('mouseenter', handleEnterText);
            el.addEventListener('mouseleave', handleLeaveText);
        });
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', handleEnterLink);
            el.addEventListener('mouseleave', handleLeaveLink);
        });

        animateCursor();

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            cancelAnimationFrame(rafId);
        };
    }, []);

    const isTelescope = currentSection === '03-ospitalita';

    return (
        <>
            {/* Trailing ring */}
            <div
                ref={cursorRef}
                className={`cursor-ring ${isTelescope ? 'is-telescope' : ''}`}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `1px solid var(--olive)`,
                    pointerEvents: 'none',
                    zIndex: 1000,
                    willChange: 'transform',
                    transition: 'width 0.3s, height 0.3s, border-color 0.3s',
                    mixBlendMode: 'difference',
                }}
            />
            {/* Instant dot */}
            <div
                ref={cursorDotRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--argilla-ferrosa)',
                    pointerEvents: 'none',
                    zIndex: 1001,
                    willChange: 'transform',
                }}
            />
        </>
    );
}
