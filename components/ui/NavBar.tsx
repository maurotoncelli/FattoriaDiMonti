'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useAppStore } from '@/store/useAppStore';
import { getNavbarLinks, NavbarLink } from '@/lib/data/menu';
import AudioToggle from './AudioToggle';

/**
 * Navbar desktop (>= lg). Sostituisce la pill + overlay su desktop:
 * niente immagini precaricate, solo testo. Su mobile resta MenuTrigger
 * con MainMenuOverlay.
 */
export default function NavBar() {
    const tNav = useTranslations('Navigation');
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const startPageTransition = useAppStore((s) => s.startPageTransition);

    const links = useMemo(() => getNavbarLinks(tNav), [tNav]);

    const scrollWithLenis = (target: number | HTMLElement) => {
        const lenis = (window as any).__lenis;
        if (lenis) lenis.scrollTo(target, { duration: 1.8, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
        else target.scrollIntoView({ behavior: 'smooth' });
    };

    const handleNavigate = (link: NavbarLink) => {
        const href = link.href;
        if (href.startsWith('/#')) {
            if (pathname === '/') {
                const el = document.getElementById(href.replace('/#', ''));
                if (el) scrollWithLenis(el);
            } else {
                startPageTransition(href, '#EAE6DD');
            }
            return;
        }
        if (href === pathname) {
            scrollWithLenis(0);
            return;
        }
        startPageTransition(href, '#EAE6DD');
    };

    const isActive = (link: NavbarLink) =>
        link.href === '/' ? pathname === '/' : pathname.startsWith(link.href) && link.href !== '/#04-footer';

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <header
            className="hidden lg:flex"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 90,
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
                padding: '0 2.5rem',
                height: '58px',
                background: 'rgba(234,230,221,0.86)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(82,70,58,0.12)',
            }}
        >
            {/* Brand */}
            <button
                onClick={() => handleNavigate(links[0])}
                aria-label={tNav('brand')}
                style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontFamily: 'var(--font-playfair), serif',
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    letterSpacing: '0.02em',
                    color: 'var(--mucco-pisano)',
                    cursor: 'none',
                    whiteSpace: 'nowrap',
                }}
            >
                {tNav('brand')}
            </button>

            {/* Voci */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1.1rem, 2vw, 2.2rem)' }} aria-label={tNav('brand')}>
                {links.map((link) => {
                    const active = isActive(link);
                    return (
                        <button
                            key={link.id}
                            onClick={() => handleNavigate(link)}
                            aria-current={active ? 'page' : undefined}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '0.4rem 0',
                                fontFamily: 'var(--font-inter)',
                                fontSize: '10px',
                                fontWeight: 500,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: active ? 'var(--argilla-ferrosa)' : 'rgba(82,70,58,0.72)',
                                borderBottom: active ? '1px solid var(--argilla-ferrosa)' : '1px solid transparent',
                                cursor: 'none',
                                whiteSpace: 'nowrap',
                                transition: 'color 0.3s, border-color 0.3s',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--mucco-pisano)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = active ? 'var(--argilla-ferrosa)' : 'rgba(82,70,58,0.72)'; }}
                        >
                            {link.label}
                        </button>
                    );
                })}
            </nav>

            {/* Audio + locale switcher */}
            <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
                <AudioToggle />
                <span aria-hidden="true" style={{ color: 'rgba(82,70,58,0.2)', fontSize: '10px' }}>|</span>
                {['it', 'en'].map((l) => (
                    <button
                        key={l}
                        onClick={() => switchLocale(l)}
                        aria-current={locale === l ? 'true' : undefined}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            fontFamily: 'var(--font-inter)',
                            fontSize: '10px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: locale === l ? 'var(--argilla-ferrosa)' : 'rgba(82,70,58,0.4)',
                            cursor: 'none',
                            transition: 'color 0.3s',
                        }}
                        onMouseEnter={(e) => { if (locale !== l) (e.currentTarget as HTMLElement).style.color = 'var(--mucco-pisano)'; }}
                        onMouseLeave={(e) => { if (locale !== l) (e.currentTarget as HTMLElement).style.color = 'rgba(82,70,58,0.4)'; }}
                    >
                        {l}
                    </button>
                ))}
            </div>
        </header>
    );
}
