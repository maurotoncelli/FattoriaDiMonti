'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '@/store/useAppStore';
import { CucinaNomadeData } from '@/lib/data/cucinaNomade';

gsap.registerPlugin(ScrollTrigger);

export default function BookingNomade({ data }: { data: CucinaNomadeData['booking'] }) {
    const { setConciergeOpen } = useAppStore();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }
                );
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const openConcierge = () => {
        setConciergeOpen(true, 'cucina-nomade');
    };

    return (
        <section ref={containerRef} className="w-full h-[60vh] min-h-[500px] bg-[var(--background)] relative flex items-center justify-center overflow-hidden border-t border-[var(--muccoPisano)]/10">
            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl px-6">
                <h2 className="font-playfair italic text-5xl md:text-7xl text-[var(--muccoPisano)] mb-6 fade-up-text opacity-0">
                    {data.title}
                </h2>
                <p className="font-inter text-base md:text-lg text-[var(--muccoPisano)]/70 font-light mb-12 fade-up-text opacity-0">
                    {data.description}
                </p>

                <button 
                    onClick={openConcierge}
                    className="group relative px-10 py-4 bg-transparent border border-[var(--argilla-ferrosa)] text-[var(--argilla-ferrosa)] overflow-hidden cursor-none fade-up-text opacity-0"
                >
                    <div className="absolute inset-0 bg-[var(--argilla-ferrosa)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]" />
                    <span className="relative z-10 font-inter text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 group-hover:text-white">
                        {data.ctaLabel}
                    </span>
                </button>
            </div>
        </section>
    );
}
