'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';

export default function AudioToggle() {
    const { audioEnabled, setAudioEnabled } = useAppStore();
    const [hovered, setHovered] = useState(false);
    const t = useTranslations('UI.audio');

    const toggle = () => {
        setAudioEnabled(!audioEnabled);
    };

    return (
        <button
            onClick={toggle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={audioEnabled ? t('disableAria') : t('enableAria')}
            style={{
                background: 'transparent',
                border: 'none',
                padding: '0.45rem 1rem',
                cursor: 'none',
                color: hovered ? 'var(--argilla-ferrosa)' : 'rgba(236,232,223,0.4)',
                fontFamily: 'var(--font-inter)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
            }}
        >
            {audioEnabled ? t('on') : t('off')}
        </button>
    );
}

