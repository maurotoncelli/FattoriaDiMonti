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

        // 2. Aspettiamo che il sipario copra (es. 1.2s della durata GSAP), poi cambiamo rotta
        setTimeout(() => {
            router.push(href, { scroll: true });
        }, 1200); 
    };

    return (
        <Link href={href as any} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
}
