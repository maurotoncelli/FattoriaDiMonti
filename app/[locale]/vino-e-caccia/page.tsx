'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Pagina temporaneamente nascosta — reindirizza alla home
export default function VinoPage() {
    const router = useRouter();
    useEffect(() => { router.replace('/'); }, [router]);
    return null;
}
