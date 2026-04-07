'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CucinaNomadeData } from '@/lib/data/cucinaNomade';

gsap.registerPlugin(ScrollTrigger);

export default function ManifestoNavigante({ data }: { data: CucinaNomadeData['manifesto'] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    { 
                        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 85%" }
                    }
                );
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[var(--background)] relative">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                
                {/* Left Col: Tagline & Stats */}
                <div className="md:col-span-4 flex flex-col justify-between">
                    <div className="font-inter text-[10px] tracking-[0.2em] text-[var(--argilla-ferrosa)] uppercase mb-12 fade-up-text opacity-0">
                        ✦ {data.tagline}
                    </div>

                    <div className="flex flex-col gap-6 mt-12 md:mt-0">
                        {data.stats.map((stat, idx) => (
                            <div key={idx} className="border-t border-[var(--muccoPisano)]/10 pt-4 flex flex-col gap-2 fade-up-text opacity-0">
                                <span className="font-inter text-[9px] tracking-[0.15em] text-[var(--olive)] uppercase">
                                    {stat.label}
                                </span>
                                <span className="font-playfair italic text-2xl md:text-3xl text-[var(--muccoPisano)]">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Title & Text */}
                <div className="md:col-span-7 md:col-start-6 flex flex-col gap-12">
                    <h2 className="font-playfair italic text-5xl md:text-7xl lg:text-8xl text-[var(--muccoPisano)] leading-[0.95] tracking-tight fade-up-text opacity-0">
                        {data.title}
                    </h2>
                    
                    <div className="flex flex-col gap-8 max-w-2xl font-inter text-base md:text-lg text-[var(--muccoPisano)]/70 leading-relaxed font-light">
                        {data.paragraphs.map((p, idx) => (
                            <p key={idx} className="fade-up-text opacity-0">{p}</p>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
