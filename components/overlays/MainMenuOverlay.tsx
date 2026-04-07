'use client';

import { useAppStore } from '@/store/useAppStore';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useState, useMemo } from 'react';
import AudioToggle from '../ui/AudioToggle';
import { getMainMenuLinks, NavLink } from '@/lib/data/menu';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

const RenderDynamicPanel = ({ data }: { data: NavLink['panelData'] }) => {
    if (data.type === 'STORY') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{
                    fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '4.5rem',
                    color: 'var(--tufo)', lineHeight: 1,
                    animation: `fadeInUp 0.8s ease 0.1s both`
                }}>
                    {data.title}
                </div>
                <div style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.9rem', letterSpacing: '0.04em',
                    color: 'rgba(236,232,223,0.6)', maxWidth: '300px', lineHeight: 1.7,
                    animation: `fadeInUp 0.8s ease 0.3s both`
                }}>
                    {data.text}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            {data.title && (
                <div style={{
                    fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '2.5rem',
                    color: 'var(--tufo)', letterSpacing: '0.02em',
                    animation: `fadeInUp 0.8s ease 0.1s both`
                }}>
                    {data.title}
                </div> 
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '340px' }}>
                {data.stats?.map((stat, idx) => (
                    <div key={idx} style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                        borderBottom: '1px solid rgba(236,232,223,0.1)', paddingBottom: '0.4rem',
                        animation: `fadeInUp 0.8s ease ${0.2 + idx * 0.08}s both`
                    }}>
                        <span style={{ 
                            fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', 
                            color: 'var(--argilla-ferrosa)', textTransform: 'uppercase' 
                        }}>
                            ✦ {stat.label}
                        </span>
                        <span style={{ 
                            fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '1.2rem', 
                            color: 'rgba(236,232,223,0.85)', textAlign: 'right'
                        }}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            {data.text && (
                <div style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.85rem', letterSpacing: '0.02em',
                    color: 'rgba(236,232,223,0.5)', maxWidth: '320px', lineHeight: 1.6,
                    marginTop: '0.5rem',
                    animation: `fadeInUp 0.8s ease ${0.3 + (data.stats ? data.stats.length * 0.08 : 0)}s both`
                }}>
                    {data.text}
                </div>
            )}

            {data.quote && (
                <div style={{
                    fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '1.35rem',
                    color: 'rgba(236,232,223,0.4)', maxWidth: '300px', lineHeight: 1.4, 
                    marginTop: '0.5rem',
                    animation: `fadeInUp 0.8s ease ${0.3 + (data.stats ? data.stats.length * 0.08 : 0)}s both`
                }}>
                    "{data.quote}"
                </div>
            )}
        </div>
    );
};

