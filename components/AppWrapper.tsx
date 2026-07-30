'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLenis } from '@/hooks/useLenis';
import { useHashScroll } from '@/hooks/useHashScroll';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from '@/i18n/routing';
import GlobalUI from '@/components/ui/GlobalUI';
import InnerFooter from '@/components/dom/InnerFooter';

const OilExtractionModal = dynamic(
    () => import('@/components/overlays/OilExtractionModal'),
    { ssr: false }
);

const ConciergeForm = dynamic(
    () => import('@/components/overlays/ConciergeForm'),
    { ssr: false }
);

const OilBottleSheet = dynamic(
    () => import('@/components/overlays/OilBottleSheet'),
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

    const isOilModalOpen = useAppStore((s) => s.isOilModalOpen);
    const isConciergeOpen = useAppStore((s) => s.isConciergeOpen);
    const isMenuOpen = useAppStore((s) => s.isMenuOpen);
    const isOilSheetOpen = useAppStore((s) => s.isOilSheetOpen);

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

    // Chiudi gli overlay legati al contenuto di pagina quando la route cambia
    // (es. back del browser con lightbox/sheet aperti): senza questo reset i
    // flag resterebbero true e il lock Lenis bloccherebbe lo scroll per sempre.
    useEffect(() => {
        const s = useAppStore.getState();
        if (s.isLightboxOpen) s.setLightboxOpen(false);
        if (s.isOilSheetOpen) s.setOilSheetOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Preloader — only on Home */}
            {isHome && !isPreloaderComplete && <Preloader />}

            {/* Layer 0: backdrop statico — fixed behind everything.
                Tufo chiaro con grana su tutte le route: riempie le ex
                "finestre" trasparenti che davano sul canvas WebGL. */}
            <div
                aria-hidden="true"
                className="backdrop-terroso"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: -10,
                    pointerEvents: 'none',
                }}
            />

            {/* Layer 1: Persistent Global UI */}
            <GlobalUI />

            {/* Layer 2: DOM scrollable content */}
            {children}
            <InnerFooter />

            {/* Z-Axis Overlays */}
            {isOilModalOpen && <OilExtractionModal />}
            {isOilSheetOpen && <OilBottleSheet />}
            {isConciergeOpen && <ConciergeForm />}
            {isMenuOpen && <MainMenuOverlay />}
            
            {/* Page Transitions Overlay */}
            <GlobalTransitionOverlay />
        </>
    );
}
