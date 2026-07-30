import { create } from 'zustand';

/** 'carne-secca' e 'olio' aprono il flow "richiedi maggiori informazioni". */
export type ConciergeContext = 'default' | 'cucina-nomade' | 'carne-secca' | 'olio';

interface AppState {
    // Modals / Overlays
    isMenuOpen: boolean;
    isOilModalOpen: boolean;
    isConciergeOpen: boolean;
    conciergeContext: ConciergeContext | null;
    isLightboxOpen: boolean;
    isOilSheetOpen: boolean;
    selectedBottleId: string | null;
    // Routing Transitions
    isTransitioning: boolean;
    nextRoute: string | null;
    transitionBgColor: string;
    transitionKeyword: string | null;
    // Preloader
    isPreloaderComplete: boolean;
    // Audio
    audioEnabled: boolean;
    // Actions
    setMenuOpen: (open: boolean) => void;
    setOilModalOpen: (open: boolean) => void;
    setConciergeOpen: (open: boolean, context?: ConciergeContext) => void;
    setLightboxOpen: (open: boolean) => void;
    setOilSheetOpen: (open: boolean, bottleId?: string) => void;
    startPageTransition: (route: string, bgColor?: string, keyword?: string) => void;
    endPageTransition: () => void;
    setPreloaderComplete: (v: boolean) => void;
    setAudioEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isMenuOpen: false,
    isOilModalOpen: false,
    isConciergeOpen: false,
    conciergeContext: null,
    isLightboxOpen: false,
    isOilSheetOpen: false,
    selectedBottleId: null,
    isTransitioning: false,
    nextRoute: null,
    transitionBgColor: '#F3EFE7',
    transitionKeyword: null,
    isPreloaderComplete: false,
    audioEnabled: false,

    setMenuOpen: (open) => set({ isMenuOpen: open }),
    setOilModalOpen: (open) => set({ isOilModalOpen: open }),
    setConciergeOpen: (open, context = 'default') =>
        set({ isConciergeOpen: open, conciergeContext: open ? context : null }),
    setLightboxOpen: (open) => set({ isLightboxOpen: open }),
    setOilSheetOpen: (open, bottleId) =>
        set({ isOilSheetOpen: open, selectedBottleId: open ? (bottleId || null) : null }),
    startPageTransition: (route, bgColor = '#F3EFE7', keyword) => set({
        isTransitioning: true,
        nextRoute: route,
        transitionBgColor: bgColor,
        transitionKeyword: keyword || null,
    }),
    endPageTransition: () => set({ isTransitioning: false, nextRoute: null, transitionKeyword: null }),
    setPreloaderComplete: (v) => set({ isPreloaderComplete: v }),
    setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
}));