export default function MainMenuOverlay() {
    const { setMenuOpen, setConciergeOpen, startPageTransition } = useAppStore();
    const tMenu = useTranslations('Overlays.mainMenu');
    const tNav = useTranslations('Navigation');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [hoveredLink, setHoveredLink] = useState<NavLink | null>(null);

    // Pass tNav to getMainMenuLinks so all labels come from messages JSON
    const NAV_LINKS = useMemo(() => getMainMenuLinks(tNav), [tNav]);
    const t = tMenu;

    const handleNavigate = (link: NavLink) => {
        if (link.action === 'concierge') {
            setMenuOpen(false);
            setConciergeOpen(true);
        } else if (link.href) {
            const href = link.href; // narrowed to string
            if (href.startsWith('/#')) {
                if (pathname === '/') {
                    // Anchor scroll sulla homepage: nessuna transizione di pagina
                    const elId = href.replace('/#', '');
                    const el = document.getElementById(elId);
                    if (el) {
                        const lenis = (window as any).__lenis;
                        if (lenis) {
                            lenis.scrollTo(el, { duration: 1.8, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                        } else {
                            el.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                    setMenuOpen(false);
                } else {
                    // Navigazione verso homepage con anchor: chiudi menu poi transizione
                    setMenuOpen(false);
                    startPageTransition(href, '#181A15');
                    setTimeout(() => router.push(href), 900);
                }
            } else if (href === '/') {
                if (pathname === '/') {
                    // Già sulla home: scroll to top senza transizione
                    const lenis = (window as any).__lenis;
                    if (lenis) lenis.scrollTo(0, { duration: 1.8 });
                    else window.scrollTo({ top: 0, behavior: 'smooth' });
                    setMenuOpen(false);
                } else {
                    // Verso home da altra pagina: transizione
                    setMenuOpen(false);
                    startPageTransition('/', '#181A15');
                    setTimeout(() => router.push('/'), 900);
                }
            } else {
                // Navigazione standard verso pagina inner: transizione
                setMenuOpen(false);
                startPageTransition(href, '#181A15');
                setTimeout(() => router.push(href), 900);
            }
        }
    };

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    const isMobile = useIsMobile(1024);
    const activePanel = hoveredLink || NAV_LINKS[0];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 95,
                background: 'rgba(25, 23, 22, 0.99)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: isMobile ? 'flex-start' : 'center',
                animation: isMobile
                    ? 'slideUpMenu 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                    : 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden',
            }}
        >
            <div className="css-grain" style={{ position: 'absolute', inset: 0, zIndex: -1 }} />

            {/* Chiudi */}
            <button
                onClick={() => setMenuOpen(false)}
                aria-label={t('closeAria')}
                style={{
                    position: 'absolute',
                    top: 'calc(1.5rem + env(safe-area-inset-top, 0px))',
                    right: '1.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(107,122,101,0.4)',
                    borderRadius: '9999px',
                    padding: '0.55rem 1.3rem',
                    color: 'var(--olive)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    zIndex: 10,
                    minHeight: '40px',
                }}
            >
                {t('closeLabel')}
            </button>

            {isMobile ? (
                /* ── MOBILE LAYOUT: column, nav-first, no panel ── */
                <>
                    <nav style={{
                        width: '100%',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: 'calc(5rem + env(safe-area-inset-top,0px)) 8vw 2rem',
                        gap: '0.2rem',
                    }}>
                        {NAV_LINKS.map((link, i) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavigate(link)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(236,232,223,0.07)',
                                    textAlign: 'left',
                                    width: '100%',
                                    fontFamily: 'var(--font-playfair)',
                                    fontStyle: 'italic',
                                    fontSize: 'clamp(2rem, 8vw, 3rem)',
                                    lineHeight: 1.1,
                                    color: 'var(--tufo)',
                                    padding: '0.9rem 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    animation: `slideUpItem 0.5s ease ${0.08 + i * 0.06}s both`,
                                }}
                            >
                                <span>{link.label}</span>
                                <span style={{
                                    fontFamily: 'var(--font-inter)',
                                    fontSize: '10px',
                                    letterSpacing: '0.1em',
                                    color: 'rgba(236,232,223,0.2)',
                                    flexShrink: 0,
                                }}>
                                    {link.index}
                                </span>
                            </button>
                        ))}
                    </nav>

                    {/* Utility Bar mobile */}
                    <div style={{
                        width: '100%',
                        padding: '1.5rem 8vw',
                        paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid rgba(236,232,223,0.08)',
                        animation: 'fadeInUp 0.4s ease 0.5s both',
                    }}>
                        <div style={{ display: 'flex', gap: '1.2rem' }}>
                            {['it', 'en'].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => switchLocale(l)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: locale === l ? 'var(--argilla-ferrosa)' : 'rgba(236,232,223,0.3)',
                                        fontFamily: 'var(--font-inter)',
                                        fontSize: '11px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        minHeight: '40px',
                                        minWidth: '40px',
                                    }}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                        <AudioToggle />
                    </div>
                </>
            ) : (
                /* ── DESKTOP LAYOUT: row con pannello sinistra + nav destra ── */
                <>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        maxWidth: '1600px',
                        height: '100%',
                        padding: '12vh 6vw',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        {/* Colonna Sinistra: Pannello + Immagine */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            paddingBottom: '2rem',
                            minWidth: '340px',
                            maxWidth: '420px',
                            flex: 1,
                            gap: '3.5rem',
                        }}>
                            <div style={{
                                width: '100%',
                                aspectRatio: '16/10',
                                flexShrink: 0,
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                animation: 'fadeIn 1s ease 0.2s both',
                            }}>
                                {NAV_LINKS.map(link => link.image && (
                                    <img
                                        key={`img-${link.id}`}
                                        src={link.image}
                                        alt=""
                                        aria-hidden="true"
                                        role="presentation"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center center',
                                            opacity: activePanel.id === link.id ? 1 : 0,
                                            transition: 'opacity 0.6s ease',
                                            filter: 'contrast(1.1) brightness(0.85) grayscale(15%)',
                                        }}
                                    />
                                ))}
                            </div>

                            <div style={{ display: 'grid' }}>
                                {NAV_LINKS.map(link => (
                                    <div
                                        key={`panel-${link.id}`}
                                        style={{
                                            gridRow: 1,
                                            gridColumn: 1,
                                            opacity: activePanel.id === link.id ? 1 : 0,
                                            transition: 'opacity 0.5s ease',
                                            pointerEvents: activePanel.id === link.id ? 'auto' : 'none',
                                        }}
                                    >
                                        <RenderDynamicPanel data={link.panelData} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Colonna Destra: Link Navigazione */}
                        <nav style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            gap: '1.2rem',
                            flex: 1,
                            paddingLeft: '10vw',
                        }}>
                            {NAV_LINKS.map((link, i) => (
                                <div
                                    key={link.id}
                                    style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', cursor: 'none' }}
                                >
                                    <span style={{
                                        fontFamily: 'var(--font-inter)',
                                        fontSize: '11px',
                                        letterSpacing: '0.1em',
                                        color: hoveredLink?.id === link.id ? 'var(--argilla-ferrosa)' : 'rgba(236,232,223,0.15)',
                                        transition: 'color 0.4s',
                                        animation: `fadeInRight 0.6s ease ${0.1 + (i * 0.04)}s both`,
                                    }}>
                                        {link.index}
                                    </span>
                                    <button
                                        onClick={() => handleNavigate(link)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            textAlign: 'left',
                                            fontFamily: 'var(--font-playfair)',
                                            fontStyle: 'italic',
                                            fontSize: 'clamp(2rem, 4.5vh, 5.5rem)',
                                            lineHeight: 1.05,
                                            color: hoveredLink?.id === link.id ? 'var(--tufo)' : (hoveredLink ? 'rgba(236,232,223,0.2)' : 'var(--tufo)'),
                                            cursor: 'none',
                                            transition: 'color 0.4s ease, transform 0.4s ease',
                                            transform: hoveredLink && hoveredLink.id !== link.id ? 'translateX(10px)' : 'translateX(0)',
                                            animation: `fadeInRight 0.6s ease ${0.1 + (i * 0.04)}s both`,
                                            whiteSpace: 'nowrap',
                                        }}
                                        onMouseEnter={() => setHoveredLink(link)}
                                        onMouseLeave={() => setHoveredLink(null)}
                                    >
                                        {link.label}
                                    </button>
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Utility Bar desktop */}
                    <div style={{
                        position: 'absolute',
                        bottom: '3rem',
                        right: '4vw',
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                        animation: 'fadeInUp 0.5s ease 0.6s both',
                    }}>
                        <AudioToggle />
                        <span style={{ color: 'rgba(236,232,223,0.15)' }}>|</span>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['it', 'en', 'fr', 'de', 'es'].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => switchLocale(l)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: locale === l ? 'var(--argilla-ferrosa)' : 'rgba(236,232,223,0.3)',
                                        fontFamily: 'var(--font-inter)',
                                        fontSize: '10px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'none',
                                        transition: 'color 0.3s',
                                    }}
                                    onMouseEnter={(e) => { if (locale !== l) (e.target as HTMLElement).style.color = 'var(--tufo)'; }}
                                    onMouseLeave={(e) => { if (locale !== l) (e.target as HTMLElement).style.color = 'rgba(236,232,223,0.3)'; }}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUpMenu {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUpItem {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .css-grain {
           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
           opacity: 0.12;
           pointer-events: none;
        }
      `}</style>
        </div>
    );
}
