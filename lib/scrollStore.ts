/**
 * Scroll state globale — NON React, NON Zustand.
 *
 * Lenis aggiorna questo oggetto ogni frame (~60fps) senza innescare
 * alcun re-render React. I componenti che necessitano di valori di scroll
 * (ScrollProgressTracker, AppWrapper) lo leggono direttamente
 * in loop imperativi (RAF, event listener) senza passare per React.
 */
export const scrollStore = {
    y: 0,
    velocity: 0,
};
