'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CucinaNomadeData } from '@/lib/data/cucinaNomade';

gsap.registerPlugin(ScrollTrigger);

export default function CrewNomade({ data }: { data: CucinaNomadeData['crew'] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Testi
            gsap.utils.toArray('.fade-up-text').forEach((el: any) => {
                gsap.fromTo(el, 
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }
                );
            });

            // Card Entrance individualmente
            gsap.utils.toArray('.crew-member').forEach((el: any) => {
                gsap.fromTo(el,
                    { opacity: 0, scale: 0.95, y: 40 },
                    { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
                );
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full py-24 md:py-32 bg-[#121110] relative border-t border-[var(--tufo)]/10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                
                <div className="flex flex-col items-center text-center mb-20">
                    <span className="font-inter text-[10px] tracking-[0.2em] text-[var(--argilla-ferrosa)] uppercase mb-6 fade-up-text opacity-0">
                        ✦ {data.tagline}
                    </span>
                    <h2 className="font-playfair italic text-4xl md:text-6xl text-[var(--ecru)] mb-6 fade-up-text opacity-0">
                        {data.title}
                    </h2>
                    <p className="font-inter text-base text-[var(--ecru)]/60 max-w-xl font-light fade-up-text opacity-0">
                        {data.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 items-start">
                    {data.members.map((member, idx) => (
                        <div key={member.id} className={`crew-member flex flex-col group cursor-none ${idx === 1 ? 'md:mt-32' : ''}`}>
                            <div className="w-full aspect-[3/4] relative overflow-hidden mb-6 bg-[var(--tufo)]/5">
                                <img 
                                    src={member.image} 
                                    alt={member.name}
                                    className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0 filter brightness-90"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                            </div>
                            
                            <h3 className="font-playfair italic text-2xl text-[var(--tufo)] mb-1 fade-up-text opacity-0">
                                {member.name}
                            </h3>
                            <div className="font-inter text-[10px] tracking-[0.15em] text-[var(--olive)] uppercase mb-4 pb-4 border-b border-[var(--ecru)]/10 fade-up-text opacity-0">
                                {member.role}
                            </div>
                            <p className="font-inter text-sm text-[var(--ecru)]/50 italic leading-relaxed fade-up-text opacity-0">
                                "{member.quote}"
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
