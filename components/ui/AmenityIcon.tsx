import React from 'react';

/**
 * Icone minimali stroke-based per le comodità della Casa Rossa
 * (stile Airbnb ma coerente col linguaggio grafico del sito).
 * Il colore segue `currentColor` del contenitore.
 */
export default function AmenityIcon({ name, size = 20 }: { name: string; size?: number }) {
    const common = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    switch (name) {
        case 'fireplace':
            return <svg {...common}><path d="M3 3h18" /><path d="M4 3v18" /><path d="M20 3v18" /><path d="M4 21h16" /><path d="M12 9c-2 2.5-3 4-3 5.6A3.2 3.2 0 0 0 12 18a3.2 3.2 0 0 0 3-3.4c0-1.6-1-3.1-3-5.6z" /></svg>;
        case 'book':
            return <svg {...common}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>;
        case 'tv':
            return <svg {...common}><rect x="2" y="5" width="20" height="13" rx="2" /><path d="M8 21h8" /><path d="M12 18v3" /></svg>;
        case 'sparkle':
            return <svg {...common}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></svg>;
        case 'kitchen':
            return <svg {...common}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>;
        case 'dining':
            return <svg {...common}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" opacity="0.5" /></svg>;
        case 'washer':
            return <svg {...common}><rect x="3" y="2" width="18" height="20" rx="2" /><circle cx="12" cy="13" r="5" /><path d="M7 5h.01" /><path d="M11 5h2" /></svg>;
        case 'pool':
            return <svg {...common}><path d="M2 15c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" /><path d="M2 20c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" /><path d="M8 12V4.5A1.5 1.5 0 0 1 9.5 3h0A1.5 1.5 0 0 1 11 4.5V5" /><path d="M16 12V4.5A1.5 1.5 0 0 0 14.5 3h0A1.5 1.5 0 0 0 13 4.5V5" /><path d="M8 8h8" /></svg>;
        case 'grill':
            return <svg {...common}><path d="M4 8h16a8 8 0 0 1-16 0z" /><path d="M12 16v2" /><path d="m7 21 2-3" /><path d="m17 21-2-3" /><path d="M9 4v1" /><path d="M12 3v2" /><path d="M15 4v1" /></svg>;
        case 'telescope':
            return <svg {...common}><path d="m4 11 14-7 2 4-14 7z" /><path d="M10 13.5 7 21" /><path d="m13 12 4 9" /><circle cx="11" cy="13" r="1.5" /></svg>;
        case 'leaf':
            return <svg {...common}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 22 12 12" /></svg>;
        case 'wifi':
            return <svg {...common}><path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 9.5C7.5 4.5 16.5 4.5 22 9.5" /><path d="M12 20h.01" /></svg>;
        case 'towel':
            return <svg {...common}><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8C21 8.5 18 8 15.5 8" /><path d="M15.5 15H5" /><path d="M15.5 3v12" /></svg>;
        case 'hairdryer':
            return <svg {...common}><path d="m6 16 3-8-3-8h16l-3 8 3 8zM15 8h.01" /><path d="M11 22v-6" /></svg>;
        case 'car':
            return <svg {...common}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>;
        case 'bed':
            return <svg {...common}><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" /></svg>;
        case 'bath':
            return <svg {...common}><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><line x1="10" x2="8" y1="5" y2="7" /><line x1="2" x2="22" y1="12" y2="12" /><line x1="7" x2="7" y1="19" y2="21" /><line x1="17" x2="17" y1="19" y2="21" /></svg>;
        default:
            return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
    }
}
