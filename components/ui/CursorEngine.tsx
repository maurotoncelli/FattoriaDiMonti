'use client';

import { useEffect, useRef, useState } from 'react';

export default function CursorEngine() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);

    // Non mostrare il cursore custom su touch device (mobile/tablet)
    const [isTouch, setIsTouch] = useState(true); // default true = nascosto finché non verifica
    useEffect(() => {
        setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    }, []);

    useEffect(() => {
        if (isTouch) return; // Touch device: nessun cursore custom
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

        // Delegation su document: niente listener per-elemento da rimuovere,
        // e funziona anche per i nodi montati dopo (navigazione SPA).
        const handleOver = (e: MouseEvent) => {
            const target = e.target as Element | null;
            if (!target) return;
            if (target.closest('a, button')) {
                cursor.classList.add('is-link');
                cursor.classList.remove('is-text');
            } else if (target.closest('h1, h2, h3, p')) {
                cursor.classList.add('is-text');
                cursor.classList.remove('is-link');
            } else {
                handleLeaveText();
                handleLeaveLink();
            }
        };

        document.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleOver);

        animateCursor();

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleOver);
            cancelAnimationFrame(rafId);
        };
    }, [isTouch]);

    // Touch device: non renderizzare nulla
    if (isTouch) return null;

    return (
        <>
            {/* Trailing ring */}
            <div
                ref={cursorRef}
                className="cursor-ring"
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
