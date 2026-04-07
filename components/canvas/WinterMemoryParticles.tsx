'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';

export default function WinterMemoryParticles({ visible }: { visible: boolean }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const resetEasterEgg = useAppStore((s) => s.resetEasterEgg);
    const count = 8000;

    const { positions, dummy } = useMemo(() => {
        const positions: THREE.Vector3[] = [];
        for (let i = 0; i < count; i++) {
            positions.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 12,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 4
                )
            );
        }
        return { positions, dummy: new THREE.Object3D() };
    }, [count]);

    const progressRef = useRef(0);
    const phaseRef = useRef<'idle' | 'appear' | 'gallop' | 'dissolve'>('idle');

    useEffect(() => {
        if (visible) {
            phaseRef.current = 'appear';
            progressRef.current = 0;

            // Stop Lenis
            if ((window as any).__lenis) (window as any).__lenis.stop();

            // Auto-reset after 5s
            const timer = setTimeout(() => {
                phaseRef.current = 'dissolve';
                setTimeout(() => {
                    phaseRef.current = 'idle';
                    resetEasterEgg();
                    if ((window as any).__lenis) (window as any).__lenis.start();
                }, 1500);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [visible, resetEasterEgg]);

    useFrame((_, delta) => {
        if (!meshRef.current || phaseRef.current === 'idle') return;

        progressRef.current += delta;
        const t = progressRef.current;

        for (let i = 0; i < count; i++) {
            const basePos = positions[i];

            // Gallop movement: particles sweep from right to left
            const xOffset = phaseRef.current === 'gallop' ? -t * 1.5 : 0;
            const yWave = Math.sin(t * 3 + i * 0.1) * 0.15;
            const opacityFade = phaseRef.current === 'dissolve' ? Math.max(0, 1 - (t - 3.5) * 2) : 1;

            dummy.position.set(
                basePos.x + xOffset,
                basePos.y + yWave,
                basePos.z
            );
            const scale = 0.025 * opacityFade;
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }

        if (phaseRef.current === 'appear' && t > 1) phaseRef.current = 'gallop';
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    if (!visible) return null;

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 4, 4]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.85} />
        </instancedMesh>
    );
}
