'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Piatto su Z=0
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColorSky;
  uniform vec3 uColorCloud;
  uniform float uScroll;

  varying vec2 vUv;

  // Funzioni noise
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st * frequency);
      st += vec2(0.1, 0.3);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Coordinate base
    vec2 uv = vUv;
    
    // Movimento lento delle nuvole nel tempo e interazione con scroll e cursore
    vec2 cloudMovement = vec2(uTime * 0.05, uScroll * 0.002);
    
    // Il cursore sposta leggermente le nuvole (effetto parallasse orizzontale)
    // uMouse va da -1 a 1 circa
    vec2 mouseOffset = uMouse * 0.1; 
    
    vec2 st = uv * 3.0 + cloudMovement - mouseOffset;

    // Generazione della nuvola tramite FBM
    float q = fbm(st);
    float f = fbm(st + q);
    
    // Maschera per le nuvole (isolare i picchi di bianco)
    float cloudDensity = smoothstep(0.3, 0.8, f);

    // Colore finale
    vec3 color = mix(uColorSky, uColorCloud, cloudDensity * 0.8);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function SkyNoiseShader() {
    const meshRef = useRef<THREE.Mesh>(null);
    const mousePos = useRef(new THREE.Vector2(0, 0));
    const scrollVelocity = useAppStore((s) => s.scrollVelocity);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uScroll: { value: 0 },
            // Azzurro cielo toscano desaturato e bianco caldo nuvola
            uColorSky: { value: new THREE.Color('#B6CBE1') }, 
            uColorCloud: { value: new THREE.Color('#F7F9FB') },
        }),
        []
    );

    const colorStops = useMemo(() => [
        { progress: 0.00, sky: new THREE.Color('#FFF4DB'), cloud: new THREE.Color('#FFFFFF') }, // Dawn (Giallino Fresco Mattutino - Alba)
        { progress: 0.33, sky: new THREE.Color('#B6CBE1'), cloud: new THREE.Color('#F7F9FB') }, // Afternoon (Azzurro Pomeridiano)
        { progress: 0.66, sky: new THREE.Color('#E69A7A'), cloud: new THREE.Color('#FADBB3') }, // Sunset (Tramonto Serale - Arancio)
        { progress: 1.00, sky: new THREE.Color('#0F1722'), cloud: new THREE.Color('#2A3546') }, // Night (Limpidezza Notturna)
    ], []);

    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
        // Mouse damping
        uniforms.uMouse.value.lerp(mousePos.current, 0.05);
        uniforms.uScroll.value += (scrollVelocity - uniforms.uScroll.value) * 0.1;

        // Mouse normalizzato (-1 a 1)
        const pointer = state.pointer;
        mousePos.current.set(pointer.x, pointer.y);

        // --- Transizione Colore Cielo / Nuvole Basata Sulla Percentuale di Scroll ---
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        // Clamp progress between 0.0 and 1.0
        const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
        
        let startIndex = 0;
        let endIndex = 1;
        for (let i = 0; i < colorStops.length - 1; i++) {
            if (progress >= colorStops[i].progress && progress <= colorStops[i + 1].progress) {
                startIndex = i;
                endIndex = i + 1;
                break;
            }
        }
        
        const start = colorStops[startIndex];
        const end = colorStops[endIndex];
        const range = end.progress - start.progress;
        const factor = range > 0 ? (progress - start.progress) / range : 0;
        
        // Eseguire l'interpolazione (lerp) per ottenere una transizione fluida e proporzionale
        uniforms.uColorSky.value.copy(start.sky).lerp(end.sky, factor);
        uniforms.uColorCloud.value.copy(start.cloud).lerp(end.cloud, factor);
    });

    return (
        // Lo spostiamo leggermente indietro su Z in modo che sia sicuro dietro alle immagini (Z=0)
        // Usiamo un piano che guarda la camera
        <mesh ref={meshRef} position={[0, 0, -2]}>
            <planeGeometry args={[20, 15, 1, 1]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={false}
                depthWrite={false}
            />
        </mesh>
    );
}
