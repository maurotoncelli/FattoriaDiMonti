// Design tokens shared between CSS and Three.js
export const theme = {
    // Geologia Toscana palette
    tufo: '#ECE8DF',
    muccoPisano: '#4A2E1B',
    argillaFerrosa: '#B05C46',
    sabbiaLimonitica: '#D4A361',
    olive: '#6B7A65',
    terraNera: '#2B2420',
    grano: '#B4B886',

    // Aliases
    background: '#ECE8DF',
    textPrimary: '#4A2E1B',
    accent: '#B05C46',
    overlay: '#2B2420',
} as const;

export type ThemeColor = keyof typeof theme;
