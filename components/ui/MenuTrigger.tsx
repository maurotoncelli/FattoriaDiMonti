'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';

export default function MenuTrigger() {
    const t = useTranslations('UI.menuTrigger');
    const { setMenuOpen, isMenuOpen, isOilModalOpen, isConciergeOpen, isLightboxOpen, isJerkySheetOpen, isOilSheetOpen, isRoomSheetOpen } = useAppStore();
    const [hovered, setHovered] = useState(false);

    const isAnyOverlayOpen = isMenuOpen || isOilModalOpen || isConciergeOpen || isLightboxOpen || isJerkySheetOpen || isOilSheetOpen || isRoomSheetOpen;

    return (
        <button
            onClick={() => setMenuOpen(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={t('ariaLabel')}
            style={{
                position: 'fixed',
                top: 'calc(1.5rem + env(safe-area-inset-top, 0px))',
                right: '1.5rem',
                zIndex: 100,
                background: 'rgba(236, 232, 223, 0.82)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${hovered ? 'var(--mucco-pisano)' : 'rgba(107,122,101,0.5)'}`,
                borderRadius: '9999px',
                padding: '0.55rem 1.3rem',
                cursor: 'pointer',
                color: 'var(--mucco-pisano)',
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'border-color 0.3s, transform 0.3s, opacity 0.3s, background 0.3s',
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                opacity: isAnyOverlayOpen ? 0 : 1,
                pointerEvents: isAnyOverlayOpen ? 'none' : 'auto',
                minHeight: '40px',
            }}
        >
            {t('label')}
        </button>
    );
}
