/** URL pubblico: da env su Vercel; fallback al dominio previsto finché non è acquistato. */
export const BASE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fattoriadimonti.it'
).replace(/\/$/, '');

/** URL assoluto per una pagina in una data locale (it senza prefisso, en con /en). */
export function localeUrl(locale: string, path: string = ''): string {
    return `${BASE_URL}${locale === 'it' ? '' : `/${locale}`}${path}`;
}

/** Canonical + hreflang per pagina, coerenti con il sitemap. */
export function pageAlternates(locale: string, path: string = '') {
    return {
        canonical: localeUrl(locale, path),
        languages: {
            it: `${BASE_URL}${path || '/'}`,
            en: `${BASE_URL}/en${path}`,
            'x-default': `${BASE_URL}${path || '/'}`,
        },
    };
}
