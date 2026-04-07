'use client';

import { usePathname, Link } from '@/i18n/routing';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';


export default function InnerFooter() {
    const pathname = usePathname();
    const setConciergeOpen = useAppStore((state) => state.setConciergeOpen);
    const t = useTranslations('Footer.innerFooter');

    // Only render on inner pages, not the home page
    if (pathname === '/' || !pathname) {
        return null;
    }

    const cream = '#D6D0C8';
    const creamDim = '#A89F96';

    return (
        <footer className="w-full bg-[var(--terra-nera)] py-[10vh] px-[8vw] z-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-t border-[var(--olive)]/30 pt-[8vh]">

                {/* Brand & Contacts */}
                <div className="flex flex-col gap-6">
                    <h3 className="font-playfair text-3xl mb-2" style={{ color: 'var(--olive)' }}>{t('brand.name')}</h3>
                    <div className="flex flex-col gap-1 font-inter text-xs tracking-wider uppercase">
                        <p style={{ color: cream }}>{t('brand.tagline')}</p>
                        <p style={{ color: cream }}>{t('brand.address')}</p>
                        <p style={{ color: cream }}>{t('brand.vat')}</p>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                        <a href={`mailto:${t('contacts.email')}`} className="font-inter text-sm hover:text-[var(--olive)] transition-colors" style={{ color: cream }}>
                            {t('contacts.email')}
                        </a>
                        <a href={`tel:${t('contacts.phone.href', { fallback: '+393000000000' })}`} className="font-inter text-sm hover:text-[var(--olive)] transition-colors" style={{ color: cream }}>
                            {t('contacts.phone.label')}
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-4">
                    {(t.raw('quickLinks') as any[]).map((link, idx) => (
                        link.action ? (
                            <button
                                key={idx}
                                onClick={() => setConciergeOpen(true, link.action === 'concierge-default' ? 'default' : 'cucina-nomade')}
                                className="text-left font-inter text-xs tracking-[0.2em] uppercase hover:text-[var(--olive)] transition-colors"
                                style={{ color: cream }}
                            >
                                {link.label}
                            </button>
                        ) : (
                            <Link key={idx} href={link.href as any || '/'} className="text-left font-inter text-xs tracking-[0.2em] uppercase hover:text-[var(--olive)] transition-colors" style={{ color: cream }}>
                                {link.label}
                            </Link>
                        )
                    ))}
                </div>

                {/* Credits & Legal */}
                <div className="flex flex-col md:text-right gap-4">
                    <div className="flex flex-col gap-1 font-inter text-[10px] tracking-[0.1em] uppercase" style={{ color: creamDim }}>
                        {(t.raw('legalLinks') as any[]).map((link, idx) => (
                            <Link key={idx} href={link.href as any || '/'} className="hover:text-[var(--olive)] transition-colors" style={{ color: creamDim }}>{link.label}</Link>
                        ))}
                    </div>
                    <div className="mt-8 font-inter text-[10px] tracking-[0.2em] uppercase">
                        <p className="mb-1" style={{ color: creamDim }}>{t('credits.copyrightPrefix')} {new Date().getFullYear()} {t('brand.name')}.</p>
                        <p style={{ color: creamDim }} dangerouslySetInnerHTML={{ __html: t.raw('credits.websiteBy') }} />
                    </div>
                </div>

            </div>
        </footer>
    );
}
