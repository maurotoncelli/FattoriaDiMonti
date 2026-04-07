import { create } from 'zustand';

interface AppState {
    // Scroll
    scrollY: number;
    scrollVelocity: number;
    currentSection: string;
    // Modals / Overlays
    isMenuOpen: boolean;
    isOilModalOpen: boolean;
    isConciergeOpen: boolean;
    conciergeContext: 'default' | 'cucina-nomade' | null;
    isLightboxOpen: boolean;
    // Routing Transitions
    isTransitioning: boolean;
    nextRoute: string | null;
    transitionBgColor: string;
    transitionKeyword: string | null;
    // Preloader
    isPreloaderComplete: boolean;
    // Easter Egg
    easterEggTriggered: boolean;
    // Audio
    audioEnabled: boolean;
    // Actions
    setScrollY: (y: number, velocity: number) => void;
    setCurrentSection: (section: string) => void;
    setMenuOpen: (open: boolean) => void;
    setOilModalOpen: (open: boolean) => void;
    setConciergeOpen: (open: boolean, context?: 'default' | 'cucina-nomade') => void;
    setLightboxOpen: (open: boolean) => void;
    startPageTransition: (route: string, bgColor?: string, keyword?: string) => void;
    endPageTransition: () => void;
    setPreloaderComplete: (v: boolean) => void;
    triggerEasterEgg: () => void;
    resetEasterEgg: () => void;
    setAudioEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    scrollY: 0,
    scrollVelocity: 0,
    currentSection: '00-hero',
    isMenuOpen: false,
    isOilModalOpen: false,
    isConciergeOpen: false,
    conciergeContext: null,
    isLightboxOpen: false,
    isTransitioning: false,
    nextRoute: null,
    transitionBgColor: '#F3EFE7',
    transitionKeyword: null,
    isPreloaderComplete: false,
    easterEggTriggered: false,
    audioEnabled: false,

    setScrollY: (y, velocity) => set({ scrollY: y, scrollVelocity: velocity }),
    setCurrentSection: (section) => set({ currentSection: section }),
    setMenuOpen: (open) => set({ isMenuOpen: open }),
    setOilModalOpen: (open) => set({ isOilModalOpen: open }),
    setConciergeOpen: (open, context = 'default') =>
        set({ isConciergeOpen: open, conciergeContext: open ? context : null }),
    setLightboxOpen: (open) => set({ isLightboxOpen: open }),
    startPageTransition: (route, bgColor = '#F3EFE7', keyword) => set({ isTransitioning: true, nextRoute: route, transitionBgColor: bgColor, transitionKeyword: keyword || null }),
    endPageTransition: () => set({ isTransitioning: false, nextRoute: null, transitionKeyword: null }),
    setPreloaderComplete: (v) => set({ isPreloaderComplete: v }),
    triggerEasterEgg: () => set({ easterEggTriggered: true }),
    resetEasterEgg: () => set({ easterEggTriggered: false }),
    setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
}));
