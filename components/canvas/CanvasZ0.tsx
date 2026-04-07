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
    const canvasEnabled = useAppStore((s) => s.canvasEnabled);
    const pathname = usePathname();

    const showSky = pathname === '/' || pathname === '/olio' || pathname === '/la-filiera';

    // Canvas disattivato: sfondo CSS statico come fallback leggero
    if (!canvasEnabled) {
        return (
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: -10,
                    pointerEvents: 'none',
                    background: showSky
                        ? 'linear-gradient(180deg, #FFF4DB 0%, #B6CBE1 35%, #E69A7A 70%, #0F1722 100%)'
                        : '#ECE8DF',
                }}
            />
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -10,
                pointerEvents: 'none',
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
