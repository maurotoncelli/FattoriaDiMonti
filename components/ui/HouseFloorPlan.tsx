import React from 'react';

interface HouseFloorPlanProps {
    floorId: string; // 'piano-terra' | 'piano-superiore'
    className?: string;
}

/**
 * Piantine architettoniche placeholder della Casa Rossa.
 * Da sostituire con gli SVG definitivi del rilievo quando disponibili.
 *
 * Nessun testo dentro l'SVG (regola i18n): gli ambienti sono indicati da
 * marker numerati che corrispondono, in ordine, alla legenda `spaces`
 * definita nei messages.
 */
export default function HouseFloorPlan({ floorId, className = '' }: HouseFloorPlanProps) {
    const stroke = 'var(--argilla-ferrosa)';
    const thin = '1';
    const wall = '2';
    const dash = '4 4';

    const Marker = ({ x, y, n }: { x: number; y: number; n: number }) => (
        <g>
            <circle cx={x} cy={y} r="11" fill="var(--tufo)" stroke={stroke} strokeWidth={thin} />
            <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-inter)"
                fill={stroke}
            >
                {n}
            </text>
        </g>
    );

    if (floorId === 'piano-terra') {
        return (
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
                {/* Perimetro doppio muro */}
                <rect x="20" y="50" width="360" height="230" stroke={stroke} strokeWidth={wall} />
                <rect x="26" y="56" width="348" height="218" stroke={stroke} strokeWidth="0.6" opacity="0.35" />

                {/* 1 — Veranda d'ingresso (avancorpo) */}
                <rect x="140" y="20" width="120" height="30" stroke={stroke} strokeWidth={wall} />
                <path d="M150 20 V50 M170 20 V50 M190 20 V50 M210 20 V50 M230 20 V50 M250 20 V50" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
                <Marker x={200} y={35} n={1} />

                {/* 2 — Doppio soggiorno con camino (sinistra) */}
                <path d="M20 165 H175" stroke={stroke} strokeWidth={thin} />
                <path d="M175 50 V280" stroke={stroke} strokeWidth={thin} />
                {/* camino sul muro ovest */}
                <rect x="20" y="95" width="14" height="34" stroke={stroke} strokeWidth={thin} />
                <path d="M23 101 h8 M23 108 h8 M23 115 h8" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
                {/* divani (tratteggio arredo) */}
                <rect x="60" y="80" width="70" height="22" rx="3" stroke={stroke} strokeWidth={thin} strokeDasharray={dash} />
                <rect x="60" y="118" width="70" height="22" rx="3" stroke={stroke} strokeWidth={thin} strokeDasharray={dash} />
                <Marker x={100} y={200} n={2} />
                {/* tappeto */}
                <rect x="50" y="185" width="100" height="70" stroke={stroke} strokeWidth="0.6" opacity="0.35" />

                {/* 3 — Sala pranzo (centro) */}
                <path d="M285 50 V170" stroke={stroke} strokeWidth={thin} />
                <ellipse cx="230" cy="105" rx="34" ry="22" stroke={stroke} strokeWidth={thin} strokeDasharray={dash} />
                <Marker x={230} y={150} n={3} />

                {/* 4 — Cucina attrezzata (destra alto) */}
                <path d="M285 170 H380" stroke={stroke} strokeWidth={thin} />
                <path d="M295 60 h75 M295 74 h75" stroke={stroke} strokeWidth={thin} opacity="0.6" />
                <circle cx="310" cy="100" r="6" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
                <circle cx="328" cy="100" r="6" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
                <Marker x={332} y={135} n={4} />

                {/* 5 — Bagno con vasca (destra basso) */}
                <path d="M285 170 V280" stroke={stroke} strokeWidth={thin} />
                <path d="M285 225 H380" stroke={stroke} strokeWidth={thin} />
                <rect x="300" y="182" width="55" height="24" rx="10" stroke={stroke} strokeWidth={thin} opacity="0.6" />
                <Marker x={332} y={210} n={5} />

                {/* 6 — Lavanderia */}
                <rect x="300" y="238" width="22" height="22" stroke={stroke} strokeWidth={thin} opacity="0.6" />
                <circle cx="311" cy="249" r="7" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
                <Marker x={355} y={252} n={6} />

                {/* Porte (archi tratteggiati) */}
                <path d="M195 50 Q195 80 225 80" stroke={stroke} strokeWidth="0.8" strokeDasharray={dash} />
                <path d="M175 200 Q205 200 205 230" stroke={stroke} strokeWidth="0.8" strokeDasharray={dash} />
                <path d="M285 195 Q310 195 310 218" stroke={stroke} strokeWidth="0.8" strokeDasharray={dash} opacity="0.7" />

                {/* Finestre */}
                <rect x="55" y="277" width="50" height="6" fill={stroke} opacity="0.3" />
                <rect x="210" y="277" width="50" height="6" fill={stroke} opacity="0.3" />
                <rect x="17" y="200" width="6" height="50" fill={stroke} opacity="0.3" />
                <rect x="377" y="90" width="6" height="50" fill={stroke} opacity="0.3" />
            </svg>
        );
    }

    // Piano superiore
    return (
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
            {/* Perimetro doppio muro */}
            <rect x="20" y="30" width="360" height="240" stroke={stroke} strokeWidth={wall} />
            <rect x="26" y="36" width="348" height="228" stroke={stroke} strokeWidth="0.6" opacity="0.35" />

            {/* Corridoio centrale */}
            <path d="M20 138 H380 M20 162 H380" stroke={stroke} strokeWidth={thin} opacity="0.8" />

            {/* 1 — Camera matrimoniale vista colline (alto sx) */}
            <path d="M155 30 V138" stroke={stroke} strokeWidth={thin} />
            <rect x="55" y="55" width="56" height="66" rx="2" stroke={stroke} strokeWidth={thin} strokeDasharray={dash} />
            <path d="M55 72 H111" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
            <Marker x={130} y={55} n={1} />

            {/* 2 — Camera matrimoniale divisibile (alto dx) */}
            <path d="M255 30 V138" stroke={stroke} strokeWidth={thin} />
            <rect x="285" y="55" width="26" height="64" rx="2" stroke={stroke} strokeWidth={thin} strokeDasharray={dash} />
            <rect x="317" y="55" width="26" height="64" rx="2" stroke={stroke} strokeWidth={thin} strokeDasharray={dash} />
            <Marker x={272} y={55} n={2} />

            {/* 5 — Bagno (alto centro) */}
            <circle cx="185" cy="70" r="9" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
            <rect x="215" y="55" width="22" height="34" rx="4" stroke={stroke} strokeWidth={thin} opacity="0.6" />
            <Marker x={205} y={115} n={5} />

            {/* 3 — Camera alla francese (basso sx) */}
            <path d="M140 162 V270" stroke={stroke} strokeWidth={thin} />
            <rect x="50" y="190" width="48" height="60" rx="2" stroke={stroke} strokeWidth={thin} strokeDasharray={dash} />
            <path d="M50 205 H98" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
            <Marker x={118} y={245} n={3} />

            {/* 4 — Camera panoramica al tramonto (basso dx, la più ampia) */}
            <path d="M240 162 V270" stroke={stroke} strokeWidth={thin} />
            <rect x="285" y="185" width="60" height="68" rx="2" stroke={stroke} strokeWidth={thin} strokeDasharray={dash} />
            <path d="M285 202 H345" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
            <Marker x={262} y={245} n={4} />

            {/* 6 — Secondo bagno (basso centro) */}
            <circle cx="175" cy="200" r="9" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
            <rect x="200" y="185" width="22" height="34" rx="4" stroke={stroke} strokeWidth={thin} opacity="0.6" />
            <Marker x={190} y={245} n={6} />

            {/* 7 — Scala alla terrazza (corridoio, destra) */}
            <path d="M340 138 V162 M348 138 V162 M356 138 V162 M364 138 V162 M372 138 V162" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
            <Marker x={325} y={150} n={7} />

            {/* Porte camere dal corridoio */}
            <path d="M85 138 Q85 118 65 118" stroke={stroke} strokeWidth="0.8" strokeDasharray={dash} opacity="0.7" />
            <path d="M310 138 Q310 118 330 118" stroke={stroke} strokeWidth="0.8" strokeDasharray={dash} opacity="0.7" />
            <path d="M85 162 Q85 182 105 182" stroke={stroke} strokeWidth="0.8" strokeDasharray={dash} opacity="0.7" />
            <path d="M310 162 Q310 182 290 182" stroke={stroke} strokeWidth="0.8" strokeDasharray={dash} opacity="0.7" />

            {/* Finestre panoramiche */}
            <rect x="50" y="27" width="55" height="6" fill={stroke} opacity="0.3" />
            <rect x="290" y="27" width="55" height="6" fill={stroke} opacity="0.3" />
            <rect x="50" y="267" width="55" height="6" fill={stroke} opacity="0.3" />
            <rect x="290" y="267" width="55" height="6" fill={stroke} opacity="0.3" />
            <rect x="377" y="185" width="6" height="55" fill={stroke} opacity="0.3" />
        </svg>
    );
}
