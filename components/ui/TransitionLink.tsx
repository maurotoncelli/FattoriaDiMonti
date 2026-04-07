'use client';

import { useAppStore } from '@/store/useAppStore';
import { Link } from '@/i18n/routing';
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
    const { startPageTransition } = useAppStore();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Avvia la transizione: l'overlay stesso naviga nel suo onComplete GSAP,
        // quando è garantito al 100% sullo schermo. Zero setTimeout, zero race condition.
        startPageTransition(href, bgColor, transitionKeyword);
    };

    return (
        <Link href={href as any} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
}
