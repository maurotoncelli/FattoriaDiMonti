'use client';

import { useAppStore } from '@/store/useAppStore';
import { useRouter, Link } from '@/i18n/routing';
import { ReactNode } from 'react';

interface TransitionLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    bgColor?: string;
    transitionKeyword?: string;
}

export default function TransitionLink({ 
    href, 
    children, 
    className,
    bgColor = '#181A15',
    transitionKeyword,
}: TransitionLinkProps) {
    const router = useRouter();
    const { startPageTransition } = useAppStore();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        startPageTransition(href, bgColor, transitionKeyword);

        // Naviga a 900ms: con power4.inOut il sipario è già al 97% chiuso
        // (overlay copre lo schermo) → la nuova pagina monta DIETRO il sipario ancora coperto.
        // NON aspettare 1200ms: causerebbe race condition con GSAP onComplete.
        setTimeout(() => {
            router.push(href, { scroll: true });
        }, 900);
    };

    return (
        <Link href={href as any} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
}
