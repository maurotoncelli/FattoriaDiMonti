import { create } from 'zustand';

interface AppState {
    // Sezione corrente (usata da CursorEngine per varianti visive)
    currentSection: string;
    // Modals / Overlays
    isMenuOpen: boolean;
    isOilModalOpen: boolean;
    isConciergeOpen: boolean;
    conciergeContext: 'default' | 'cucina-nomade' | null;
    isLightboxOpen: boolean;
    isJerkySheetOpen: boolean;
    selectedJerkyId: string | null;
    isOilSheetOpen: boolean;
    selectedBottleId: string | null;
    isRoomSheetOpen: boolean;
    selectedRoomId: string | null;
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
    // Canvas WebGL
    canvasEnabled: boolean;
    // Actions
    setMenuOpen: (open: boolean) => void;
    setOilModalOpen: (open: boolean) => void;
    setConciergeOpen: (open: boolean, context?: 'default' | 'cucina-nomade') => void;
    setLightboxOpen: (open: boolean) => void;
    setJerkySheetOpen: (open: boolean, productId?: string) => void;
    setOilSheetOpen: (open: boolean, bottleId?: string) => void;
    setRoomSheetOpen: (open: boolean, roomId?: string) => void;
    startPageTransition: (route: string, bgColor?: string, keyword?: string) => void;
    endPageTransition: () => void;
    setPreloaderComplete: (v: boolean) => void;
    triggerEasterEgg: () => void;
    resetEasterEgg: () => void;
    setAudioEnabled: (enabled: boolean) => void;
    setCanvasEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    currentSection: '00-hero',
    isMenuOpen: false,
    isOilModalOpen: false,
    isConciergeOpen: false,
    conciergeContext: null,
    isLightboxOpen: false,
    isJerkySheetOpen: false,
    selectedJerkyId: null,
    isOilSheetOpen: false,
    selectedBottleId: null,
    isRoomSheetOpen: false,
    selectedRoomId: null,
    isTransitioning: false,
    nextRoute: null,
    transitionBgColor: '#F3EFE7',
    transitionKeyword: null,
    isPreloaderComplete: false,
    easterEggTriggered: false,
    audioEnabled: false,
    // Legge preferenza salvata; default true (canvas attivo)
    canvasEnabled: typeof window !== 'undefined'
        ? localStorage.getItem('fdm_canvas_enabled') !== 'false'
        : true,

    setMenuOpen: (open) => set({ isMenuOpen: open }),
    setOilModalOpen: (open) => set({ isOilModalOpen: open }),
    setConciergeOpen: (open, context = 'default') =>
        set({ isConciergeOpen: open, conciergeContext: open ? context : null }),
    setLightboxOpen: (open) => set({ isLightboxOpen: open }),
    setJerkySheetOpen: (open, productId) =>
        set({ isJerkySheetOpen: open, selectedJerkyId: open ? (productId || null) : null }),
    setOilSheetOpen: (open, bottleId) =>
        set({ isOilSheetOpen: open, selectedBottleId: open ? (bottleId || null) : null }),
    setRoomSheetOpen: (open, roomId) =>
        set({ isRoomSheetOpen: open, selectedRoomId: open ? (roomId || null) : null }),
    startPageTransition: (route, bgColor = '#F3EFE7', keyword) => set({
        isTransitioning: true,
        nextRoute: route,
        transitionBgColor: bgColor,
        transitionKeyword: keyword || null,
    }),
    endPageTransition: () => set({ isTransitioning: false, nextRoute: null, transitionKeyword: null }),
    setPreloaderComplete: (v) => set({ isPreloaderComplete: v }),
    triggerEasterEgg: () => set({ easterEggTriggered: true }),
    resetEasterEgg: () => set({ easterEggTriggered: false }),
    setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
    setCanvasEnabled: (enabled) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('fdm_canvas_enabled', String(enabled));
        }
        set({ canvasEnabled: enabled });
    },
}));
