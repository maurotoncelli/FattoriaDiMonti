'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import SkyNoiseShader from './SkyNoiseShader';
import WinterMemoryParticles from './WinterMemoryParticles';
import WebGLImageEngine from './WebGLImageEngine';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from '@/i18n/routing';

export default function CanvasZ0() {
    const easterEggTriggered = useAppStore((s) => s.easterEggTriggered);
    const pathname = usePathname();

    // Se non siamo in Home Page, applichiamo un blur al canvas per dare un "effetto vetro" (Glassmorphism) 
    // su cui l'utente leggerà gli approfondimenti testuali.
    const showSky = pathname === '/' || pathname === '/olio' || pathname === '/la-filiera';

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -10,
                pointerEvents: 'none',
                opacity: 1, // Fixed: don't hide the canvas on inner pages so WebGLImageEngine can work
                transition: 'opacity 1.2s cubic-bezier(0.76, 0, 0.24, 1)' // power4.inOut equivalent
            }}
            aria-hidden="true"
        >
            <Canvas
                aria-hidden="true"
                role="presentation"
                tabIndex={-1}
                dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1]}
                gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.6} />
                    {showSky && <SkyNoiseShader />}
                    <WebGLImageEngine />
                    <WinterMemoryParticles visible={easterEggTriggered} />
                </Suspense>
            </Canvas>
        </div>
    );
}
