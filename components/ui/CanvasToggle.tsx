'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';

interface CanvasToggleProps {
    /** Se true usa cursor:pointer (mobile), altrimenti cursor:none (desktop con cursore custom) */
    touchMode?: boolean;
}

export default function CanvasToggle({ touchMode = false }: CanvasToggleProps) {
    const canvasEnabled = useAppStore((s) => s.canvasEnabled);
    const setCanvasEnabled = useAppStore((s) => s.setCanvasEnabled);
    const [hovered, setHovered] = useState(false);
    const t = useTranslations('UI.canvasToggle');

    return (
        <button
            onClick={() => setCanvasEnabled(!canvasEnabled)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={canvasEnabled ? t('disable') : t('enable')}
            title={canvasEnabled ? t('titleDisable') : t('titleEnable')}
            style={{
                background: 'transparent',
                border: 'none',
                padding: '0.45rem 1rem',
                cursor: touchMode ? 'pointer' : 'none',
                color: hovered
                    ? 'var(--argilla-ferrosa)'
                    : canvasEnabled
                        ? 'rgba(236,232,223,0.4)'
                        : 'rgba(236,232,223,0.2)',
                fontFamily: 'var(--font-inter)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
            }}
        >
            {/* Indicatore visivo on/off */}
            <span style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: canvasEnabled ? 'var(--argilla-ferrosa)' : 'rgba(236,232,223,0.2)',
                transition: 'background 0.3s',
                flexShrink: 0,
            }} />
            {canvasEnabled ? t('on') : t('off')}
        </button>
    );
}
