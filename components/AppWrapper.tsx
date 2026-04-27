'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLenis } from '@/hooks/useLenis';
import { useHashScroll } from '@/hooks/useHashScroll';
import { useEasterEgg } from '@/hooks/useEasterEgg';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from '@/i18n/routing';
import GlobalUI from '@/components/ui/GlobalUI';
import InnerFooter from '@/components/dom/InnerFooter';
import { scrollStore } from '@/lib/scrollStore';

// Lazy-load the WebGL Canvas to avoid SSR issues
const CanvasZ0 = dynamic(() => import('@/components/canvas/CanvasZ0'), {
    ssr: false,
});

const OilExtractionModal = dynamic(
    () => import('@/components/overlays/OilExtractionModal'),
    { ssr: false }
);

const ConciergeForm = dynamic(
    () => import('@/components/overlays/ConciergeForm'),
    { ssr: false }
);

const JerkyProductSheet = dynamic(
    () => import('@/components/overlays/JerkyProductSheet'),
    { ssr: false }
);

const OilBottleSheet = dynamic(
    () => import('@/components/overlays/OilBottleSheet'),
    { ssr: false }
);

const RoomSheet = dynamic(
    () => import('@/components/overlays/RoomSheet'),
    { ssr: false }
);

const MainMenuOverlay = dynamic(
    () => import('@/components/overlays/MainMenuOverlay'),
    { ssr: false }
);

const GlobalTransitionOverlay = dynamic(
    () => import('@/components/overlays/GlobalTransitionOverlay'),
    { ssr: false }
);

const Preloader = dynamic(
    () => import('@/components/ui/Preloader'),
    {
        ssr: false,
        loading: () => (
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 70,
                    backgroundColor: '#1A1714',
                }}
            />
        ),
    }
);

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    useLenis();
    useHashScroll();
    useEasterEgg();

    // Sincronizza --sky-text-color tramite Lenis event (non window scroll)
    useEffect(() => {
        const updateSkyTextColor = ({ scroll }: { scroll: number }) => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scroll / maxScroll)) : 0;

            let r, g, b;
            if (progress < 0.6) {
                r = 74; g = 46; b = 27;
            } else {
                const factor = (progress - 0.6) / 0.4;
                r = Math.round(74 + (236 - 74) * factor);
                g = Math.round(46 + (232 - 46) * factor);
                b = Math.round(27 + (223 - 27) * factor);
            }
            document.documentElement.style.setProperty('--sky-text-color', `rgb(${r}, ${g}, ${b})`);
        };

        let cleanup: (() => void) | undefined;

        const attachLenis = (lenis: any) => {
            cleanup?.();
            updateSkyTextColor({ scroll: scrollStore.y });
            lenis.on('scroll', updateSkyTextColor);
            cleanup = () => lenis.off('scroll', updateSkyTextColor);
        };

        const existingLenis = (window as any).__lenis;
        if (existingLenis) {
            attachLenis(existingLenis);
        }

        const handleLenisReady = (event: Event) => {
            const lenis = (event as CustomEvent).detail || (window as any).__lenis;
            if (lenis) attachLenis(lenis);
        };

        window.addEventListener('fdm:lenis-ready', handleLenisReady);

        const timeout = window.setTimeout(() => {
            const lenis = (window as any).__lenis;
            if (lenis) {
                attachLenis(lenis);
            }
        }, 250);

        return () => {
            window.removeEventListener('fdm:lenis-ready', handleLenisReady);
            clearTimeout(timeout);
            cleanup?.();
        };
    }, []);

    const isOilModalOpen = useAppStore((s) => s.isOilModalOpen);
    const isConciergeOpen = useAppStore((s) => s.isConciergeOpen);
    const isMenuOpen = useAppStore((s) => s.isMenuOpen);
    const isJerkySheetOpen = useAppStore((s) => s.isJerkySheetOpen);
    const isOilSheetOpen = useAppStore((s) => s.isOilSheetOpen);
    const isRoomSheetOpen = useAppStore((s) => s.isRoomSheetOpen);

    const isPreloaderComplete = useAppStore((s) => s.isPreloaderComplete);
    const setPreloaderComplete = useAppStore((s) => s.setPreloaderComplete);
    const pathname = usePathname();
    const isHome = pathname === '/';

    // On inner pages, skip preloader immediately
    useEffect(() => {
        if (!isHome && !isPreloaderComplete) {
            setPreloaderComplete(true);
        }
    }, [isHome, isPreloaderComplete, setPreloaderComplete]);

    return (
        <>
            {/* Preloader — only on Home */}
            {isHome && !isPreloaderComplete && <Preloader />}

            {/* Layer 0: WebGL Canvas — fixed behind everything */}
            <CanvasZ0 />

            {/* Layer 1: Persistent Global UI */}
            <GlobalUI />

            {/* Layer 2: DOM scrollable content */}
            {children}
            <InnerFooter />

            {/* Z-Axis Overlays */}
            {isOilModalOpen && <OilExtractionModal />}
            {isJerkySheetOpen && <JerkyProductSheet />}
            {isOilSheetOpen && <OilBottleSheet />}
            {isRoomSheetOpen && <RoomSheet />}
            {isConciergeOpen && <ConciergeForm />}
            {isMenuOpen && <MainMenuOverlay />}
            
            {/* Page Transitions Overlay */}
            <GlobalTransitionOverlay />
        </>
    );
}
