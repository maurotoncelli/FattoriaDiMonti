'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePathname, useRouter } from '@/i18n/routing';
import { useAppStore } from '@/store/useAppStore';

type Phase = 'idle' | 'covering' | 'waiting' | 'lifting';

const COVER_S = 0.7;
const LIFT_S = 0.8;
// Stessa rotta (o solo hash): non c'è un cambio di pathname da aspettare.
const SAME_ROUTE_LIFT_MS = 120;
// Rete lenta o navigazione fallita: il sipario non deve mai restare giù.
const MAX_WAIT_MS = 4000;

const isLightColor = (hex: string) => {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
    if (!m) return true;
    const [r, g, b] = m.slice(1).map((c) => parseInt(c, 16));
    return 0.299 * r + 0.587 * g + 0.114 * b > 150;
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function GlobalTransitionOverlay() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const keywordRef = useRef<HTMLSpanElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const isTransitioning = useAppStore((s) => s.isTransitioning);
    const transitionBgColor = useAppStore((s) => s.transitionBgColor);
    const [keyword, setKeyword] = useState<string | null>(null);

    // Il router di next-intl cambia identità a ogni cambio di pathname: se
    // stesse nelle deps di un effect interromperebbe la transizione a metà.
    const routerRef = useRef(router);
    routerRef.current = router;
    const pathnameRef = useRef(pathname);
    pathnameRef.current = pathname;

    const phaseRef = useRef<Phase>('idle');
    const pathAtPushRef = useRef<string | null>(null);
    const hasHashTargetRef = useRef(false);
    const timersRef = useRef<number[]>([]);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    const clearTimers = () => {
        timersRef.current.forEach((id) => window.clearTimeout(id));
        timersRef.current = [];
    };

    // Stato iniziale impostato da GSAP: con un transform CSS in percentuale
    // GSAP lo leggerebbe come pixel e il sipario non coprirebbe mai la pagina.
    useLayoutEffect(() => {
        gsap.set(overlayRef.current, { yPercent: 100, y: 0 });
    }, []);

    const lift = useCallback(() => {
        const el = overlayRef.current;
        if (phaseRef.current !== 'waiting' || !el) return;
        phaseRef.current = 'lifting';
        clearTimers();

        if (!hasHashTargetRef.current) {
            (window as any).__lenis?.scrollTo(0, { immediate: true, force: true });
        }

        const reduced = prefersReducedMotion();
        timelineRef.current?.kill();
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(el, { yPercent: 100, pointerEvents: 'none' });
                phaseRef.current = 'idle';
                setKeyword(null);
                useAppStore.getState().endPageTransition();
            },
        });
        tl.to(keywordRef.current, { opacity: 0, y: -12, duration: reduced ? 0 : 0.25, ease: 'power2.in' });
        tl.to(el, { yPercent: -100, duration: reduced ? 0.01 : LIFT_S, ease: 'power3.inOut' }, '-=0.1');
        timelineRef.current = tl;
    }, []);

    // Il sipario scende, poi naviga quando copre il 100% dello schermo.
    useEffect(() => {
        const el = overlayRef.current;
        if (!isTransitioning || phaseRef.current !== 'idle' || !el) return;

        const { nextRoute: destination, transitionKeyword } = useAppStore.getState();
        const reduced = prefersReducedMotion();
        phaseRef.current = 'covering';
        setKeyword(transitionKeyword);

        timelineRef.current?.kill();
        const tl = gsap.timeline();
        tl.set(el, { pointerEvents: 'auto' });
        tl.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: reduced ? 0.01 : COVER_S, ease: 'power3.inOut' });
        if (!reduced && transitionKeyword) {
            tl.fromTo(keywordRef.current,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
                '-=0.25'
            );
        }
        tl.call(() => {
            phaseRef.current = 'waiting';
            if (!destination) {
                lift();
                return;
            }
            const destPath = destination.split('#')[0] || '/';
            hasHashTargetRef.current = destination.includes('#');
            pathAtPushRef.current = pathnameRef.current;
            routerRef.current.push(destination as any, { scroll: true });
            const sameRoute = destPath === pathnameRef.current;
            timersRef.current.push(window.setTimeout(lift, sameRoute ? SAME_ROUTE_LIFT_MS : MAX_WAIT_MS));
        });
        timelineRef.current = tl;
    }, [isTransitioning, lift]);

    // Si rialza solo quando la nuova pagina è montata (due frame: già dipinta).
    useEffect(() => {
        if (phaseRef.current !== 'waiting' || pathname === pathAtPushRef.current) return;
        let raf2 = 0;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(lift);
        });
        return () => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
        };
    }, [pathname, lift]);

    useEffect(() => () => {
        timelineRef.current?.kill();
        clearTimers();
    }, []);

    return (
        <div
            ref={overlayRef}
            aria-hidden="true"
            // z-[500]: sopra qualsiasi UI fissa (navbar z-90, menu z-95, pill z-100)
            className="fixed inset-0 z-[500] pointer-events-none flex items-center justify-center"
            style={{ backgroundColor: transitionBgColor }}
        >
            <span
                ref={keywordRef}
                style={{
                    fontFamily: 'var(--font-playfair, Georgia, serif)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                    color: isLightColor(transitionBgColor) ? '#4A2E1B' : '#ECE8DF',
                    opacity: 0,
                    letterSpacing: '-0.01em',
                }}
            >
                {keyword}
            </span>
        </div>
    );
}
