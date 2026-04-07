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
    { ssr: false }
);

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    useLenis();
    useHashScroll();
    useEasterEgg();

    // Sincronizza una variabile CSS globale per il colore dei testi esposti al cielo
    useEffect(() => {
        const calculateSkyTextColor = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;

            // Interpoliamo tra due colori hex (Alba/Mattina -> Notte)
            // Usiamo colori che contrastano bene con i relativi colori del cielo in WheatNoiseShader
            // 0.00: Cielo Giallino Chiaro -> Testo Scuro (es. Mucco Pisano) #4A2E1B
            // 0.33: Cielo Azzurro -> Testo Scuro #4A2E1B
            // 0.66: Cielo Arancio pallido -> Testo Scuro #4A2E1B
            // 1.00: Cielo Blu Notte Scuro -> Testo Chiaro (es. Tufo/Olive) #ECE8DF o simile
            
            // Per semplicità, sfumiamo da #4A2E1B (Mucco Pisano) a #ECE8DF (Tufo) verso la fine
            let r, g, b;
            if (progress < 0.6) {
                // Fino al tramonto, tieni il testo scuro
                r = 74; g = 46; b = 27; // #4A2E1B
            } else {
                // Dal tramonto (0.6) alla notte (1.0), sfuma verso il chiaro
                const factor = (progress - 0.6) / 0.4; // 0 to 1
                r = Math.round(74 + (236 - 74) * factor);
                g = Math.round(46 + (232 - 46) * factor);
                b = Math.round(27 + (223 - 27) * factor);
            }
            
            document.documentElement.style.setProperty('--sky-text-color', `rgb(${r}, ${g}, ${b})`);
        };

        window.addEventListener('scroll', calculateSkyTextColor, { passive: true });
        calculateSkyTextColor(); // Initial call

        return () => window.removeEventListener('scroll', calculateSkyTextColor);
    }, []);

    const isOilModalOpen = useAppStore((s) => s.isOilModalOpen);
    const isConciergeOpen = useAppStore((s) => s.isConciergeOpen);
    const isMenuOpen = useAppStore((s) => s.isMenuOpen);

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
            {isConciergeOpen && <ConciergeForm />}
            {isMenuOpen && <MainMenuOverlay />}
            
            {/* Page Transitions Overlay */}
            <GlobalTransitionOverlay />
        </>
    );
}
