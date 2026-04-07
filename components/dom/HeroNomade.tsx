'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CucinaNomadeData } from '@/lib/data/cucinaNomade';

gsap.registerPlugin(ScrollTrigger);

export default function HeroNomade({ data }: { data: CucinaNomadeData['hero'] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !textRef.current || !bgRef.current) return;

        // Intro animation for all text nodes
        gsap.fromTo(textRef.current.children, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
        );

        // Parallax on scroll (only background moves slightly to create depth)
        // Restricting parallax to a very subtle 15% instead of massive DOM shifts
        gsap.to(bgRef.current, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-[90vh] sm:h-screen flex items-center justify-center overflow-hidden bg-black">
            
            {/* Parallax Background Container */}
            <div ref={bgRef} className="absolute -top-[10%] left-0 w-full h-[120%] z-0">
                {data.videoEnabled ? (
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover"
                        style={{ filter: 'brightness(0.5)' }}
                        poster={data.fallbackImage}
                    >
                        <source src={data.videoSrc} type="video/mp4" />
                    </video>
                ) : (
                    <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${data.fallbackImage})`, filter: 'brightness(0.5)' }}
                    />
                )}
            </div>

            {/* Typography */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4" ref={textRef}>
                <p className="font-playfair italic text-3xl sm:text-4xl text-[var(--tufo)] mb-4" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
                    {data.titleSmall}
                </p>
                <h1 className="font-inter font-black tracking-[-0.04em] text-6xl sm:text-8xl md:text-[9rem] text-[var(--ecru)] uppercase leading-none mix-blend-overlay">
                    {data.titleBig}
                </h1>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
                <span className="font-inter text-[10px] tracking-[0.2em] text-white opacity-70 uppercase">
                    {data.scrollText}
                </span>
                <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                    <div className="w-full h-full bg-white absolute top-0 left-0 animate-scroll-down origin-top" />
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll-down {
                    0% { transform: scaleY(0); transform-origin: top; }
                    50% { transform: scaleY(1); transform-origin: top; }
                    50.1% { transform: scaleY(1); transform-origin: bottom; }
                    100% { transform: scaleY(0); transform-origin: bottom; }
                }
                .animate-scroll-down {
                    animation: scroll-down 2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
                }
            `}</style>
        </section>
    );
}
