import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['it', 'en'],

    // Used when no locale matches
    defaultLocale: 'it',
    
    // Non mostriamo il prefisso /it se l'utente è sul default locale, così l'URL root rimane pulito
    localePrefix: 'as-needed' 
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
