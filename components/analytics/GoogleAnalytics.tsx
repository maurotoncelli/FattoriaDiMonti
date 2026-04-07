'use client';

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

/**
 * Google Analytics 4 — predisposizione GDPR-aware.
 *
 * Il componente si carica SOLO se:
 *  1. La variabile d'ambiente NEXT_PUBLIC_GA_MEASUREMENT_ID è definita
 *  2. Il cookie `fdm_analytics_consent` è impostato a "granted"
 *     (gestito dal futuro banner cookie consent)
 *
 * Per attivare durante lo sviluppo senza consent banner:
 *   NEXT_PUBLIC_GA_FORCE_DEV=true nel .env.local
 */

import { useEffect, useState } from 'react';

function getCookieConsent(): boolean {
    if (typeof document === 'undefined') return false;
    const cookies = document.cookie.split(';');
    const consent = cookies.find(c => c.trim().startsWith('fdm_analytics_consent='));
    return consent ? consent.trim().split('=')[1] === 'granted' : false;
}

export default function GoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const forceDev = process.env.NEXT_PUBLIC_GA_FORCE_DEV === 'true';
    const [hasConsent, setHasConsent] = useState(false);

    useEffect(() => {
        // Controlla il consenso iniziale
        setHasConsent(forceDev || getCookieConsent());

        // Ascolta l'evento custom fired dal futuro cookie banner
        const handler = () => setHasConsent(getCookieConsent());
        window.addEventListener('fdm:analytics-consent-updated', handler);
        return () => window.removeEventListener('fdm:analytics-consent-updated', handler);
    }, [forceDev]);

    if (!gaId || !hasConsent) return null;

    return <NextGoogleAnalytics gaId={gaId} />;
}

/**
 * Helper: accordare il consenso dal cookie banner futuro.
 * Chiamare questa funzione quando l'utente accetta i cookie analytics.
 *
 * ```ts
 * import { grantAnalyticsConsent } from '@/components/analytics/GoogleAnalytics';
 * grantAnalyticsConsent();
 * ```
 */
export function grantAnalyticsConsent() {
    document.cookie = 'fdm_analytics_consent=granted; max-age=31536000; path=/; SameSite=Lax';
    window.dispatchEvent(new Event('fdm:analytics-consent-updated'));
}

export function revokeAnalyticsConsent() {
    document.cookie = 'fdm_analytics_consent=revoked; max-age=31536000; path=/; SameSite=Lax';
    window.dispatchEvent(new Event('fdm:analytics-consent-updated'));
}
