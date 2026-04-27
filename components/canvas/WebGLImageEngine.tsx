'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { usePathname } from '@/i18n/routing';

interface WebGLImageProps {
    el: HTMLElement;
    texture: THREE.Texture;
    effect: string;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const noiseFunctions = `
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
`;

const materializationFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uVisibility; // 0.0 fuori schermo, 1.0 completamente visibile
  uniform float uParallaxX; // Da -1.0 a 1.0
  uniform float uParallaxY; // Da -1.0 a 1.0
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  varying vec2 vUv;
  
  ${noiseFunctions}
  
  void main() {
    // Object-fit: cover logic
    vec2 uv = vUv;
    float scaleX = 1.0;
    float scaleY = 1.0;
    if (uPlaneAspect > uImageAspect) {
        scaleY = uImageAspect / uPlaneAspect;
    } else {
        scaleX = uPlaneAspect / uImageAspect;
    }
    uv = (uv - 0.5) * vec2(scaleX, scaleY) + 0.5;

    // Aggiungiamo un leggero zoom per evitare bordi tagliati durante la parallasse più forte
    // Zoom in del ~15%
    uv = (uv - 0.5) * 0.85 + 0.5;
    
    // Applichiamo l'offset di parallasse su ENTRAMBI gli assi (fino a 15% di spostamento max)
    uv.x += uParallaxX * 0.15;
    uv.y -= uParallaxY * 0.15; // INVERTITO l'asse Y per far muovere il contenuto in direzione opposta allo scroll
    
    // Per evitare quello "stretch del tappo", dobbiamo rendere trasparente il pixel 
    // se le coordinate UV escono dal range [0, 1].
    // Normalmente le texture in WebGL fanno Clamp-To-Edge ripetendo l'ultimo pixel.
    float isOutside = step(1.0, uv.x) + step(uv.x, 0.0) + step(1.0, uv.y) + step(uv.y, 0.0);
    isOutside = min(isOutside, 1.0); // Se è > 0 significa che siamo fuori

    vec4 texColor = texture2D(uTexture, uv);
    // Mascheriamo l'immagine: se siamo fuori dal bordo, alfa = 0
    texColor.a *= (1.0 - isOutside);
    
    // Calcolo della distanza dal mouse per svelare l'immagine originale
    // Moltiplichiamo per un parametro aspect nel JS se volessimo cerchi perfetti, qui ovale va bene x look organico
    vec2 distVec = uv - uMouse;
    float dist = length(distVec);
    
    // Raggio ENORME per svelare quasi tutto e niente vignetta stretta. 
    // Smoothstep morbido per una transizione impercettibile ai bordi del mouse
    float radius = 0.8;
    float revealForce = smoothstep(radius, 0.0, dist);
    
    // Generiamo l'effetto materico fine e grosso (pietra)
    float baseNoise = fbm(uv * 8.0); // Meno fitto, più macro-macchie
    float fineNoise = random(uv * 100.0) * 0.08;
    
    // Colore intonaco di base (Sabbia chiara neutra)
    vec3 plasterColor = vec3(0.92, 0.90, 0.88) - fineNoise;
    
    // Rimuoviamo trasparenze png: uniamo la foto su sfondo intonaco
    vec3 solidImageColor = mix(plasterColor, texColor.rgb, texColor.a);
    
    // L'immagine "a riposo" (fuori dall'impatto del mouse).
    vec3 fadedImage = mix(solidImageColor, plasterColor * solidImageColor, 0.15 + baseNoise * 0.15);
    
    // Risultato con il cursore
    vec3 baseFinalColor = mix(fadedImage, solidImageColor, revealForce);
    
    // EFFETTO MATERIALIZZAZIONE VISIBILITÀ:
    // Come si svela? Non svanendo semplicemente, ma come se la pittura prendesse corpo dall'intonaco.
    // Usiamo il noise per sfrangiarne l'apparizione.
    float apparitionThreshold = smoothstep(0.0, 0.5, uVisibility + baseNoise * 0.3 - 0.15);
    
    // Mix con il colore dell'aria/cielo in base alla threshold di visibilità
    // Se apparitionThreshold = 0 (appena entra), il pixel è trasparente
    
    gl_FragColor = vec4(baseFinalColor, apparitionThreshold);
  }
`;

function WebGLImage({ el, texture, effect }: WebGLImageProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size, viewport } = useThree();
    
    const uniforms = useMemo(() => {
        const imgAspect = texture.image ? texture.image.width / texture.image.height : 1.0;
        return {
            uTexture: { value: texture },
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uVisibility: { value: 0.0 }, // Nuovo uniform per l'apparizione
            uParallaxX: { value: 0.0 }, // Parallasse Orizzontale
            uParallaxY: { value: 0.0 },  // Parallasse Verticale
            uImageAspect: { value: imgAspect },
            uPlaneAspect: { value: 1.0 }
        };
    }, [texture]);

    useFrame((state) => {
        if (!meshRef.current) return;
        
        // Sync position and scale with DOM
        const rect = el.getBoundingClientRect();
        
        // Convert screen coordinates to Three.js coordinates
        const width = (rect.width / size.width) * viewport.width;
        const height = (rect.height / size.height) * viewport.height;
        const x = ((rect.left + rect.width / 2) / size.width) * viewport.width - viewport.width / 2;
        const y = -((rect.top + rect.height / 2) / size.height) * viewport.height + viewport.height / 2;
        
        meshRef.current.scale.set(width, height, 1);
        meshRef.current.position.set(x, y, 0);
        
        // Update uniforms
        uniforms.uPlaneAspect.value = rect.width / rect.height;
        uniforms.uTime.value = state.clock.getElapsedTime();
        
        // --- LOGICA UNIVERSALE Orizzontale + Verticale ---
        const windowCenterX = window.innerWidth / 2;
        const windowCenterY = window.innerHeight / 2;
        
        const rectCenterX = rect.left + rect.width / 2;
        const rectCenterY = rect.top + rect.height / 2;
        
        const distFromCenterRawX = rectCenterX - windowCenterX;
        const distFromCenterRawY = rectCenterY - windowCenterY;
        
        // 1. Parallasse: calcoliamo il target su entrambe le direzioni
        // Mappato tra -1.0 e 1.0 in base allo spostamento relativo allo schermo
        const parallaxTargetX = Math.max(-1.0, Math.min(1.0, distFromCenterRawX / (window.innerWidth * 0.5)));
        const parallaxTargetY = Math.max(-1.0, Math.min(1.0, distFromCenterRawY / (window.innerHeight * 0.5)));
        
        // 2. Visibilità/Materializzazione basata sull'intersezione con il viewport
        // Questo approccio supporta elementi disallineati (non al centro perfetto)
        // senza farli scomparire prima del tempo.
        const marginY = Math.min(window.innerHeight * 0.25, rect.height * 0.5);
        let visY = 0;
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
             const distFromTopEdge = rect.bottom; 
             const distFromBottomEdge = window.innerHeight - rect.top; 
             const depthY = Math.min(distFromTopEdge, distFromBottomEdge);
             visY = Math.min(1.0, depthY / marginY);
        }

        const marginX = Math.min(window.innerWidth * 0.25, rect.width * 0.5);
        let visX = 0;
        if (rect.right > 0 && rect.left < window.innerWidth) {
             const distFromLeftEdge = rect.right;
             const distFromRightEdge = window.innerWidth - rect.left;
             const depthX = Math.min(distFromLeftEdge, distFromRightEdge);
             visX = Math.min(1.0, depthX / marginX);
        }
        
        // L'elemento è visivamente "pronto" se è ben dentro i margini in entrambe le direzioni
        let vis = Math.min(visX, visY);
        
        // Applichiamo interpolazione lineare (lerp) per rendere il movimento fluido
        uniforms.uVisibility.value += (vis - uniforms.uVisibility.value) * 0.12;
        uniforms.uParallaxX.value += (parallaxTargetX - uniforms.uParallaxX.value) * 0.08;
        uniforms.uParallaxY.value += (parallaxTargetY - uniforms.uParallaxY.value) * 0.08;

        // Mouse tracking updates uniformly for all effects
        const pointer = state.pointer; // -1 to +1
        // Map pointer to 0..1 relative to the element (approx)
        uniforms.uMouse.value.set(
            (pointer.x * viewport.width / 2 - (x - width/2)) / width,
            (pointer.y * viewport.height / 2 - (y - height/2)) / height
        );
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={materializationFragmentShader}
                uniforms={uniforms}
                transparent
            />
        </mesh>
    );
}

export default function WebGLImageEngine() {
    const [images, setImages] = useState<{el: HTMLElement, src: string, effect: string}[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        let scanFrame: number | null = null;

        // Funzione per raccogliere le immagini
        const scanForImages = () => {
            const elements = Array.from(document.querySelectorAll('[data-webgl-media="true"]')) as HTMLElement[];
            const validImages = elements.map(el => ({
                el,
                src: el.getAttribute('data-texture-src') || '',
                effect: el.getAttribute('data-effect-type') || 'displacement'
            })).filter(img => img.src !== '');
            
            setImages(current => {
                if (current.length === validImages.length && current.every((img, i) => img.el === validImages[i].el && img.src === validImages[i].src)) {
                    return current; // No changes, prevent re-render
                }
                return validImages;
            });
        };

        const scheduleScan = () => {
            if (scanFrame !== null) return;
            scanFrame = window.requestAnimationFrame(() => {
                scanFrame = null;
                scanForImages();
            });
        };

        // Scan immediato
        scanForImages();

        // Ritardiamo ulteriori scan per accomodare i tempi del router (re-hydration / page transitions)
        const timeout1 = setTimeout(scanForImages, 100);
        const timeout2 = setTimeout(scanForImages, 500);
        const timeout3 = setTimeout(scanForImages, 1000);

        // Fallback robustissimo: MutationObserver per quando React monta l'albero in differita
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            for (let mutation of mutations) {
                if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                    shouldScan = true;
                    break;
                }
            }
            if (shouldScan) scheduleScan();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            if (scanFrame !== null) window.cancelAnimationFrame(scanFrame);
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
            observer.disconnect();
        };
    }, [pathname]);

    if (images.length === 0) return null;

    return (
        <>
            {images.map((img, i) => (
                <WebGLTextureWrapper key={`${pathname}-${i}`} img={img} />
            ))}
        </>
    );
}

import { Suspense } from 'react';

function WebGLTextureWrapper({ img }: { img: {el: HTMLElement, src: string, effect: string} }) {
    return (
        <Suspense fallback={null}>
            <WebGLImageLoader img={img} />
        </Suspense>
    );
}

function WebGLImageLoader({ img }: { img: {el: HTMLElement, src: string, effect: string} }) {
    const texture = useTexture(img.src);
    return <WebGLImage el={img.el} texture={texture} effect={img.effect} />;
}
