import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function LocaleNotFound() {
    const t = useTranslations('NotFound');
    return (
        <main className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 text-center text-[var(--mucco-pisano)]">
            <span className="font-inter text-xs uppercase tracking-[0.25em] opacity-60 mb-6">404</span>
            <h1 className="font-playfair text-4xl md:text-6xl mb-6">{t('title')}</h1>
            <p className="font-inter text-base opacity-80 mb-12 max-w-md">{t('message')}</p>
            <Link
                href="/"
                className="font-inter text-[10px] uppercase tracking-[0.2em] border border-[var(--mucco-pisano)] rounded-full px-8 py-4 transition-colors hover:bg-[var(--mucco-pisano)] hover:text-[var(--background)]"
            >
                {t('ctaLabel')}
            </Link>
        </main>
    );
}
